import type { SiteSettings } from './site-settings.types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  contact: {
    whatsappNumber: '542262497993',
    whatsappMessage: 'Hola! Quería asesoramiento para crear un proyecto digital con Rakium.',
    email: '',
    phone: '',
    address: '',
  },
  about: '',
  description:
    'Creamos sitios web, aplicaciones y piezas de diseño que destacan tu marca, conectan con tu audiencia y potencian tu presencia digital.',
  services: [
    {
      id: '1',
      title: 'Sistema de Reservas',
      subtitle: 'Agenda online profesional',
      icon: 'calendar-check',
      description:
        'Plataformas web para gestionar citas, turnos y reservas con facilidad y eficiencia.',
      precioEstatico: '',
      precioAutogestionable: 'A partir de $1000 USD',
      idealFor: [
        'Consultorios médicos y psicológicos',
        'Peluquerías y centros de estética',
        'Restaurantes y cafés',
      ],
      incluye: [],
      incluyeWithBackend: [
        'Agenda editable desde panel',
        'Reservas online por día y hora',
        'Dominio personalizado',
      ],
      order: 0,
    },
    {
      id: '2',
      title: 'Sitio para Inmobiliarias',
      subtitle: 'Tus propiedades online, 24/7',
      icon: 'home',
      description:
        'Webs pensadas para mostrar y administrar propiedades de forma moderna y eficiente.',
      precioEstatico: '$600 USD',
      precioAutogestionable: 'A partir de $1000 USD',
      idealFor: ['Inmobiliarias', 'Agentes inmobiliarios independientes'],
      incluye: [
        'Listado de propiedades con filtros',
        'Ficha de propiedad con imágenes',
        'Formulario de contacto y WhatsApp',
      ],
      order: 1,
    },
    {
      id: '3',
      title: 'E-commerce con Tiendanube',
      subtitle: 'Tu tienda online lista para vender',
      icon: 'credit-card',
      description:
        'Servicio profesional de configuración, diseño y optimización de tu tienda en Tiendanube.',
      precioEstatico: 'Sujeto a cantidad de productos',
      precioAutogestionable: '',
      idealFor: ['Negocios online', 'Emprendimientos', 'Marcas personales'],
      incluye: [
        'Configuración inicial',
        'Carga de productos',
        'Diseño visual personalizado',
      ],
      order: 2,
    },
  ],
  socialNetworks: [
    { id: '1', name: 'Instagram', url: 'https://instagram.com/rakium.dev', icon: 'instagram' },
    { id: '2', name: 'LinkedIn', url: 'https://linkedin.com/company/rakium', icon: 'linkedin' },
  ],
};
