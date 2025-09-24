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
    id: 9,
    title: 'Sistema de Reservas',
    subtitle: 'Agenda online profesional',
    icon: faCalendarCheck,
    description: 'Plataformas web para gestionar citas, turnos y reservas con facilidad y eficiencia.',
    precioEstatico: '',
    precioAutogestionable: 'A partir de $1000 USD',
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
    precioEstatico: '$600 USD',
    precioAutogestionable: 'A partir de $1000 USD',
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
    precioEstatico: 'Precio: Sujeto a cantidad de productos',
    precioAutogestionable: '',
    idealFor: [
      'Negocios online',
      'Tiendas físicas que quieren vender por internet',
      'Emprendimientos de productos',
      'Marcas personales',
      'Tiendas retail'
    ],
    incluye: [
      'Configuración inicial de Tiendanube',
      'Carga de productos (precio según cantidad)',
      'Diseño visual personalizado (logo, banners, paleta de colores)',
      'Configuración de dominio personalizado',
      'Optimización para buscadores (SEO básico)',
      'Asesoramiento en estructura de categorías y fichas de producto'
    ],
    incluyeWithBackend: []
  },
/*   {
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
  } */
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
