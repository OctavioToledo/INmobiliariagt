/**
 * Datos del cliente y textos editables.
 * Todo lo que empieza con el prefijo PENDIENTE está sin confirmar: en desarrollo se ve con
 * borde punteado y `npm run pendientes` lista cada caso.
 */

export const PENDIENTE = '[A CONFIRMAR]'; // @pendientes-ignorar

export const esPendiente = (valor: string | null | undefined): boolean =>
  typeof valor === 'string' && valor.startsWith(PENDIENTE);

export const sitio = {
  nombre: 'Gerardo Tello Inmobiliaria',
  descripcion:
    'Alquileres y ventas de casas, departamentos y lotes en San Martín y Palmira, Mendoza. Tasaciones y acompañamiento hasta la firma.',
  servicios: ['Tasaciones', 'Venta de propiedades', 'Alquiler de propiedades'],
  zonaDeTrabajo: 'San Martín y Palmira',
  eslogan: 'Entre 2 siempre es mejor',

  direccion: {
    calle: 'Sargento Cabral 278',
    localidad: 'San Martín',
    provincia: 'Mendoza',
    pais: 'AR',
  },
  // Coordenadas que figuran en Wasi para Sargento Cabral 278.
  coordenadas: { lat: -33.0886, lng: -68.4686 } as { lat: number; lng: number } | null,

  telefono: {
    visible: '+54 263 431-9356',
    link: '+542634319356',
  },
  // Celular del logo del sitio actual ("Cel. 2634-319356"). El sitio de Wasi lo mostraba mal
  // formado ("+5402634319356"). Formato del link: 549 + característica sin 0 + número sin 15.
  whatsapp: {
    numero: '5492634319356',
    visible: '+54 9 263 431-9356',
  },
  email: 'etinmobiliaria@gmail.com',
  /** Horarios de atención. Vacío = no se muestran. */
  horarios: '',

  corredor: {
    nombre: 'Gerardo Tello',
    cargo: 'Corredor inmobiliario',
    // Tomada del logo del sitio actual ("Gerardo Tello Mat. N° 161").
    matricula: '161',
  },

  redes: [
    { nombre: 'Facebook', url: 'https://www.facebook.com/inmobiliarios.deleste' },
    { nombre: 'Instagram', url: 'https://www.instagram.com/gerardotelloinmobiliaria' },
    { nombre: 'YouTube', url: 'https://www.youtube.com/@gerardotello1201' },
  ],

  proceso: [
    { titulo: 'Tasación', texto: 'Vemos la propiedad y te decimos cuánto vale hoy en el mercado.' },
    { titulo: 'Publicación', texto: 'Le sacamos fotos y la publicamos en el sitio y en las redes.' },
    { titulo: 'Visitas', texto: 'Coordinamos y acompañamos cada visita con los interesados.' },
    { titulo: 'Firma', texto: 'Evaluamos a los interesados, armamos la documentación y te acompañamos hasta la firma.' },
  ],

  privacidadUrl: '/privacidad',

  /** Firma del footer. `url` vacío = sin link. */
  firma: { texto: 'Sitio hecho por Devott', url: '' },
} as const;

export const direccionCompleta = `${sitio.direccion.calle}, ${sitio.direccion.localidad}, ${sitio.direccion.provincia}`;
