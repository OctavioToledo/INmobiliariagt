# Prompt para el agente: demo del nuevo sitio de Gerardo Tello Inmobiliaria

## Tu rol y el objetivo

Sos un desarrollador frontend senior trabajando para Devott (Octavio Toledo, Mendoza). Vas a construir una DEMO funcional del nuevo sitio de una inmobiliaria real de San Martín, Mendoza, que hoy tiene un sitio armado con una plantilla de Wasi (2inmobiliaria.com.ar). La demo se va a mostrar en el celular del dueño para cerrar la venta, así que tiene que verse impecable en mobile, cargar rápido y permitir el recorrido completo: elegir alquilar o comprar, ver propiedades, abrir una ficha y consultar por WhatsApp.

Regla de oro: nada de contenido inventado presentado como real. Ni testimonios, ni cifras ("+500 operaciones"), ni años de trayectoria, ni fotos de stock haciéndose pasar por propiedades o por el equipo. Lo que falte va como placeholder visible y centralizado (ver "Placeholders").

## Datos del cliente

- Nombre comercial: Gerardo Tello Inmobiliaria (el sitio actual lo escribe "INmobiliaria Gerardo Tello"; usá "Gerardo Tello Inmobiliaria" en textos y dejá el nombre configurable).
- Dominio actual: 2inmobiliaria.com.ar
- Dirección: Sargento Cabral 278, San Martín, Mendoza, Argentina.
- Teléfono: +54 263 431-9356 (tel:+542634319356).
- WhatsApp: [A CONFIRMAR]. El sitio actual muestra "+5402634319356", que está mal formado. Dejá el número en config; para el link usá el formato wa.me/549XXXXXXXXXX.
- Email: etinmobiliaria@gmail.com
- Redes: Facebook facebook.com/inmobiliarios.deleste · Instagram instagram.com/gerardotelloinmobiliaria · YouTube youtube.com/@gerardotello1201 (no incluyas X/Twitter).
- Servicios: tasaciones, venta y alquiler de propiedades.
- Zona: San Martín y alrededores (zona Este de Mendoza), incluye Palmira.
- Matrícula del corredor: [A CONFIRMAR].
- Horarios de atención: [A CONFIRMAR].
- Logo: [PENDIENTE: Octavio va a dejar el archivo en /public/brand/]. Mientras tanto usá un wordmark tipográfico con el nombre, con la tipografía del sitio.

## Alcance de la demo

Incluye:
1. `/` Inicio (landing completa, ver secciones abajo).
2. `/propiedades` Listado con filtros simples.
3. `/propiedades/[slug]` Ficha de propiedad.
4. `/404` personalizada.

No incluye (no lo construyas): blog, panel de administración, login, integración real con Wasi, comparador, favoritos, multi-idioma, chat.

## Stack

- Astro (última versión estable) + TypeScript estricto. Salida estática, deploy en Vercel.
- Contenido con Content Collections (`src/content.config.ts`) usando el `file()` loader sobre `src/data/propiedades.json`, con esquema Zod.
- CSS propio con custom properties (tokens abajo). Sin frameworks de UI ni librerías de componentes.
- Interactividad mínima en TypeScript vanilla dentro de `<script>` de Astro: filtros del listado, selector alquilar/comprar, galería, lightbox. Sin React, sin jQuery, sin sliders de terceros.
- Imágenes con `astro:assets` (`<Image>` / `<Picture>`, AVIF y WebP, `sizes` correctos, lazy salvo la primera visible).
- Tipografía self-hosted con `@fontsource-variable/archivo` (subset latin), con `font-display: swap` y preload del archivo principal.
- `@astrojs/sitemap`.
- Mapas: nunca cargues un mapa JS en la carga inicial. Usá una "fachada": imagen estática o bloque con botón "Ver en el mapa" que recién al tocarlo carga el iframe (OpenStreetMap o Google Maps embed).

## Arquitectura preparada para Wasi (importante para la venta)

La inmobiliaria ya carga sus propiedades en Wasi, que tiene API (requiere su plan Pro). En producción el sitio va a leer las propiedades de Wasi automáticamente y ellos van a seguir trabajando como hoy. Para la demo usamos el JSON local, pero dejá la arquitectura lista para el cambio:

- Todo el sitio consume propiedades SOLO a través de `getCollection('propiedades')` y helpers en `src/lib/propiedades.ts` (filtrar, ordenar, similares, formatear precio). Ningún componente lee el JSON directo.
- Creá `src/lib/wasi.ts` con un comentario que explique que ahí irá un loader custom de Astro que llame a la API de Wasi en el build y mapee su respuesta al esquema de abajo. NO inventes endpoints ni nombres de campos de Wasi: dejá la función como stub con `TODO` y la interfaz de destino tipada.
- Documentá en el README que la actualización en producción será por rebuild (deploy hook de Vercel disparado por un cron diario y/o manualmente).

## Esquema de propiedad (Zod)

```ts
{
  id: string,                 // = codigo, como string
  codigo: number,             // código Wasi, ej. 10391330
  slug: string,               // ej. "departamento-alquiler-palmira-soberania-nacional-10391330"
  titulo: string,             // en minúsculas normales, no TODO MAYÚSCULAS
  operacion: 'venta' | 'alquiler',
  tipo: 'casa' | 'departamento' | 'lote',
  precio: number | null,      // null = "Consultar precio"
  moneda: 'ARS' | 'USD',
  periodo: 'mensual' | null,  // alquileres: 'mensual'
  zona: string,               // distrito: "Palmira", "Ciudad", etc. [A CONFIRMAR por propiedad]
  calle: string | null,       // referencia aproximada, nunca dirección exacta
  dormitorios: number | null,
  banos: number | null,
  cocheras: number | null,
  superficieTotal: number | null,     // m²
  superficieCubierta: number | null,  // m²
  estado: 'nuevo' | 'usado' | 'en construccion' | null,
  aptoCredito: boolean | null,
  mascotas: boolean | null,
  disponibilidad: 'disponible' | 'reservada',
  destacada: boolean,
  fechaAlta: string,          // ISO
  descripcion: string,        // texto del cliente, se respeta
  fotos: { src: string, alt: string }[],  // rutas en src/assets/propiedades/{codigo}/
  ubicacion: { lat: number, lng: number } | null  // aproximada
}
```

Mostrá cada dato solo si existe. Nunca muestres "null", "0 dormitorios" en un lote ni "Argentina" como ubicación (el sitio actual hace eso).

## Datos semilla (reales, del sitio actual)

Cargá estas propiedades. Normalizá títulos a minúscula normal. Lo que no está acá va como `null`, no lo inventes.

| Código | Título | Operación | Tipo | Precio |
|---|---|---|---|---|
| 10480182 | Lote en callejón Menacho | venta | lote | USD 11.500 |
| 10293359 | Departamento en calle Perrupato | alquiler | departamento | ARS 350.000 / mes |
| 10391330 | Departamento en calle Soberanía Nacional, Palmira | alquiler | departamento | ARS 460.000 / mes |
| 10399218 | Casa en barrio Círculo Médico | alquiler | casa | ARS 800.000 / mes |
| 10263655 | Departamento en calle Sargento Cabral | alquiler | departamento (en Wasi figura como casa; dejá un comentario `// revisar tipo con el cliente`) | ARS 550.000 / mes |
| 10291426 | Departamento en calle Tomás Thomas | alquiler | departamento | ARS 350.000 / mes |

Detalle conocido de 10391330: usado, 2 dormitorios, 1 baño, 1 cochera, zona Palmira. Descripción: "Se ofrece en alquiler departamento ubicado sobre calle Soberanía Nacional, en Palmira. La propiedad se compone de 2 dormitorios, cocina comedor, cochera y todos los servicios. Se trata de una opción funcional y cómoda, ideal para vivienda permanente."

Marcá como `destacada: true` las seis. Octavio va a sumar el resto del stock (en total ronda las 11 propiedades) con el mismo formato.

Fotos: Octavio va a guardar las fotos reales en `src/assets/propiedades/{codigo}/01.jpg, 02.jpg...`. Si una propiedad no tiene fotos todavía, mostrá un placeholder sobrio (fondo `--adobe`, ícono del tipo de propiedad y el texto "Fotos en camino"). Nada de fotos de stock.

## Dirección de diseño: "Alameda"

La idea: un sitio de pueblo grande del Este mendocino, prolijo y confiable, no un portal porteño ni una plantilla. Referencias materiales: las alamedas y acequias de San Martín, el cielo seco, la piedra bola, y sobre todo el **cartel de "Vende / Alquila"** colgado en la reja de una casa. Ese cartel es el elemento memorable del sitio; todo lo demás es tranquilo y disciplinado.

### Color (tokens en `:root`)

- `--cielo: #EDF0EE` fondo general (gris verdoso frío y luminoso).
- `--piedra: #22272A` texto principal.
- `--alamo: #2E4A3B` primario: header, footer, botones principales.
- `--ocre: #D4A23A` cartel de VENTA (texto `--piedra` encima).
- `--acequia: #2F6482` cartel de ALQUILER (texto blanco encima).
- `--adobe: #D8D1C4` líneas, bordes, superficies secundarias.
- `--blanco: #FFFFFF` superficie de tarjetas y fichas.
- `--whatsapp: #1F8F4E` solo para botones de WhatsApp (verificá contraste AA con texto blanco).

Verificá contraste WCAG AA en todas las combinaciones. Venta y alquiler se distinguen por color Y por texto, nunca solo por color. Solo modo claro en la demo.

### Tipografía

Una sola familia: **Archivo variable** (ejes de ancho y peso). El ancho es la herramienta de personalidad:
- Titulares: ancho expandido (wdth ~112), peso 700, interlineado ajustado (1.05–1.1).
- Cartel de precio: ancho condensado (wdth ~75), peso 800, `font-variant-numeric: tabular-nums`. Es el tratamiento tipográfico que más se tiene que notar.
- Texto: ancho normal (100), peso 400, 16–18px, interlineado 1.55, línea máxima ~70 caracteres.
- Escala modular 1.25. Todo en sentence case.

### El cartel (componente `Cartel.astro`)

Bloque rectangular sólido (radio 2px, como chapa pintada), con la operación arriba en tamaño chico ("Alquila" / "Vende") y el precio grande condensado debajo ("$460.000 / mes", "USD 11.500"). Si `precio` es null: "Consultar". Si `disponibilidad` es 'reservada', una franja diagonal "Reservada" sobre el cartel. Se usa en tarjetas (superpuesto en la esquina inferior izquierda de la foto) y en la ficha (grande, junto al título).

### Lo que NO hay que hacer

- Eyebrows en mayúsculas con tracking arriba de cada título.
- Separadores con punto medio ("3 dorm · 2 baños"): usá íconos simples + texto.
- Flechas "→" pegadas al texto de botones y links.
- Numeraciones 01/02/03 decorativas (solo en el proceso para propietarios, que sí es una secuencia).
- Animaciones de fade/slide en cada sección o hover animado en cada tarjeta. Solo movimiento que responda a acciones (selector, galería, lightbox) y respetando `prefers-reduced-motion`.
- Sombras grises idénticas en todo, gradientes decorativos, glassmorphism.
- Fondo crema con acento terracota, o fondo negro con acento neón.

## Página de inicio: secciones

Mobile-first. Wireframe mobile:

```
┌───────────────────────────┐
│ [Logo]          [☰] [WA] │ header sticky, fondo alamo
├───────────────────────────┤
│ Alquileres y ventas en    │ H1 expandido
│ San Martín y Palmira      │
│ Casas, departamentos y    │
│ lotes con el precio a la… │
│ ┌──────────┬────────────┐ │
│ │Alquilar 5│ Comprar 1  │ │ selector segmentado
│ └──────────┴────────────┘ │
│ (Casa)(Depto)(Lote)       │ chips opcionales
│ [ Ver 5 propiedades ]     │
├───────────────────────────┤
│ ┌───────────────────────┐ │
│ │ foto                  │ │ tarjetas con cartel
│ │[Alquila $460.000/mes] │ │
│ └───────────────────────┘ │
│ Depto en Soberanía Nac.   │
│ Palmira  🛏2 🛁1 🚗1        │
├───────────────────────────┤
│ ¿Tenés una propiedad?     │ bloque propietarios
├───────────────────────────┤
│ Nosotros / Contacto       │
└───────────────────────────┘
                     (WA)  ← botón flotante
```

En desktop: hero a dos columnas (texto + selector a la izquierda alineado a la izquierda, collage de 3 fotos reales de propiedades a la derecha), grilla de 3 columnas para propiedades.

1. **Header**: logo, links (Alquileres, Ventas, Tasaciones, Nosotros, Contacto), botón "WhatsApp". En mobile, menú en `<dialog>` accesible.

2. **Hero**
   - H1: "Alquileres y ventas en San Martín y Palmira"
   - Bajada: "Casas, departamentos y lotes con el precio a la vista. Elegí, mirá las fotos y consultanos directo por WhatsApp."
   - Selector segmentado "Alquilar" / "Comprar" con la cantidad real de cada operación calculada del contenido. Chips opcionales por tipo (solo los tipos que existen en esa operación).
   - Botón "Ver N propiedades" que lleva a `/propiedades?operacion=...&tipo=...`. El número se actualiza en vivo.

3. **Propiedades destacadas**: título "Disponibles ahora", grilla de tarjetas (foto 4:3, cartel, título, zona, íconos de dormitorios/baños/cochera o superficie si es lote, código chico). Link "Ver todas las propiedades".

4. **Propietarios** (fondo `--alamo`, texto claro): la otra mitad del negocio.
   - Título: "¿Querés vender o alquilar tu propiedad?"
   - Texto: "Te hacemos la tasación y nos ocupamos de publicarla, mostrarla y acompañarte hasta la firma."
   - Proceso de 4 pasos numerados: Tasación, Publicación, Visitas, Firma. Textos de una línea cada uno, marcados `[A CONFIRMAR con el cliente]` en config.
   - Mini formulario: nombre, tipo de propiedad, zona, "Quiero vender / alquilar". Al enviar abre WhatsApp con el mensaje armado: "Hola, soy {nombre}. Quiero {vender/alquilar} mi {tipo} en {zona}. ¿Me pueden hacer una tasación?". Sin backend.

5. **Nosotros**
   - Texto: "Somos una inmobiliaria de San Martín, Mendoza. Hacemos tasaciones, ventas y alquileres, y acompañamos cada operación de principio a fin, con trato directo y sin vueltas."
   - Foto de Gerardo Tello: placeholder hasta tener la real. Nombre, "Corredor inmobiliario", "Matrícula N.º [A CONFIRMAR]".

6. **Contacto**: dirección, teléfono, WhatsApp, email, horarios, redes y mapa con fachada (Sargento Cabral 278, San Martín). Botones grandes: "Escribinos por WhatsApp", "Llamar", "Cómo llegar" (abre Google Maps).

7. **Footer**: datos de contacto, links, condiciones generales resumidas: "Las medidas son aproximadas y las exactas constan en el título de cada inmueble. Fotos y videos son ilustrativos y los precios son indicativos, no constituyen una oferta vinculante." Política de privacidad (link placeholder). Firma chica: "Sitio hecho por Devott".

8. **Botón flotante de WhatsApp** en todas las páginas (abajo a la derecha, 56px, con `aria-label`). En la ficha en mobile se reemplaza por la barra fija de consulta.

## Listado `/propiedades`

- Filtros: operación, tipo, zona, dormitorios mínimos, precio máximo (respetando moneda: no mezclar ARS con USD; si la operación es venta, el rango es en USD). Orden: más recientes, menor precio, mayor precio.
- Estado sincronizado con la URL (query params), para poder compartir una búsqueda.
- Todo client-side sobre los datos renderizados (son pocas propiedades, sin paginación en la demo pero con la lógica preparada).
- En mobile, filtros en un panel desplegable con contador "Filtros (2)" y botón "Mostrar N propiedades".
- Estado vacío: "No hay propiedades con esos filtros. Probá quitar alguno, o escribinos y te avisamos cuando entre algo así." + botón de WhatsApp con mensaje armado según los filtros.

## Ficha `/propiedades/[slug]`

- Galería: carrusel con `scroll-snap` (swipe nativo en celular), contador "3 / 8", flechas en desktop, lightbox a pantalla completa con `<dialog>`, navegable con teclado y cerrable con Escape.
- Encabezado: título (H1), zona, código ("Cód. 10391330"), cartel grande.
- Datos clave en grilla con íconos: dormitorios, baños, cocheras, superficie total y cubierta, estado, apto crédito, mascotas (solo los que existen).
- Descripción del cliente.
- Ubicación aproximada: mapa con fachada y la aclaración "Ubicación aproximada".
- Propiedades similares: misma operación, priorizando mismo tipo y zona (máx. 3).
- Consulta: botón principal "Consultar por WhatsApp" con mensaje precargado:
  `Hola, quiero consultar por "{titulo}" (cód. {codigo}). La vi en {url}`
  y botón secundario "Llamar". En mobile, barra fija abajo con ambos botones, respetando `env(safe-area-inset-bottom)`.
- Botón "Compartir" con Web Share API y fallback a copiar el link.
- Breadcrumb: Inicio / Alquileres / título.

## SEO y vista previa al compartir

- Title y description únicos por página. Ficha: "{Título} – {Alquiler/Venta} en {zona}, San Martín | Gerardo Tello Inmobiliaria". Description con precio, ambientes y zona.
- Open Graph y Twitter card por ficha con imagen 1200×630 generada con `getImage` a partir de la primera foto (es como se van a compartir por WhatsApp; tiene que verse linda). Para el inicio, una imagen OG con el nombre y una foto de propiedad.
- JSON-LD: `RealEstateAgent` en el inicio (nombre, dirección, teléfono, redes). En fichas, `Offer` + `Place`/`Residence` básico. Sin reseñas ni ratings.
- `lang="es-AR"`, canonical, sitemap, robots.txt.
- H1 único por página, jerarquía de títulos correcta.

## Calidad mínima (no negociable)

- Lighthouse mobile 90+ en Performance, Accessibility, Best Practices y SEO. Comprobalo y reportá los números.
- Viewport sin `user-scalable=no` (el sitio actual bloquea el zoom; acá no).
- Foco visible, navegación completa por teclado, áreas táctiles de 44px mínimo, `alt` descriptivos ("Living del departamento en Soberanía Nacional").
- Sin layout shift en imágenes ni fuentes. JS total del lado del cliente mínimo.
- Probado a 360px, 390px, 768px y 1280px.

## Textos

Español rioplatense con voseo, cercano y profesional. Usá "propiedad" (no "inmueble"), "alquiler" (no "renta"), "Contacto" (no "Contáctenos"). Botones con verbos que dicen lo que pasa: "Consultar por WhatsApp", "Ver propiedades", "Pedir tasación". Precios formateados `Intl.NumberFormat('es-AR')`: "$460.000 / mes", "USD 11.500".

## Placeholders

Todos los datos del cliente y textos editables viven en `src/config/sitio.ts` (nombre, teléfonos, WhatsApp, email, dirección, coordenadas, horarios, matrícula, redes, textos del proceso). Los valores pendientes usan el prefijo `[A CONFIRMAR]` y en desarrollo se muestran con un borde punteado para detectarlos fácil. Agregá un script `npm run pendientes` que liste todos los `[A CONFIRMAR]` del proyecto.

## Estructura sugerida

```
src/
  config/sitio.ts
  content.config.ts
  data/propiedades.json
  assets/propiedades/{codigo}/
  lib/propiedades.ts, lib/whatsapp.ts, lib/formato.ts, lib/wasi.ts (stub)
  components/ Header, Footer, Cartel, TarjetaPropiedad, SelectorOperacion,
              Filtros, Galeria, Lightbox, MapaFachada, BotonWhatsApp,
              BarraConsulta, FormPropietarios, Icono
  layouts/Base.astro
  pages/index.astro, propiedades/index.astro, propiedades/[slug].astro, 404.astro
  styles/tokens.css, styles/global.css
```

## Entregables

1. Proyecto funcionando con `npm run dev` y `npm run build` sin errores ni warnings.
2. README en español: cómo correrlo, cómo agregar una propiedad (paso a paso con ejemplo de JSON y carpeta de fotos), cómo cambiar datos de contacto, y la sección "Pasar a producción con Wasi".
3. Al terminar, un resumen con: puntajes de Lighthouse mobile, lista de `[A CONFIRMAR]` pendientes y cualquier decisión que hayas tomado por tu cuenta.

Trabajá en este orden: tokens y layout base → datos y helpers → tarjeta y cartel → inicio → ficha → listado → SEO/OG → pulido y Lighthouse. Antes de escribir código, mostrame en 10 líneas cómo vas a resolver el selector, la galería y los filtros.
