const STRAPI_URL = import.meta.env.STRAPI_URL || 'http://127.0.0.1:1337';

interface FetchOptions {
  endpoint: string;
  query?: Record<string, any>;
  wrappedByKey?: string;
  wrappedByList?: boolean;
}

/**
 * Fetch data from Strapi API
 */
export async function fetchAPI<T>(options: FetchOptions): Promise<T> {
  const { endpoint, query, wrappedByKey, wrappedByList } = options;

  const url = new URL(`/api/${endpoint}`, STRAPI_URL);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
  }

  let data = await response.json();

  // Unwrap data if needed
  if (wrappedByKey) {
    data = data[wrappedByKey];
  }

  if (wrappedByList) {
    data = data[0];
  }

  return data as T;
}

/**
 * Helper to get image URL from Strapi media field
 */
export function getStrapiMedia(url: string | null): string | null {
  if (!url) return null;

  // If it's already a full URL, return it
  if (url.startsWith('http')) return url;

  // Otherwise, prepend the Strapi URL
  return `${STRAPI_URL}${url}`;
}
