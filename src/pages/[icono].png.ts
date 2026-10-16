import type { APIRoute, GetStaticPaths } from 'astro';
import { iconoPng } from '../lib/og';

// Tamaño y margen de cada ícono. El maskable deja un 10% de aire para el recorte de Android.
const ICONOS = {
  'apple-touch-icon': [180, 0],
  'icono-32': [32, 0],
  'icono-192': [192, 0],
  'icono-512': [512, 0],
  'icono-maskable-512': [512, 52],
} as const;

export const getStaticPaths = (() =>
  Object.keys(ICONOS).map((icono) => ({ params: { icono } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const [tamano, margen] = ICONOS[params.icono as keyof typeof ICONOS];
  return new Response(new Uint8Array(await iconoPng(tamano, margen)), { headers: { 'Content-Type': 'image/png' } });
};
