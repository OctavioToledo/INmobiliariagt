/**
 * Integración con Wasi (pendiente para producción).
 *
 * La inmobiliaria ya carga sus propiedades en Wasi, que expone una API (requiere el plan Pro).
 * Acá va a ir un loader custom de Astro que, en cada build:
 *   1. Llama a la API de Wasi con las credenciales del cliente (variables de build en Cloudflare).
 *   2. Mapea cada propiedad de Wasi al esquema del sitio (`DatosPropiedad`, ver src/content.config.ts).
 *   3. Guarda las entradas en el store de la colección `propiedades`.
 *
 * Para activarlo, en src/content.config.ts se reemplaza `file('src/data/propiedades.json')`
 * por `wasiLoader()`. El resto del sitio no cambia porque todo pasa por src/lib/propiedades.ts.
 *
 * Las fotos de Wasi son remotas: habrá que permitir su dominio en `image.domains`
 * (astro.config.mjs) y adaptar src/lib/fotos.ts para aceptar URLs además de archivos locales.
 *
 * La actualización en producción es por rebuild: un deploy hook de Workers Builds disparado por
 * un cron diario (Cron Trigger de un Worker) y/o manualmente cuando cargan una propiedad nueva.
 *
 * Importante: los endpoints y nombres de campos de Wasi NO están definidos acá a propósito.
 * Hay que tomarlos de la documentación oficial de la API cuando el cliente active el plan.
 */
import type { Loader } from 'astro/loaders';
import type { DatosPropiedad } from '../content.config';

export interface ConfigWasi {
  /** Identificador de la empresa en Wasi. */
  idEmpresa: string;
  /** Token de la API. Nunca en el repositorio: va en variables de entorno. */
  token: string;
}

/** Forma que tiene que devolver el mapeo de cada propiedad de Wasi. */
export type PropiedadDestino = DatosPropiedad;

/**
 * TODO: implementar cuando esté disponible la documentación de la API de Wasi.
 * Debe traer todas las propiedades publicadas (paginando si hace falta).
 */
async function traerPropiedadesWasi(_config: ConfigWasi): Promise<unknown[]> {
  throw new Error('TODO: integración con la API de Wasi no implementada.');
}

/** TODO: mapear una propiedad de Wasi al esquema del sitio. */
function mapearPropiedad(_crudo: unknown): PropiedadDestino {
  throw new Error('TODO: mapeo de Wasi al esquema del sitio no implementado.');
}

export function wasiLoader(config: ConfigWasi): Loader {
  return {
    name: 'wasi-loader',
    load: async ({ store, parseData, logger }) => {
      const crudas = await traerPropiedadesWasi(config);
      store.clear();
      for (const cruda of crudas) {
        const propiedad = mapearPropiedad(cruda);
        const data = await parseData({ id: propiedad.id, data: propiedad });
        store.set({ id: propiedad.id, data });
      }
      logger.info(`Wasi: ${crudas.length} propiedades cargadas`);
    },
  };
}
