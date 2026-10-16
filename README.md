# Gerardo Tello Inmobiliaria — sitio demo

Sitio de alquileres y ventas de Gerardo Tello Inmobiliaria (San Martín, Mendoza). Hecho por Devott.

Astro + TypeScript, salida estática, sin frameworks de UI. Pensado para el celular.

## Cómo correrlo

Necesitás Node 22 o superior.

```bash
npm install
npm run dev         # http://localhost:4321
npm run build       # chequeo de tipos + build en dist/
npm run preview     # sirve el build
npm run pendientes  # lista lo que falta confirmar con el cliente
```

En `npm run dev`, cualquier dato marcado como pendiente se ve con un **borde punteado naranja**. `npm run pendientes` lista los valores con el prefijo `[A CONFIRMAR]`, los campos `revisar` de cada propiedad y las propiedades sin fotos.

## Origen de los datos

Las 11 propiedades, sus fotos y los datos de contacto se tomaron del sitio actual en Wasi (2inmobiliaria.com.ar), en octubre de 2026:

- Precio, ambientes, superficies y estado: de "Detalles del inmueble" de cada ficha. Si la descripción traía un precio distinto, vale el de la ficha (el de la descripción se sacó para no contradecirse).
- Descripciones: el texto del cliente, sin emojis, firmas ni precios repetidos.
- Fecha de alta: la marca de tiempo de la primera foto subida a Wasi.
- Ubicación: las coordenadas de Wasi redondeadas a 3 decimales (unos 100 m), para que sea aproximada.
- Fotos: sin los flyers promocionales, sin la marca de agua y sin los bordes blancos que agrega Wasi. El complejo de Perrupato (8982824) y el lote de Arquitectos del Este (7163860) solo tenían flyers, por eso muestran "Fotos en camino".
- Matrícula (N.º 161) y celular: del logo del sitio actual.

## Cómo agregar una propiedad

1. Abrí `src/data/propiedades.json` y agregá un objeto al final de la lista:

```json
{
  "id": "10500000",
  "codigo": 10500000,
  "slug": "casa-venta-palmira-calle-ejemplo-10500000",
  "titulo": "Casa en calle Ejemplo, Palmira",
  "operacion": "venta",
  "tipo": "casa",
  "precio": 85000,
  "moneda": "USD",
  "periodo": null,
  "zona": "Palmira",
  "calle": "Calle Ejemplo",
  "dormitorios": 3,
  "banos": 2,
  "cocheras": 1,
  "superficieTotal": 300,
  "superficieCubierta": 140,
  "estado": "usado",
  "aptoCredito": true,
  "mascotas": null,
  "disponibilidad": "disponible",
  "destacada": false,
  "fechaAlta": "2026-10-20",
  "descripcion": "Texto que escribió el cliente. Para separar párrafos, dejá una línea en blanco (\\n\\n).",
  "fotos": [
    { "src": "01.jpg", "alt": "Frente de la casa en calle Ejemplo" },
    { "src": "02.jpg", "alt": "Living comedor con ventanal" }
  ],
  "ubicacion": null
}
```

Reglas:

- `id` es el `codigo` como texto. El `codigo` es el de Wasi.
- `slug`: `{tipo}-{operacion}-{zona}-{calle}-{codigo}`, en minúsculas, sin acentos y con guiones.
- `titulo` va en minúsculas normales, no TODO EN MAYÚSCULAS.
- Si un dato no se sabe, va `null`. **No inventes nada.** El sitio solo muestra lo que existe.
- Alquileres: `"moneda": "ARS"` y `"periodo": "mensual"`. Ventas: normalmente `"USD"` y `"periodo": null`.
- `precio: null` muestra "Consultar".
- `"disponibilidad": "reservada"` le pone la franja "Reservada" al cartel.
- `destacada: true` la muestra en "Disponibles ahora" del inicio (máximo 6).
- `ubicacion`: `{ "lat": -33.07, "lng": -68.47 }` **aproximada**, nunca la dirección exacta. Si va `null`, el mapa usa la calle y la zona.
- `revisar` (opcional): lista de cosas a confirmar. No se muestra en el sitio, la lista `npm run pendientes`.

2. Poné las fotos en `src/assets/propiedades/{codigo}/` (por ejemplo `src/assets/propiedades/10500000/01.jpg`).
   - Las que figuran en `fotos` van primero, en ese orden y con su texto alternativo. La primera es la de la tarjeta. Cualquier otra imagen de la carpeta se suma después, por orden de nombre y con un texto alternativo genérico.
   - JPG, PNG o WebP. Con unos 2000 px de ancho alcanza: el build genera AVIF/WebP en los tamaños justos.
   - La primera foto también se usa para la imagen que aparece al compartir el link por WhatsApp.
   - Si la carpeta no existe, la propiedad muestra "Fotos en camino".

3. `npm run build` valida el JSON contra el esquema (`src/content.config.ts`) y avisa si falta un campo o si una foto no existe.

## Cómo cambiar datos de contacto y textos

Todo está en **`src/config/sitio.ts`**: nombre, dirección, teléfono, WhatsApp, email, horarios, matrícula, redes, textos del proceso para propietarios y link de privacidad.

- WhatsApp: `numero` es el formato del link (`549` + característica sin 0 + número sin 15, ej. `5492634319356`) y `visible` es lo que se lee en pantalla. Cuando esté confirmado, poné `pendiente: false`.
- Los valores con el prefijo `[A CONFIRMAR]` se muestran tal cual y en desarrollo se marcan con borde punteado.
- El logo provisorio es tipográfico (`src/components/Logo.astro`). Cuando esté el archivo, se deja en `public/brand/` y se reemplaza ahí.

## Estructura

```
src/
  config/sitio.ts          datos del cliente y textos editables
  content.config.ts        esquema Zod de propiedad + colección
  data/propiedades.json    propiedades (demo)
  assets/propiedades/      fotos, una carpeta por código
  lib/propiedades.ts       único acceso a las propiedades (getCollection + helpers)
  lib/filtros.ts           filtrar, ordenar y paginar (lo comparten build y navegador)
  lib/formato.ts           precios y textos
  lib/whatsapp.ts          links y mensajes armados
  lib/fotos.ts             fotos por propiedad
  lib/mapas.ts             URLs de mapas (sin API keys)
  lib/og.ts                imágenes para compartir (1200×630)
  lib/wasi.ts              stub del loader de Wasi
  components/              Header, Footer, Cartel, TarjetaPropiedad, SelectorOperacion,
                           Filtros, Galeria, Lightbox, MapaFachada, BotonWhatsApp,
                           BarraConsulta, FormPropietarios, Icono…
  layouts/Base.astro
  pages/                   inicio, listado, ficha, 404, og/[nombre].jpg, robots.txt
scripts/pendientes.mjs
```

## Deploy en Cloudflare

El proyecto está conectado a Cloudflare como **Worker con assets estáticos** (Workers Builds). La configuración vive en `wrangler.jsonc`:

- `build.command` corre `npm run build` antes de cada deploy.
- `assets.directory` publica `dist/` tal cual: no hay Worker ni adapter de servidor (no agregar `@astrojs/cloudflare`; el sitio es estático y las imágenes se generan en el build con sharp).
- `html_handling: auto-trailing-slash` sirve `/ruta.html` como `/ruta`, sin barra final, igual que el canonical.
- `not_found_handling: 404-page` usa `404.html`.
- `public/_headers` fija caché inmutable para `/_astro/*` y headers de seguridad.

En el panel de Cloudflare (Workers & Pages → inmobiliariagt → Settings → Build):

- Deploy command: `npx wrangler deploy` (el build lo dispara `wrangler.jsonc`).
- URL pública: está en `astro.config.mjs` (hoy `https://inmobiliariagt.octatoledo7.workers.dev`; al apuntar el dominio, cambiarla a `https://2inmobiliaria.com.ar`). La variable de build `SITE_URL`, si se define, tiene prioridad. Se usa para canonical, sitemap, Open Graph y el link del mensaje de WhatsApp.
- La versión de Node sale de `.node-version` (22).

Para probar localmente igual que en producción: `npx wrangler dev` (sirve `dist/` con el mismo motor de assets).

Dominio propio: Settings → Domains & Routes → agregar `2inmobiliaria.com.ar` cuando se migre del sitio de Wasi.

## Pasar a producción con Wasi

La inmobiliaria ya carga sus propiedades en Wasi. En producción el sitio las va a leer de ahí y ellos siguen trabajando como hoy.

1. **API de Wasi.** Requiere el plan Pro. Con la cuenta activa se obtienen el identificador de empresa y el token.
2. **Loader.** En `src/lib/wasi.ts` está el esqueleto de un loader de Astro (`wasiLoader`) que en cada build trae las propiedades de la API y las mapea al esquema del sitio. Falta implementar `traerPropiedadesWasi` y `mapearPropiedad` siguiendo la documentación oficial de la API. A propósito, no hay endpoints ni nombres de campos inventados.
3. **Activarlo.** En `src/content.config.ts`, reemplazar `file('src/data/propiedades.json')` por `wasiLoader({ idEmpresa: process.env.WASI_ID_EMPRESA, token: process.env.WASI_TOKEN })` y cargar esas variables como variables de build en Cloudflare. El resto del sitio no cambia, porque todo pasa por `src/lib/propiedades.ts`.
4. **Fotos remotas.** Wasi sirve las fotos desde su dominio: hay que agregarlo en `image.domains` de `astro.config.mjs` y adaptar `src/lib/fotos.ts` (y `src/lib/og.ts`) para aceptar URLs.
5. **Actualización por rebuild.** El sitio es estático: se regenera con un **deploy hook de Workers Builds** (Settings → Build → Deploy hooks). Se dispara:
   - con un **cron diario**: un Worker con Cron Trigger que haga `fetch(URL_DEL_HOOK, { method: 'POST' })` (o GitHub Actions con `schedule`), y/o
   - **a mano**, cuando cargan una propiedad y la quieren ver publicada enseguida.

   Un build tarda menos de un minuto.

## Calidad

- Lighthouse mobile (Performance / Accessibility / Best Practices / SEO): inicio 97/100/100/100, listado 99/100/100/100, fichas 99–100/100/100/100.
- Probado a 360, 390, 768 y 1280 px.
- JS del cliente: solo scripts chicos en TypeScript vanilla (menú, selector, filtros, galería, lightbox, mapa, compartir).
