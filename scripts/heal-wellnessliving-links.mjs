#!/usr/bin/env node
// Finds WellnessLiving product ids that have changed and repairs them in
// src/data/wellnessliving-products.json.
//
// Background: on 2026-09-01 a student could not buy the intro pass. WellnessLiving
// had changed the promotion id; the old link served "Systems Error: Promotion does
// not exist" with HTTP 200, so nothing noticed until a human complained.
//
// WellnessLiving's catalog API is request-signed, so this drives the real store
// page instead. Two INDEPENDENT signals must agree before any id is written:
//
//   1. Discovery. The store page asks its own API for a batch of products, and
//      the request URL carries an ordered `text_item` list of ids. Pairing that
//      order with the order of the rendered product cards gives id -> title.
//   2. Confirmation. The candidate id is loaded on its own product page, and its
//      rendered title and price must match what we expect.
//
// If the two disagree, or a match is ambiguous, nothing is written and the
// product is reported as needing a human. That is what stops this script from
// silently repointing a $56 intro pass at a $2,600 retreat.
//
// Usage: npm run heal:links [-- --dry-run]
// Exit:  0 = nothing to do, or repaired successfully
//        1 = a link is broken and could not be repaired safely (needs a human)
//        2 = could not inspect the store at all (transient; safe to retry)

import { readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const CATALOG_PATH = 'src/data/wellnessliving-products.json';
const STORE_URL = (business) =>
	`https://www.wellnessliving.com/rs/catalog-list.html?k_business=${business}`;
const PRODUCT_URL = (business, idSale, kId) =>
	`https://www.wellnessliving.com/rs/catalog-view.html?k_business=${business}&id_sale=${idSale}&k_id=${kId}`;

const TITLE_SELECTOR = 'button[class*="product-title"]';
const DRY_RUN = process.argv.includes('--dry-run');
const NAV_TIMEOUT = 45_000;
const RENDER_TIMEOUT = 30_000;

const ERROR_SIGNATURES = [
	/Systems\s+Error/i,
	/\b(?:promotion|product|class|event|page|item)\s+does\s+not\s+exist/i,
];

const log = (...args) => console.log(...args);

/** Reads the live store: ordered ids from the API request, ordered titles from the DOM. */
async function discoverLiveProducts(page, business) {
	// The page requests its products in one batch; that request URL is the only
	// place the ids are exposed without a signed API call of our own.
	const feedUrls = [];
	page.on('request', (request) => {
		const url = request.url();
		if (url.includes('/Wl/Catalog/CatalogList/Element.json') && url.includes('text_item=')) {
			feedUrls.push(url);
		}
	});

	await page.goto(STORE_URL(business), { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });
	await page.waitForSelector(TITLE_SELECTOR, { timeout: RENDER_TIMEOUT });
	// Let the whole grid settle so the DOM order is complete before we read it.
	await page.waitForLoadState('networkidle', { timeout: RENDER_TIMEOUT }).catch(() => {});

	if (feedUrls.length === 0) {
		throw new Error(
			'Never saw the CatalogList/Element.json request. WellnessLiving may have changed how the store loads.'
		);
	}

	const ids = [];
	for (const feedUrl of feedUrls) {
		const raw = new URL(feedUrl).searchParams.get('text_item');
		for (const item of JSON.parse(raw)) {
			ids.push({ idSale: item.id_sale, kId: item.k_id });
		}
	}

	const titles = await page.$$eval(TITLE_SELECTOR, (nodes) =>
		nodes.map((n) => (n.getAttribute('title') ?? n.textContent ?? '').trim())
	);

	// The pairing below is positional, so a length mismatch means the assumption
	// no longer holds and we must not guess.
	if (ids.length !== titles.length) {
		throw new Error(
			`Store layout changed: ${ids.length} ids in the product feed but ${titles.length} product cards rendered. ` +
				'Refusing to pair them positionally.'
		);
	}

	return ids.map((id, i) => ({ ...id, title: titles[i] }));
}

/** Loads one product's own page and reports what it actually renders. */
async function inspectProductPage(page, business, idSale, kId) {
	await page.goto(PRODUCT_URL(business, idSale, kId), {
		waitUntil: 'domcontentloaded',
		timeout: NAV_TIMEOUT,
	});
	// Either the product renders, or the error page does. Give the SPA a moment.
	await page
		.waitForFunction(
			() => {
				const t = document.body?.innerText ?? '';
				return t.includes('Add to cart') || /Systems\s+Error|does not exist/i.test(t);
			},
			{ timeout: RENDER_TIMEOUT }
		)
		.catch(() => {});

	const body = await page.evaluate(() => document.body?.innerText ?? '');
	for (const signature of ERROR_SIGNATURES) {
		if (signature.test(body)) return { ok: false, reason: 'WellnessLiving reports it does not exist' };
	}

	const title = await page
		.$eval('h1, [class*="product-title"]', (n) => n.textContent.trim())
		.catch(() => '');
	const price = (body.match(/\$[\d,]+\.\d{2}/) ?? [''])[0];
	return { ok: true, title, price };
}

// ---------------------------------------------------------------------------

const catalog = JSON.parse(await readFile(CATALOG_PATH, 'utf8'));
const { business, products } = catalog;

const browser = await chromium.launch();
const page = await browser.newPage({
	userAgent:
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36',
});

let live;
try {
	live = await discoverLiveProducts(page, business);
	log(`Read ${live.length} live product(s) from the WellnessLiving store.\n`);
} catch (error) {
	console.error(`Could not inspect the store: ${error.message}`);
	await browser.close();
	process.exit(2);
}

const liveById = new Map(live.map((p) => [`${p.idSale}:${p.kId}`, p]));
const repaired = [];
const needsHuman = [];

for (const [key, product] of Object.entries(products)) {
	const { label, match, idSale, kId, price } = product;
	const stillListed = liveById.has(`${idSale}:${kId}`);

	// Confirm against the product's own page, which is what a customer hits.
	const current = await inspectProductPage(page, business, idSale, kId);
	if (stillListed && current.ok) {
		log(`OK        ${label} (k_id=${kId})`);
		continue;
	}

	log(`BROKEN    ${label} (k_id=${kId}) — ${current.reason ?? 'no longer listed in the store'}`);

	// Discovery: which live product is this, by title?
	const candidates = live.filter((p) => p.title.toLowerCase().includes(match.toLowerCase()));
	if (candidates.length === 0) {
		needsHuman.push({ key, label, why: `No live product title contains "${match}".` });
		continue;
	}
	if (candidates.length > 1) {
		needsHuman.push({
			key,
			label,
			why: `"${match}" matches ${candidates.length} live products (${candidates
				.map((c) => `${c.title} [k_id=${c.kId}]`)
				.join('; ')}). Too ambiguous to pick automatically.`,
		});
		continue;
	}

	const candidate = candidates[0];
	if (candidate.kId === kId) {
		needsHuman.push({
			key,
			label,
			why: `The store still lists k_id=${kId} for "${candidate.title}", but its product page errors. This looks like a WellnessLiving-side problem, not a changed id.`,
		});
		continue;
	}

	// Confirmation: load the candidate's own page and require title + price to agree.
	const confirm = await inspectProductPage(page, business, candidate.idSale, candidate.kId);
	if (!confirm.ok) {
		needsHuman.push({
			key,
			label,
			why: `Candidate k_id=${candidate.kId} also fails to load (${confirm.reason}).`,
		});
		continue;
	}
	if (!confirm.title.toLowerCase().includes(match.toLowerCase())) {
		needsHuman.push({
			key,
			label,
			why: `Candidate k_id=${candidate.kId} renders as "${confirm.title}", which does not contain "${match}". Refusing to repoint.`,
		});
		continue;
	}
	if (confirm.price !== price) {
		needsHuman.push({
			key,
			label,
			why: `Candidate k_id=${candidate.kId} ("${confirm.title}") costs ${confirm.price}, but ${label} is expected to cost ${price}. Refusing to repoint a link at a differently priced product. If the price genuinely changed, update "price" in ${CATALOG_PATH}.`,
		});
		continue;
	}

	log(
		`  -> repairing: k_id ${kId} -> ${candidate.kId} ("${confirm.title}", ${confirm.price}), confirmed on its own product page`
	);
	products[key].kId = candidate.kId;
	products[key].idSale = candidate.idSale;
	repaired.push({ label, from: kId, to: candidate.kId, title: confirm.title, price: confirm.price });
}

await browser.close();
log();

if (repaired.length > 0 && !DRY_RUN) {
	await writeFile(CATALOG_PATH, `${JSON.stringify(catalog, null, 2)}\n`);
	log(`Updated ${CATALOG_PATH}:`);
	for (const r of repaired) log(`  ${r.label}: ${r.from} -> ${r.to} (${r.title}, ${r.price})`);
}
if (repaired.length > 0 && DRY_RUN) {
	log(`--dry-run: would update ${CATALOG_PATH} for ${repaired.length} product(s).`);
}

// Consumed by CI to decide whether to commit. This has to happen BEFORE the
// exit below: a run can both repair one product and need a human for another,
// and in that case the repair still deserves to be committed and deployed.
if (process.env.GITHUB_OUTPUT) {
	const { appendFile } = await import('node:fs/promises');
	// Keep values single-line; GITHUB_OUTPUT is newline-delimited.
	const summary = repaired
		.map((r) => `${r.label} ${r.from}->${r.to}`)
		.join(', ')
		.replace(/[\r\n]+/g, ' ');
	await appendFile(
		process.env.GITHUB_OUTPUT,
		`repaired=${repaired.length}\nsummary=${summary}\n`
	);
}

if (needsHuman.length > 0) {
	console.error(`\n${needsHuman.length} product(s) need a human:`);
	for (const n of needsHuman) console.error(`  ${n.label} (${n.key}): ${n.why}`);
	console.error(`\nStore: ${STORE_URL(business)}`);
	process.exit(1);
}

if (repaired.length === 0) {
	log('Every WellnessLiving product id is current. Nothing to do.');
}
