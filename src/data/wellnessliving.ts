// Single source of truth for WellnessLiving purchase links.
//
// Pages must never hardcode a catalog URL. WellnessLiving changes a product's
// id whenever staff edit or recreate it, and the stale link then serves
// "Systems Error: Promotion does not exist" with HTTP 200 — a customer sees an
// error page and nothing on our side notices. Routing every link through here
// means the weekly healer only has to rewrite one JSON file.
//
// See scripts/heal-wellnessliving-links.mjs and .github/workflows/weekly-link-check.yml

import catalog from './wellnessliving-products.json';

export type WlProductKey = keyof typeof catalog.products;

export const WL_BUSINESS = catalog.business;
export const wlProducts = catalog.products;

/** Purchase URL for a catalog product. */
export function wlCatalogUrl(key: WlProductKey): string {
	const product = wlProducts[key];
	if (!product) {
		throw new Error(
			`Unknown WellnessLiving product "${key}". Known keys: ${Object.keys(wlProducts).join(', ')}`
		);
	}
	const params = new URLSearchParams({
		k_business: WL_BUSINESS,
		id_sale: String(product.idSale),
		k_id: String(product.kId),
	});
	return `https://www.wellnessliving.com/rs/catalog-view.html?${params}`;
}

// FitVID on Demand — our library of short online classes.
//
// This is a link-out, not an embed, and it cannot become one: every response
// from wellnessliving.com carries `X-Frame-Options: DENY`, so no browser will
// render it inside an iframe on our site. WellnessLiving's widget system
// (skin-widget-static.js, used on /schedule and the homepage signup) offers no
// video widget either — Schedule, Custom Schedule, FitBUILDER, Appointment,
// Event, Book-a-Spot, Lead Capture, Review, Store and Staff are the only types.
// Verified 2026-09-03.
//
// Not covered by `npm run check:links`: that checker only scans /rs/ catalog
// URLs, and the members category redirects to the WellnessLiving login, which
// the body check would read as a failure. If a video category is ever recreated
// in WellnessLiving, its id changes here by hand.
//
// The two categories differ by who can watch, which is a setting on the
// category inside WellnessLiving, not something we control from this file:
//   members — viewing restricted, so it bounces to the login page first.
//   free    — no viewing restriction, so it plays for anyone, signed out.
// Free access verified 2026-09-04 in a clean browser: no redirect, no paywall,
// video source loads and plays.
const WL_FITVID_CATEGORIES = {
	members: 'I5kfh5Sa',
	free: 'tWU81DxwdJMzTHBHPHswhm',
} as const;

export type WlFitVidCategory = keyof typeof WL_FITVID_CATEGORIES;

/**
 * A FitVID on Demand video catalog.
 *
 * 'members' (the default) requires a client sign-in; 'free' is open to anyone.
 */
export function wlFitVidUrl(category: WlFitVidCategory = 'members'): string {
	const params = new URLSearchParams({
		k_business: WL_BUSINESS,
		k_video_category: WL_FITVID_CATEGORIES[category],
	});
	return `https://www.wellnessliving.com/Wl/Video/Catalog/Catalog.html?${params}`;
}
