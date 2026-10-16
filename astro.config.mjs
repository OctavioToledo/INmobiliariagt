// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// URL pública del sitio (canonical, sitemap, imágenes para compartir y links de WhatsApp).
// Mientras sea demo es la de Cloudflare; cuando se apunte el dominio, cambiar a https://2inmobiliaria.com.ar.
// La variable de build SITE_URL, si existe, tiene prioridad.
const site = process.env.SITE_URL ?? 'https://inmobiliariagt.octatoledo7.workers.dev';

export default defineConfig({
  site,
  // Cloudflare (html_handling auto-trailing-slash) sirve /ruta.html como /ruta: URLs limpias, sin barra final ni redirecciones.
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'always' },
  integrations: [sitemap()],
});
