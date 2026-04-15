const STRAPI_URL = import.meta.env.STRAPI_URL || 'https://lovemore-cms.onrender.com';

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
 * Helper to get image URL from Strapi media field.
 * In production, routes through Netlify Image CDN so images are cached at
 * the edge and served without hitting the Render origin every time.
 */
export function getStrapiMedia(url: string | null): string | null {
  if (!url) return null;

  const fullUrl = url.startsWith('http') ? url : `${STRAPI_URL}${url}`;

  if (import.meta.env.PROD) {
    return `/.netlify/images?url=${fullUrl}`;
  }

  return fullUrl;
}
