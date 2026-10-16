/**
 * Filtrado, orden y paginación de propiedades. Funciones puras que comparten
 * el build (Astro) y el navegador (listado y selector del inicio).
 */
import { monedaDeOperacion, type Moneda, type Operacion, type Tipo } from './formato';

/** Lo mínimo que hace falta para filtrar y ordenar. */
export interface Filtrable {
  codigo: number;
  operacion: Operacion;
  tipo: Tipo;
  zona: string;
  dormitorios: number | null;
  precio: number | null;
  moneda: Moneda;
  fechaAlta: string;
}

export type Orden = 'recientes' | 'menor-precio' | 'mayor-precio';

export interface Filtros {
  operacion: Operacion | null;
  tipo: Tipo | null;
  zona: string | null;
  dormitoriosMin: number | null;
  /** Siempre en la moneda de la operación: ARS para alquiler, USD para venta. */
  precioMax: number | null;
  orden: Orden;
}

export const FILTROS_VACIOS: Filtros = {
  operacion: null,
  tipo: null,
  zona: null,
  dormitoriosMin: null,
  precioMax: null,
  orden: 'recientes',
};

export const ORDENES: Record<Orden, string> = {
  recientes: 'Más recientes',
  'menor-precio': 'Menor precio',
  'mayor-precio': 'Mayor precio',
};

const OPERACIONES: readonly Operacion[] = ['venta', 'alquiler'];
const TIPOS: readonly Tipo[] = ['casa', 'departamento', 'lote'];

export function cumple<T extends Filtrable>(p: T, f: Filtros): boolean {
  if (f.operacion && p.operacion !== f.operacion) return false;
  if (f.tipo && p.tipo !== f.tipo) return false;
  if (f.zona && p.zona !== f.zona) return false;
  if (f.dormitoriosMin !== null && (p.dormitorios ?? 0) < f.dormitoriosMin) return false;
  if (f.precioMax !== null && f.operacion) {
    // No se mezclan monedas: una propiedad en otra moneda o sin precio no entra en el rango.
    if (p.precio === null || p.moneda !== monedaDeOperacion[f.operacion]) return false;
    if (p.precio > f.precioMax) return false;
  }
  return true;
}

export function filtrar<T extends Filtrable>(lista: readonly T[], f: Filtros): T[] {
  return lista.filter((p) => cumple(p, f));
}

export function ordenar<T extends Filtrable>(lista: readonly T[], orden: Orden): T[] {
  const copia = [...lista];
  const recientes = (a: T, b: T) => b.fechaAlta.localeCompare(a.fechaAlta) || b.codigo - a.codigo;
  if (orden === 'recientes') return copia.sort(recientes);
  const signo = orden === 'menor-precio' ? 1 : -1;
  return copia.sort((a, b) => {
    // Las de "Consultar" van siempre al final.
    if (a.precio === null || b.precio === null) {
      return (a.precio === null ? 1 : 0) - (b.precio === null ? 1 : 0) || recientes(a, b);
    }
    return (a.precio - b.precio) * signo || recientes(a, b);
  });
}

export function paginar<T>(lista: readonly T[], pagina: number, porPagina: number) {
  const totalPaginas = Math.max(1, Math.ceil(lista.length / porPagina));
  const actual = Math.min(Math.max(1, pagina), totalPaginas);
  return {
    items: lista.slice((actual - 1) * porPagina, actual * porPagina),
    pagina: actual,
    totalPaginas,
  };
}

/** Cantidad de filtros activos (el orden no cuenta). */
export function contarActivos(f: Filtros): number {
  return [f.operacion, f.tipo, f.zona, f.dormitoriosMin, f.precioMax].filter((v) => v !== null).length;
}

export function leerFiltros(params: URLSearchParams): Filtros {
  const operacion = params.get('operacion');
  const tipo = params.get('tipo');
  const orden = params.get('orden');
  const entero = (clave: string) => {
    const n = Number.parseInt(params.get(clave) ?? '', 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  };
  const op = OPERACIONES.includes(operacion as Operacion) ? (operacion as Operacion) : null;
  return {
    operacion: op,
    tipo: TIPOS.includes(tipo as Tipo) ? (tipo as Tipo) : null,
    zona: params.get('zona') || null,
    dormitoriosMin: entero('dormitorios'),
    precioMax: op ? entero('precio') : null,
    orden: orden && orden in ORDENES ? (orden as Orden) : 'recientes',
  };
}

export function escribirFiltros(f: Filtros): URLSearchParams {
  const params = new URLSearchParams();
  if (f.operacion) params.set('operacion', f.operacion);
  if (f.tipo) params.set('tipo', f.tipo);
  if (f.zona) params.set('zona', f.zona);
  if (f.dormitoriosMin !== null) params.set('dormitorios', String(f.dormitoriosMin));
  if (f.precioMax !== null && f.operacion) params.set('precio', String(f.precioMax));
  if (f.orden !== 'recientes') params.set('orden', f.orden);
  return params;
}
