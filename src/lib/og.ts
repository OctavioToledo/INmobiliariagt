/**
 * Imágenes para compartir (1200×630), generadas en el build.
 * satori convierte el texto en trazos (no depende de fuentes instaladas) y sharp lo pasa a JPG.
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { sitio } from '../config/sitio';
import { formatearPrecio, lugarDe, verboCartel } from './formato';
import type { Propiedad } from './propiedades';

const ANCHO = 1200;
const ALTO = 630;
const C = {
  cielo: '#edf0ee',
  piedra: '#22272a',
  alamo: '#2e4a3b',
  ocre: '#d4a23a',
  acequia: '#2f6482',
  adobe: '#d8d1c4',
  blanco: '#ffffff',
};

type Nodo = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, ...children: (Nodo | string | null)[]): Nodo => ({
  type,
  props: { style: { display: 'flex', ...style }, children: children.filter((c) => c !== null) },
});

const fuente = (paquete: string, archivo: string) => readFile(join(process.cwd(), 'node_modules', paquete, 'files', archivo));

let fuentes: Promise<Parameters<typeof satori>[1]['fonts']> | undefined;
function cargarFuentes() {
  fuentes ??= Promise.all([
    fuente('@fontsource/archivo', 'archivo-latin-700-normal.woff'),
    fuente('@fontsource/archivo', 'archivo-latin-800-normal.woff'),
    fuente('@fontsource/archivo-narrow', 'archivo-narrow-latin-700-normal.woff'),
  ]).then(([a700, a800, n700]) => [
    { name: 'Archivo', data: a700, weight: 700 as const, style: 'normal' as const },
    { name: 'Archivo', data: a800, weight: 800 as const, style: 'normal' as const },
    { name: 'Archivo Narrow', data: n700, weight: 700 as const, style: 'normal' as const },
  ]);
  return fuentes;
}

async function fotoComoDataUrl(ruta: string, ancho: number, alto: number): Promise<string> {
  const buffer = await sharp(join(process.cwd(), ruta)).resize(ancho, alto, { fit: 'cover' }).jpeg({ quality: 82 }).toBuffer();
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}

function cartel(p: Pick<Propiedad, 'operacion' | 'precio' | 'moneda' | 'periodo'>, escala = 1): Nodo {
  const venta = p.operacion === 'venta';
  return h(
    'div',
    {
      flexDirection: 'column',
      padding: `${14 * escala}px ${24 * escala}px ${16 * escala}px`,
      background: venta ? C.ocre : C.acequia,
      color: venta ? C.piedra : C.blanco,
      borderRadius: 3,
      lineHeight: 1,
    },
    h('div', { fontFamily: 'Archivo', fontWeight: 700, fontSize: 26 * escala }, verboCartel[p.operacion]),
    h('div', { fontFamily: 'Archivo Narrow', fontWeight: 700, fontSize: 76 * escala, marginTop: 6 * escala }, formatearPrecio(p)),
  );
}

/** Reja de hierro con un cartel colgado: para cuando todavía no hay fotos. */
function reja(contenido: Nodo, ancho: number): Nodo {
  const barrotes = Array.from({ length: Math.floor(ancho / 44) }, () =>
    h('div', { width: 6, height: '100%', background: C.piedra, opacity: 0.85 }),
  );
  return h(
    'div',
    { position: 'relative', width: ancho, height: ALTO, background: C.cielo },
    h('div', { position: 'absolute', inset: 0, justifyContent: 'space-around', padding: '0 10px' }, ...barrotes),
    h('div', { position: 'absolute', left: 0, right: 0, top: 70, height: 10, background: C.piedra }),
    h('div', { position: 'absolute', left: 0, right: 0, bottom: 60, height: 10, background: C.piedra }),
    h('div', { position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }, contenido),
  );
}

function marca(): Nodo {
  return h(
    'div',
    { alignItems: 'center', gap: 16 },
    h(
      'div',
      {
        width: 64,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        background: C.ocre,
        color: C.piedra,
        borderRadius: 3,
        fontFamily: 'Archivo Narrow',
        fontWeight: 700,
        fontSize: 32,
      },
      'GT',
    ),
    h(
      'div',
      { flexDirection: 'column', lineHeight: 1.05 },
      h('div', { fontFamily: 'Archivo', fontWeight: 800, fontSize: 30, color: C.blanco }, 'Gerardo Tello'),
      h('div', { fontFamily: 'Archivo', fontWeight: 700, fontSize: 22, color: C.adobe }, 'Inmobiliaria'),
    ),
  );
}

async function render(arbol: Nodo): Promise<Buffer> {
  const svg = await satori(arbol as Parameters<typeof satori>[0], { width: ANCHO, height: ALTO, fonts: await cargarFuentes() });
  return sharp(Buffer.from(svg)).jpeg({ quality: 85, mozjpeg: true }).toBuffer();
}

export async function ogPropiedad(p: Propiedad, ruta: string | null): Promise<Buffer> {
  const anchoFoto = 740;
  const lugar = p.zona === 'San Martín' ? 'San Martín, Mendoza' : lugarDe(p.zona);
  const izquierda = ruta
    ? h(
        'div',
        { position: 'relative', width: anchoFoto, height: ALTO },
        h('img', { width: anchoFoto, height: ALTO, objectFit: 'cover' }),
        h('div', { position: 'absolute', left: 36, bottom: 36 }, cartel(p, 0.85)),
      )
    : reja(cartel(p), anchoFoto);

  if (ruta && izquierda.props.children) {
    const [img] = izquierda.props.children as Nodo[];
    if (img) img.props.src = await fotoComoDataUrl(ruta, anchoFoto, ALTO);
  }

  return render(
    h(
      'div',
      { width: ANCHO, height: ALTO, background: C.alamo },
      izquierda,
      h(
        'div',
        { flex: 1, flexDirection: 'column', justifyContent: 'space-between', padding: '48px 44px' },
        marca(),
        h(
          'div',
          { flexDirection: 'column', gap: 16 },
          h('div', { fontFamily: 'Archivo', fontWeight: 800, fontSize: p.titulo.length > 40 ? 38 : 44, lineHeight: 1.1, color: C.blanco }, p.titulo),
          h('div', { fontFamily: 'Archivo', fontWeight: 700, fontSize: 26, color: C.adobe }, lugar),
        ),
        h('div', { fontFamily: 'Archivo', fontWeight: 700, fontSize: 22, color: C.adobe }, `Cód. ${p.codigo}`),
      ),
    ),
  );
}

export async function ogInicio(destacada: Propiedad | undefined, ruta: string | null): Promise<Buffer> {
  const anchoFoto = 620;
  let izquierda: Nodo;
  if (ruta) {
    izquierda = h('img', { width: anchoFoto, height: ALTO, objectFit: 'cover' });
    izquierda.props.src = await fotoComoDataUrl(ruta, anchoFoto, ALTO);
  } else if (destacada) {
    izquierda = reja(cartel(destacada), anchoFoto);
  } else {
    izquierda = reja(h('div', {}), anchoFoto);
  }

  return render(
    h(
      'div',
      { width: ANCHO, height: ALTO, background: C.alamo },
      izquierda,
      h(
        'div',
        { flex: 1, flexDirection: 'column', justifyContent: 'space-between', padding: '56px 48px' },
        marca(),
        h(
          'div',
          { fontFamily: 'Archivo', fontWeight: 800, fontSize: 54, lineHeight: 1.05, color: C.blanco },
          'Alquileres y ventas en San Martín y Palmira',
        ),
        h('div', { fontFamily: 'Archivo', fontWeight: 700, fontSize: 24, color: C.adobe }, `${sitio.direccion.calle}, ${sitio.direccion.localidad}`),
      ),
    ),
  );
}
