// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// URL pública del sitio. En Cloudflare Pages definí SITE_URL (ej. https://2inmobiliaria.com.ar).
const site = process.env.SITE_URL ?? 'https://2inmobiliaria.com.ar';

export default defineConfig({
  site,
  // Cloudflare Pages sirve /ruta.html como /ruta: URLs limpias, sin barra final ni redirecciones.
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'always' },
  integrations: [sitemap()],
});
