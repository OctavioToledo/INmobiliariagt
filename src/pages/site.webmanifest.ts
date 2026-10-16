import type { APIRoute } from 'astro';
import { sitio } from '../config/sitio';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: sitio.nombre,
      short_name: 'Gerardo Tello',
      description: sitio.descripcion,
      lang: 'es-AR',
      start_url: '/',
      display: 'browser',
      background_color: '#edf0ee',
      theme_color: '#2e4a3b',
      icons: [
        { src: '/icono-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icono-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icono-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    }),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
