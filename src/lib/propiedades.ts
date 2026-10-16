/**
 * Único punto de acceso a las propiedades. Ningún componente lee el JSON directo:
 * cuando se conecte Wasi solo cambia el loader de la colección (src/content.config.ts).
 */
import { getCollection } from 'astro:content';
import type { DatosPropiedad } from '../content.config';
import { ordenar, type Filtrable } from './filtros';
import type { Operacion, Tipo } from './formato';

export type Propiedad = DatosPropiedad;

export async function obtenerPropiedades(): Promise<Propiedad[]> {
  const entradas = await getCollection('propiedades');
  return ordenar(
    entradas.map((e) => e.data),
    'recientes',
  );
}

export async function obtenerDestacadas(max = 6): Promise<Propiedad[]> {
  const todas = await obtenerPropiedades();
  return todas.filter((p) => p.destacada && p.disponibilidad === 'disponible').slice(0, max);
}

/** Misma operación, priorizando mismo tipo y misma zona. */
export function similares(p: Propiedad, todas: readonly Propiedad[], max = 3): Propiedad[] {
  const puntaje = (q: Propiedad) => (q.tipo === p.tipo ? 2 : 0) + (q.zona === p.zona ? 1 : 0);
  return todas
    .filter((q) => q.codigo !== p.codigo && q.operacion === p.operacion)
    .map((q, i) => ({ q, i, s: puntaje(q) }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .slice(0, max)
    .map(({ q }) => q);
}

export type Conteo = Record<Operacion, { total: number; tipos: Partial<Record<Tipo, number>> }>;

/** Cantidades por operación y tipo, para el selector del inicio. */
export function contar(lista: readonly Filtrable[]): Conteo {
  const conteo: Conteo = { alquiler: { total: 0, tipos: {} }, venta: { total: 0, tipos: {} } };
  for (const p of lista) {
    const c = conteo[p.operacion];
    c.total += 1;
    c.tipos[p.tipo] = (c.tipos[p.tipo] ?? 0) + 1;
  }
  return conteo;
}

export function zonas(lista: readonly Propiedad[]): string[] {
  return [...new Set(lista.map((p) => p.zona))].sort((a, b) => a.localeCompare(b, 'es'));
}

export function urlPropiedad(p: Pick<Propiedad, 'slug'>): string {
  return `/propiedades/${p.slug}`;
}

/** "2 dormitorios, 1 baño" para descripciones y SEO. Solo los datos que existen. */
export function resumenAmbientes(p: Propiedad): string {
  const partes: string[] = [];
  if (p.dormitorios) partes.push(`${p.dormitorios} ${p.dormitorios === 1 ? 'dormitorio' : 'dormitorios'}`);
  if (p.banos) partes.push(`${p.banos} ${p.banos === 1 ? 'baño' : 'baños'}`);
  if (p.cocheras) partes.push(`${p.cocheras} ${p.cocheras === 1 ? 'cochera' : 'cocheras'}`);
  if (p.superficieTotal) partes.push(`${p.superficieTotal} m²`);
  return partes.join(', ');
}
