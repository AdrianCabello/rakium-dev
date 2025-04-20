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
}

export const services: Service[] = [
  {
    id: 3,
    title: 'Portfolio',
    subtitle: 'Tu experiencia profesional en línea',
    icon: faUserTie,
    description: 'Portfolios profesionales para mostrar tu trabajo y experiencia.',
    precioEstatico: '250.000',
    precioAutogestionable: '500.000 + 20.000/mes',
    idealFor: ['Freelancers', 'Artistas', 'Creativos'],
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
      'Proyectos (agregar, editar, eliminar)',
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
    idealFor: ['Empresas', 'Profesionales', 'Marcas personales'],
    incluye: [
      'Home, Nosotros, Servicios, Contacto y Redes',
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
      'Proyectos (agregar, editar, eliminar)',
      'Autenticación segura para acceso privado al panel'
    ],
  },
  {
    id: 4,
    title: 'Portfolio Artista / DJ',
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
    upgrades: [
      {
        name: 'Cambios puntuales',
        price: '5.000 por modificación',
        description: 'reemplazo de imagen, video, texto, o evento'
      },
      {
        name: 'Mantenimiento mensual',
        price: '20.000',
        description: 'Cambios ilimitados dentro del alcance del diseño original'
      }
    ]
  },

  {
    id: 9,
    title: 'Sistema de Reservas',
    subtitle: 'Agenda online',
    icon: faCalendarCheck,
    description: 'Sistemas para gestionar citas y reservas.',
    precioEstatico: '350.000 – 500.000',
    precioAutogestionable: '500.000 – 800.000',
    idealFor: ['Consultorios', 'Peluquerías', 'Restaurantes'],
    incluye: [
      'Agenda editable',
      'Reserva por día y hora',
      'Confirmaciones automáticas',
      'Dominio personalizado'
    ]
  },
  {
    id: 8,
    title: 'Sitio para Inmobiliarias',
    subtitle: 'Propiedades online',
    icon: faHome,
    description: 'Plataformas para mostrar y gestionar propiedades.',
    precioEstatico: '400.000 – 600.000',
    precioAutogestionable: '600.000 – 900.000',
    idealFor: ['Inmobiliarias', 'Agentes inmobiliarios'],
    incluye: [
      'Listado de propiedades con filtros',
      'Panel para cargar nuevas unidades',
      'Hosting backend',
      'Dominio personalizado'
    ]
  },
  /* {
    id: 7,
    title: 'Página para Eventos',
    subtitle: 'Promociona tu evento',
    icon: faMusic,
    description: 'Sitios web para eventos, festivales y shows.',
    precioEstatico: '250.000 – 320.000',
    precioAutogestionable: '400.000 – 500.000',
    idealFor: ['DJs', 'Productoras', 'Festivales'],
    incluye: [
      'Lineup, galería, ubicación',
      'Link a entradas o integración'
    ]
  }, */
  /*   {
      id: 5,
      title: 'E-commerce Básico',
      subtitle: 'Vende en línea',
      icon: faShoppingCart,
      description: 'Tiendas online para pequeños negocios y catálogos.',
      precioEstatico: '280.000 – 350.000',
      precioAutogestionable: '450.000 – 600.000',
      idealFor: ['Pequeños negocios', 'Tiendas por catálogo'],
      incluye: [
        'Catálogo de productos',
        'Contacto por WhatsApp',
        'Hasta 10 productos cargados'
      ]
    }, */
  {
    id: 6,
    title: 'E-commerce con tienda nube',
    subtitle: 'Ventas completas',
    icon: faCreditCard,
    description: 'Tiendas online con procesamiento de pagos integrado.',
    precioEstatico: '400.000 – 600.000',
    precioAutogestionable: '600.000 – 900.000',
    idealFor: ['Negocios online', 'Tiendas retail'],
    incluye: [
      'Carrito, checkout, Mercado Pago / Stripe',
      'Panel de administración',
      'Hosting + backend 1 año incluido',
      'Dominio personalizado'
    ]
  },


  {
    id: 11,
    title: 'Intranet / Dashboard',
    subtitle: 'Gestión interna',
    icon: faChartLine,
    description: 'Sistemas administrativos para gestión interna.',
    precioEstatico: '500.000 – 900.000',
    precioAutogestionable: '800.000 – 1.200.000',
    idealFor: ['Empresas', 'Organizaciones'],
    incluye: [
      'Login con roles',
      'Gestión de usuarios y métricas',
      'Hosting dedicado',
      'Dominio personalizado'
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
    price: '10.000 – 25.000 /mes',
    icon: faDatabase
  },
  {
    id: 3,
    title: 'Mantenimiento Mensual',
    description: 'Soporte y actualizaciones',
    price: '20.000 – 50.000 /mes',
    icon: faCode
  },
];

export const extras = [

  {
    id: 2,
    title: 'Multi idioma',
    price: '+50.000',
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