import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Esquema de propiedad. Es el contrato del sitio: hoy lo llena el JSON local,
 * en producción lo va a llenar el loader de Wasi (ver src/lib/wasi.ts).
 */
export const esquemaPropiedad = z.object({
  id: z.string(),
  codigo: z.number().int().positive(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  titulo: z.string().min(1),
  operacion: z.enum(['venta', 'alquiler']),
  tipo: z.enum(['casa', 'departamento', 'lote']),
  precio: z.number().positive().nullable(),
  moneda: z.enum(['ARS', 'USD']),
  periodo: z.literal('mensual').nullable(),
  zona: z.string().min(1),
  calle: z.string().nullable(),
  dormitorios: z.number().int().nonnegative().nullable(),
  banos: z.number().int().nonnegative().nullable(),
  cocheras: z.number().int().nonnegative().nullable(),
  superficieTotal: z.number().positive().nullable(),
  superficieCubierta: z.number().positive().nullable(),
  estado: z.enum(['nuevo', 'usado', 'en construccion']).nullable(),
  aptoCredito: z.boolean().nullable(),
  mascotas: z.boolean().nullable(),
  disponibilidad: z.enum(['disponible', 'reservada']),
  destacada: z.boolean(),
  fechaAlta: z.iso.date(),
  descripcion: z.string(),
  /** Nombre de archivo dentro de src/assets/propiedades/{codigo}/ y texto alternativo. */
  fotos: z.array(z.object({ src: z.string(), alt: z.string() })),
  ubicacion: z.object({ lat: z.number(), lng: z.number() }).nullable(),
  /** Datos a revisar con el cliente. Los lista `npm run pendientes`; no se muestran en el sitio. */
  revisar: z.array(z.string()).optional(),
});

export type DatosPropiedad = z.infer<typeof esquemaPropiedad>;

const propiedades = defineCollection({
  loader: file('src/data/propiedades.json'),
  schema: esquemaPropiedad,
});

export const collections = { propiedades };
