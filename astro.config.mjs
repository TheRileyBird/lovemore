// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig(({ command }) => ({
  site: 'https://lovemoremcc.com',
  output: 'static',
  adapter: command === 'build' ? netlify() : undefined,
  vite: {
    plugins: [tailwindcss()]
  }
}));
