/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly STRAPI_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Alpine.js type declarations
declare module 'alpinejs' {
  const Alpine: any;
  export default Alpine;
}

declare module '@alpinejs/intersect' {
  const intersect: any;
  export default intersect;
}

declare module '@alpinejs/collapse' {
  const collapse: any;
  export default collapse;
}

interface Window {
  Alpine: any;
}
