/**
 * Fotos de cada propiedad, desde src/assets/propiedades/{codigo}/.
 * Primero van las que figuran en `fotos` del JSON (con su texto alternativo) y después
 * cualquier otra imagen de la carpeta, por nombre de archivo. Así alcanza con soltar
 * las fotos en la carpeta para que aparezcan.
 */
import type { ImageMetadata } from 'astro';
import { nombreTipo } from './formato';
import type { Propiedad } from './propiedades';

export interface Foto {
  src: ImageMetadata;
  alt: string;
  /** Ruta del archivo desde la raíz del proyecto (para generar la imagen para compartir). */
  ruta: string;
}

const archivos = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/propiedades/*/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}',
  { eager: true },
);

export function fotosDe(p: Propiedad): Foto[] {
  const carpeta = `/src/assets/propiedades/${p.codigo}/`;
  const usados = new Set<string>();
  const fotos: Foto[] = [];

  for (const f of p.fotos) {
    const ruta = carpeta + f.src;
    const modulo = archivos[ruta];
    if (!modulo) {
      throw new Error(`La foto "${f.src}" de la propiedad ${p.codigo} no existe en ${carpeta}`);
    }
    usados.add(ruta);
    fotos.push({ src: modulo.default, alt: f.alt, ruta });
  }

  const resto = Object.keys(archivos)
    .filter((ruta) => ruta.startsWith(carpeta) && !usados.has(ruta))
    .sort();
  for (const ruta of resto) {
    const modulo = archivos[ruta];
    if (!modulo) continue;
    fotos.push({
      src: modulo.default,
      alt: `${nombreTipo[p.tipo]} en ${p.calle ?? p.zona}, foto ${fotos.length + 1}`,
      ruta,
    });
  }
  return fotos;
}
