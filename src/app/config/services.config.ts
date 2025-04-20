import {
  faBuilding,
  faRocket,
  faUserTie,
  faNewspaper,
  faShoppingCart,
  faCreditCard,
  faMusic,
  faHome,
  faCalendarCheck,
  faGraduationCap,
  faChartLine,
  faServer,
  faGlobe,
  faCode,
  faPalette,
  faDatabase
} from '@fortawesome/free-solid-svg-icons';

export interface ServiceFeature {
  name: string;
  description?: string;
}

export interface ServiceUpgrade {
  name: string;
  price: string;
  description?: string;
}

export interface Service {
  id: number;
  title: string;
  subtitle: string;
  icon: any;
  description: string;
  precioEstatico: string;
  precioAutogestionable: string;
  idealFor: string[];
  incluye: string[];
  upgrades?: ServiceUpgrade[];
  incluyeWithBackend?: string[];
  modulesAvailable?: string[];
}

export const services: Service[] = [
  {
    id: 3,
    title: 'Portfolio Profesional',
    subtitle: 'Tu experiencia profesional en línea',
    icon: faUserTie,
    description: 'Portfolios profesionales para mostrar tu trabajo y experiencia.',
    precioEstatico: '250.000',
    precioAutogestionable: '500.000 + 20.000/mes',
    idealFor: ['Freelancers', 'Diseñadores graficos', 'Ilustradores',
      'Fotógrafos', 'Arquitectos', 'Productores audiovisuales', 'Abogados',
      'Contadores',
      'Marketing',
      'Consultores IT',
    ],
    incluye: [
      'Home, Sobre mí, Experiencia, Contacto y Redes',
      'Proyectos: 6 proyectos máximos',
      'Galería fija (opcional)',
      'Videos (opcional)',
      'Testimonios (opcional)',
      'SEO + Google Analytics',
      'Dominio personalizado'
    ],
    incluyeWithBackend: [
      'Todo lo anterior',
      'Panel de administración para editar:',
      'Proyectos ilimitados: (agregar, editar, eliminar)',
      'Autenticación segura para acceso privado al panel'
    ],
    upgrades: [
      {
        name: 'Cambios puntuales',
        price: '5.000 por modificación',
        description: 'reemplazo de imagen o texto, etc.'
      },
      {
        name: 'Mantenimiento mensual',
        price: '20.000',
        description: 'Cambios ilimitados dentro del alcance del diseño original'
      }
    ]
  },
  {
    id: 1,
    title: 'Web Institucional',
    subtitle: 'Presencia profesional en línea',
    icon: faBuilding,
    description: 'Sitios web profesionales que representan tu marca y conectan con tu audiencia.',
    precioEstatico: '250.000',
    precioAutogestionable: '500.000 + 20.000/mes',
    idealFor: ['Empresas',
      'Profesionales',
      'Marcas personales',
      'Emprendimientos',
      'Startups',
      'Agencias de marketing',
      'Estudios jurídicos',
      'Consultoras',
      'Clínicas y centros de salud',
      'Arquitectos',
      'Contadores',
      'Abogados',
      'Psicólogos',
      'Entrenadores/as personales',
      'Escuelas y academias', 'ONGs y fundaciones',
      'Tiendas físicas que no venden online',
      'Negocios gastronómicos',
      'Salones de eventos',
      'Barberías y peluquerías'],
    incluye: [
      'Home, Nosotros, Servicios, Contacto y Redes',
      'Proyectos: 6 proyectos máximos',
      'Galería de fotos (opcional)',
      'Videos de youtube(opcional)',
      'Testimonios (opcional)',
      'SEO + Google Analytics',
      'Dominio personalizado'
    ],
    incluyeWithBackend: [
      'Todo lo anterior',
      'Panel de administración para editar:',
      'Proyectos ilimitados: (agregar, editar, eliminar)',
      'Autenticación segura para acceso privado al panel'
    ],
  },
  {
    id: 4,
    title: 'Portfolio Artista',
    subtitle: 'Tu identidad musical en una web',
    icon: faMusic,
    description: 'Una página profesional para mostrar tu música, estética, fechas y conectar con tu audiencia.',
    precioEstatico: '250.000',
    precioAutogestionable: '500.000 + 20.000/mes',
    idealFor: ['DJs', 'Productores/as musicales', 'Músicos/as', 'Artistas Visuales'],
    incluye: [
      'Home con imagen de impacto y frase destacada',
      'Biografía artística + redes sociales',
      'Música: embeds de Spotify, SoundCloud, YouTube, etc.',
      'Galería visual: fotos de eventos, sesiones, arte (opcional)',
      'Videos (opcional): videoclips, live sets, backstage',
      'Agenda fija de fechas o presentaciones (opcional)',
      'Contacto profesional: bookeo, prensa, colaboraciones',
      'SEO + Google Analytics',
      'Dominio personalizado'
    ],
    incluyeWithBackend: [
      'Todo lo anterior',
      'Panel de administración para editar:',
      'Eventos',
      'Música y links externos (Spotify, YouTube, etc.)',
      'Galería de fotos',
      'Autenticación segura para acceso privado al panel'
    ],
  },
  {
    id: 9,
    title: 'Sistema de Reservas',
    subtitle: 'Agenda online profesional',
    icon: faCalendarCheck,
    description: 'Plataformas web para gestionar citas, turnos y reservas con facilidad y eficiencia.',
    precioEstatico: '',
    precioAutogestionable: '800.000 + 20.000/mes',
    idealFor: [
      'Consultorios médicos y psicológicos',
      'Peluquerías y centros de estética',
      'Restaurantes y cafés',
      'Salones de eventos',
      'Estudios de yoga o pilates',
      'Talleres y capacitaciones presenciales',
      'Entrenadores personales'
    ],
    incluye: [],
    incluyeWithBackend: [
      'Agenda editable desde panel',
      'Reservas online por día y hora',
      'Cancelaciones y reprogramaciones simples',
      'Visualización por días, semanas o mes',
      'Dominio personalizado',
      'SEO + Google Analytics',
      'Panel de administración para gestionar reservas',
      'Gestión de disponibilidad personalizada',
      'Listado y edición de clientes',
      'Autenticación segura para acceso privado al panel'
    ]
  },
  {
    id: 8,
    title: 'Sitio para Inmobiliarias',
    subtitle: 'Tus propiedades online, 24/7',
    icon: faHome,
    description: 'Webs pensadas para mostrar y administrar propiedades de forma moderna y eficiente.',
    precioEstatico: '600.000',
    precioAutogestionable: '900.000 + 20.000/mes',
    idealFor: [
      'Inmobiliarias',
      'Agentes inmobiliarios independientes',
      'Desarrolladoras de proyectos',
      'Barrios privados',
      'Constructoras'
    ],
    incluye: [
      'Listado de hasta 10 propiedades con filtros (tipo, zona, precio, etc.)',
      'Ficha de propiedad con imágenes, descripción, mapa, amenities y contacto',
      'Galería de fotos y videos',
      'Formulario de contacto y WhatsApp directo',
      'Dominio personalizado',
      'SEO + Google Analytics'
    ],
    incluyeWithBackend: [
      'Todo lo anterior',
      'Panel de administración para gestionar propiedades',
      'Carga, edición y eliminación de unidades',
      'Gestión de estados (Disponible, Reservado, Vendido)',
      'Autenticación segura para acceso privado al panel',
      'Hosting backend incluido'
    ]
  },

  {
    id: 6,
    title: 'E-commerce con Tiendanube',
    subtitle: 'Tu tienda online lista para vender',
    icon: faCreditCard,
    description: 'Servicio profesional de configuración, diseño y optimización de tu tienda en Tiendanube. Nos encargamos de dejarla lista para que empieces a vender.',
    precioEstatico: '400.000',
    precioAutogestionable: '600.000 + 200.000/mes',
    idealFor: [
      'Negocios online',
      'Tiendas físicas que quieren vender por internet',
      'Emprendimientos de productos',
      'Marcas personales',
      'Tiendas retail'
    ],
    incluye: [
      'Configuración inicial de Tiendanube',
      'Carga de productos (hasta 30 unidades)',
      'Diseño visual personalizado (logo, banners, paleta de colores)',
      'Integración con medios de pago: Mercado Pago, Stripe o transferencia',
      'Configuración de métodos de envío (Correo Argentino, retiro en local, etc.)',
      'Conexión con redes sociales (Instagram, WhatsApp)',
      'Dominio personalizado (si ya lo tenés o lo comprás)',
      'Optimización para buscadores (SEO básico)',
      'Asesoramiento en estructura de categorías y fichas de producto',
      'Tutorial básico para gestión de pedidos y productos'
    ],
    incluyeWithBackend: [
      'Todo lo anterior',
      'Soporte técnico mensual por cambios menores',
      'Carga adicional de productos o categorías (hasta 100)',
      'Diseño de banners promocionales o campañas estacionales'
    ]
  },
  {
    id: 11,
    title: 'Intranet / Dashboard',
    subtitle: 'Centralizá tu gestión interna',
    icon: faChartLine,
    description: 'Sistemas web personalizados para gestionar usuarios, datos, reportes y procesos internos de forma segura y eficiente.',
    precioEstatico: '500.000 – 900.000',
    precioAutogestionable: '800.000 – 1.200.000 + 30.000/mes',
    idealFor: [
      'Empresas',
      'Organizaciones',
      'Startups',
      'Equipos de trabajo con procesos internos',
      'Áreas administrativas, RRHH, ventas o soporte'
    ],
    incluye: [
      'Inicio de sesión con roles y permisos (admin, usuario, etc.)',
      'Gestión de usuarios: alta, baja, edición',
      'Dashboard de métricas personalizado',
      'Carga y consulta de información interna',
      'Dominio personalizado',
      'Hosting dedicado',
      'SEO básico y seguridad SSL'
    ],
    incluyeWithBackend: [
      'Todo lo anterior',
      'Panel de administración completo',
      'Filtros, búsquedas y exportación de datos (CSV, PDF, etc.)',
      'Módulos personalizados: reportes, tareas, inventario, turnos, etc.',
      'Notificaciones internas (email o en app)',
      'Autenticación segura y cifrado de datos',
      'Soporte técnico y actualizaciones mensuales'
    ],
    modulesAvailable: [
      'Gestión de usuarios y permisos',
      'Panel de métricas e informes personalizados',
      'Carga de facturas y gestión de pagos',
      'Gestión de empleados y asistencia',
      'Registro de stock e inventario',
      'Asignación de tareas y seguimiento de proyectos',
      'Carga y descarga de documentos internos',
      'Mesa de ayuda y soporte interno',
      'Módulo de capacitaciones internas',
      'Agenda de turnos o reuniones',
      'Notificaciones por email o dentro del sistema',
      'Exportación de datos (CSV, Excel, PDF)',
      'Integración con Google Drive, Sheets o APIs externas'
    ]
  }
];

export const hostingServices = [
  {
    id: 1,
    title: 'Hosting Estático',
    description: 'Github Pages',
    price: 'Incluido (sin backend)',
    icon: faServer
  },
  {
    id: 2,
    title: 'Hosting Backend',
    description: 'Hostinger/VPS',
    price: '$10.000 – $25.000 /mes',
    icon: faDatabase
  },
  {
    id: 3,
    title: 'Mantenimiento Mensual',
    description: 'Soporte y actualizaciones',
    price: '$20.000 – $50.000 /mes',
    icon: faCode
  },
];

export const extras = [

  {
    id: 2,
    title: 'Multi idioma',
    price: '50.000',
    icon: faGlobe
  },
  {
    id: 3,
    title: 'Integración con Sistemas Externos',
    price: '30.000 a 80.000',
    description: 'CRMs, WhatsApp, reservas',
    icon: faCode
  },
  {
    id: 4,
    title: 'Animaciones Personalizadas',
    price: '20.000 a 40.000',
    icon: faPalette
  }
]; 