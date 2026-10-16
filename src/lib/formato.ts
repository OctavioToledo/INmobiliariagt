/** Formateo de textos y precios. Sin dependencias de Astro: se usa también en el navegador. */

export type Operacion = 'venta' | 'alquiler';
export type Tipo = 'casa' | 'departamento' | 'lote';
export type Moneda = 'ARS' | 'USD';

const numero = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 });

export function formatearMonto(monto: number, moneda: Moneda): string {
  return moneda === 'USD' ? `USD ${numero.format(monto)}` : `$${numero.format(monto)}`;
}

/** "$460.000 / mes", "USD 11.500" o "Consultar". */
export function formatearPrecio(p: {
  precio: number | null;
  moneda: Moneda;
  periodo: 'mensual' | null;
}): string {
  if (p.precio === null) return 'Consultar';
  const monto = formatearMonto(p.precio, p.moneda);
  return p.periodo === 'mensual' ? `${monto} / mes` : monto;
}

/** Lo que dice el cartel arriba del precio. */
export const verboCartel: Record<Operacion, string> = { venta: 'Vende', alquiler: 'Alquila' };

export const nombreOperacion: Record<Operacion, string> = { venta: 'Venta', alquiler: 'Alquiler' };
export const seccionOperacion: Record<Operacion, string> = { venta: 'Ventas', alquiler: 'Alquileres' };
export const accionOperacion: Record<Operacion, string> = { venta: 'Comprar', alquiler: 'Alquilar' };

export const nombreTipo: Record<Tipo, string> = { casa: 'Casa', departamento: 'Departamento', lote: 'Lote' };
export const nombreTipoPlural: Record<Tipo, string> = {
  casa: 'Casas',
  departamento: 'Departamentos',
  lote: 'Lotes',
};

export const monedaDeOperacion: Record<Operacion, Moneda> = { venta: 'USD', alquiler: 'ARS' };

/** "1 dormitorio", "2 dormitorios". */
export function plural(n: number, singular: string, pluralTexto = `${singular}s`): string {
  return `${n} ${n === 1 ? singular : pluralTexto}`;
}

export function formatearSuperficie(m2: number): string {
  return `${numero.format(m2)} m²`;
}

/** "Palmira, San Martín", "San Martín" o la zona tal cual si ya trae su departamento ("La Colonia, Junín"). */
export function lugarDe(zona: string): string {
  if (zona === 'San Martín' || zona.includes(',')) return zona;
  return `${zona}, San Martín`;
}

export function slugificar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
