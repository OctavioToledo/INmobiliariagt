/** Links de WhatsApp con mensaje armado. Se usa en el build y en el navegador. */
import { sitio } from '../config/sitio';
import { nombreOperacion, nombreTipo, formatearMonto, monedaDeOperacion } from './formato';
import type { Filtros } from './filtros';

export function linkWhatsApp(mensaje?: string): string {
  const base = `https://wa.me/${sitio.whatsapp.numero}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

export const mensajeGeneral = 'Hola, les escribo desde el sitio web.';

export function mensajeConsulta(p: { titulo: string; codigo: number }, url: string): string {
  return `Hola, quiero consultar por "${p.titulo}" (cód. ${p.codigo}). La vi en ${url}`;
}

export function mensajeTasacion(d: {
  nombre: string;
  quiere: 'vender' | 'alquilar';
  tipo: string;
  zona: string;
}): string {
  return `Hola, soy ${d.nombre}. Quiero ${d.quiere} mi ${d.tipo} en ${d.zona}. ¿Me pueden hacer una tasación?`;
}

/** Para el estado vacío del listado: describe lo que la persona estaba buscando. */
export function mensajeBusqueda(f: Filtros): string {
  const partes: string[] = [];
  partes.push(f.tipo ? nombreTipo[f.tipo].toLowerCase() : 'una propiedad');
  if (f.operacion) partes.push(`en ${nombreOperacion[f.operacion].toLowerCase()}`);
  if (f.zona) partes.push(`en ${f.zona}`);
  if (f.dormitoriosMin) partes.push(`con ${f.dormitoriosMin} dormitorios o más`);
  if (f.precioMax && f.operacion) {
    partes.push(`hasta ${formatearMonto(f.precioMax, monedaDeOperacion[f.operacion])}`);
  }
  return `Hola, estoy buscando ${partes.join(' ')}. ¿Me avisan si entra algo así?`;
}
