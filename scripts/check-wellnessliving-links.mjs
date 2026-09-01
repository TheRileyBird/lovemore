#!/usr/bin/env node
// Verifies every WellnessLiving link in src/ still resolves to a real product.
//
// Why this exists: on 2026-09-01 a student could not buy the intro pass. The
// promotion id had changed in WellnessLiving and the old link served
// "Systems Error: Promotion does not exist" — with HTTP 200. A status-code
// check sees nothing wrong, so this script reads the response body.
//
// Usage: npm run check:links

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const SRC_DIR = 'src';
const URL_PATTERN = /https:\/\/www\.wellnessliving\.com\/rs\/[^"'`<>\s)]+/g;
const ATTEMPTS = 3;
const TIMEOUT_MS = 30_000;

// WellnessLiving serves its error pages with HTTP 200, so these body
// signatures are the only reliable signal that a link is dead.
const ERROR_SIGNATURES = [
	/Systems\s+Error/i,
	/\b(?:promotion|product|class|event|page|item)\s+does\s+not\s+exist/i,
	// The error page bounces to the store index after 10s. A real product page
	// never does this.
	/<meta[^>]+http-equiv=["']refresh["'][^>]+catalog-list\.html/i,
];

async function collectSourceFiles(dir) {
	const found = [];
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) {
			found.push(...(await collectSourceFiles(path)));
		} else if (/\.(astro|ts|js|mjs|md|mdx|json|html)$/.test(entry.name)) {
			found.push(path);
		}
	}
	return found;
}

async function findLinks() {
	const links = new Map(); // url -> Set of files referencing it
	for (const file of await collectSourceFiles(SRC_DIR)) {
		const contents = await readFile(file, 'utf8');
		for (const match of contents.matchAll(URL_PATTERN)) {
			// Astro escapes & as &amp; in some contexts; normalise so the request
			// carries the real query string.
			const url = match[0].replace(/&amp;/g, '&');
			// Static assets (widget scripts) have no product behind them.
			if (/\.(js|css|png|jpe?g|svg|webp)$/i.test(url)) continue;
			if (!links.has(url)) links.set(url, new Set());
			links.get(url).add(file);
		}
	}
	return links;
}

async function fetchBody(url) {
	let lastError;
	for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
		try {
			const response = await fetch(url, {
				redirect: 'follow',
				signal: AbortSignal.timeout(TIMEOUT_MS),
				headers: {
					// Plain curl/node agents occasionally get a bot-check page.
					'User-Agent':
						'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36',
					'Accept-Language': 'en-US,en;q=0.9',
				},
			});
			return { status: response.status, body: await response.text() };
		} catch (error) {
			lastError = error;
			if (attempt < ATTEMPTS) {
				await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
			}
		}
	}
	return { networkError: lastError?.message ?? String(lastError) };
}

async function check(url, files) {
	const result = await fetchBody(url);

	if (result.networkError) {
		return { url, files, state: 'unreachable', detail: result.networkError };
	}
	if (result.status >= 400) {
		return { url, files, state: 'broken', detail: `HTTP ${result.status}` };
	}
	for (const signature of ERROR_SIGNATURES) {
		const hit = result.body.match(signature);
		if (hit) {
			return {
				url,
				files,
				state: 'broken',
				detail: `HTTP ${result.status} but body matched ${signature} (${JSON.stringify(hit[0].slice(0, 80))})`,
			};
		}
	}
	return { url, files, state: 'ok', detail: `HTTP ${result.status}` };
}

const links = await findLinks();

if (links.size === 0) {
	console.error('No WellnessLiving links found under src/. Did the pattern or the markup change?');
	process.exit(1);
}

console.log(`Checking ${links.size} WellnessLiving link(s) referenced from ${SRC_DIR}/\n`);

const results = await Promise.all([...links].map(([url, files]) => check(url, [...files])));

const broken = results.filter((r) => r.state === 'broken');
const unreachable = results.filter((r) => r.state === 'unreachable');

for (const result of results.sort((a, b) => a.url.localeCompare(b.url))) {
	const label = { ok: 'OK        ', broken: 'BROKEN    ', unreachable: 'UNREACHABLE' }[result.state];
	console.log(`${label} ${result.url.replace('https://www.wellnessliving.com/rs/', '')}`);
	if (result.state !== 'ok') {
		console.log(`            ${result.detail}`);
		console.log(`            referenced in: ${result.files.join(', ')}`);
	}
}

console.log();

if (broken.length > 0) {
	console.error(`${broken.length} WellnessLiving link(s) are dead. Customers cannot buy these.`);
	console.error('Fix: open https://www.wellnessliving.com/rs/catalog-list.html?k_business=288067,');
	console.error('click the product, and read the current id from the CatalogList/Element.json');
	console.error('request in the network tab. Then update the k_id in the files listed above.');
	process.exit(1);
}

if (unreachable.length > 0) {
	console.error(`${unreachable.length} link(s) could not be reached after ${ATTEMPTS} attempts.`);
	console.error('This is usually a transient network or WellnessLiving outage. Re-run to confirm.');
	process.exit(2);
}

console.log(`All ${results.length} WellnessLiving link(s) resolve.`);
