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
