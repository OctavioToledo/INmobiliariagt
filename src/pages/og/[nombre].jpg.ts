import type { APIRoute, GetStaticPaths } from 'astro';
import { obtenerDestacadas, obtenerPropiedades, type Propiedad } from '../../lib/propiedades';
import { fotosDe } from '../../lib/fotos';
import { ogInicio, ogPropiedad } from '../../lib/og';

export const getStaticPaths = (async () => {
  const todas = await obtenerPropiedades();
  return [
    { params: { nombre: 'inicio' }, props: { propiedad: undefined } },
    ...todas.map((propiedad) => ({ params: { nombre: propiedad.slug }, props: { propiedad } })),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ propiedad: Propiedad | undefined }> = async ({ props }) => {
  let imagen: Buffer;
  if (props.propiedad) {
    imagen = await ogPropiedad(props.propiedad, fotosDe(props.propiedad)[0]?.ruta ?? null);
  } else {
    const destacadas = await obtenerDestacadas();
    const conFoto = destacadas.find((p) => fotosDe(p).length > 0);
    imagen = await ogInicio(conFoto ?? destacadas[0], conFoto ? (fotosDe(conFoto)[0]?.ruta ?? null) : null);
  }
  return new Response(new Uint8Array(imagen), { headers: { 'Content-Type': 'image/jpeg' } });
};
