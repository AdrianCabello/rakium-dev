import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Check } from 'lucide-angular';
import { SiteSettingsService } from '../../core/services/site-settings.service';

interface Plan {
  id: string;
  name: string;
  tagline: string;
  idealFor: string[];
  problem: string;
  features: string[];
  diferencial: string;
  model: string;
  price: string;
  recommended?: boolean;
}

interface Solution {
  id: string;
  name: string;
  tagline: string;
  idealFor: string[];
  problem: string;
  features: string[];
  diferencial: string;
  model: string;
  price: string;
}

@Component({
  selector: 'app-plans-solutions',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './plans-solutions.component.html',
  styles: [`
    .plan-card {
      transition: transform 0.2s, box-shadow 0.2s;
    }

    @media (hover: hover) and (pointer: fine) {
      .plan-card:not(.plan-recommended):hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px -12px rgba(0, 0, 0, 0.25);
      }
    }

    .plan-recommended {
      box-shadow: 0 0 0 2px rgb(59 130 246), 0 12px 40px -12px rgba(59, 130, 246, 0.3);
    }
  `],
})
export class PlansSolutionsComponent {
  readonly siteSettings = inject(SiteSettingsService);
  readonly whatsappUrl = this.siteSettings.whatsappUrl;
  readonly activeCategory = signal('sistemas');

  checkIcon = Check;

  toggleCategory(id: string): void {
    this.activeCategory.set(this.activeCategory() === id ? '' : id);
  }

  readonly designSolutions: { id: string; name: string; description: string }[] = [
    {
      id: 'branding',
      name: 'Branding',
      description: 'Desarrollo de sistemas visuales completos que incluyen logo, paleta de colores, tipografía y aplicaciones gráficas para construir una marca coherente y memorable.',
    },
    {
      id: 'redes',
      name: 'Diseño para Redes Sociales',
      description: 'Creación de contenido visual y organización de tu feed para transmitir de forma clara lo que hacés y generar una presencia digital sólida y auténtica.',
    },
    {
      id: 'flyers',
      name: 'Flyers para Eventos',
      description: 'Diseño de flyers impactantes y adaptados al estilo de cada evento, pensados para captar la atención del público y potenciar la comunicación.',
    },
  ];

  readonly webPlans: Plan[] = [
    {
      id: 'esencial',
      name: 'Plan Esencial',
      tagline: 'Tu presencia profesional online, rápida y sin fricciones.',
      idealFor: ['Profesionales independientes', 'Consultores', 'Emprendedores con producto único', 'Quienes priorizan simplicidad'],
      problem: 'Necesitás una web que represente tu marca sin invertir tiempo en actualizaciones. Una vitrina digital que trabaje por vos 24/7.',
      features: [
        'Home, Nosotros, Servicios, Contacto y Redes',
        'Diseño responsivo y veloz',
        'SEO básico + Google Analytics',
        'Dominio y hosting incluido',
        'Sin panel de administración',
      ],
      diferencial: 'Diseño exclusivo, no plantilla. Entregamos en 2-3 semanas con un proceso claro y sin sorpresas.',
      model: 'Proyecto cerrado a medida',
      price: 'Desde USD 800',
    },
    {
      id: 'profesional',
      name: 'Plan Profesional',
      tagline: 'Actualizá tu web cuando quieras, sin depender de nadie.',
      idealFor: ['Empresas en crecimiento', 'Agencias', 'Estudios creativos', 'Startups que iteran rápido'],
      problem: 'Tu negocio evoluciona y tu web no. Necesitás autonomía para cambiar textos, imágenes y proyectos sin pasar por un desarrollador.',
      features: [
        'Todo el Plan Esencial',
        'Panel de administración intuitivo',
        'Proyectos y galería editables',
        'Formularios de contacto',
        'Posibilidad de blog o sección noticias',
      ],
      diferencial: 'Entrenamiento incluido. Te enseñamos a usar el panel en una sesión 1:1 para que estés operativo desde el día uno.',
      model: 'Proyecto escalable a medida',
      price: 'Desde USD 1.400',
      recommended: true,
    },
    {
      id: 'premium',
      name: 'Plan Premium',
      tagline: 'Una web que impulsa estrategia, conversiones y crecimiento.',
      idealFor: ['Empresas con presupuesto definido', 'Marcas que compiten por liderazgo', 'Quienes priorizan performance y datos'],
      problem: 'Tu web es más que una vitrina: es una herramienta de ventas y captación. Necesitás insights, optimización y una arquitectura pensada para escalar.',
      features: [
        'Todo el Plan Profesional',
        'Análisis UX/UI orientado a conversión',
        'Integración con CRM o herramientas de marketing',
        'Landing pages adicionales',
        'A/B testing y optimización continua',
      ],
      diferencial: 'Mirada estratégica de producto. No solo diseñamos: analizamos flujos, métricas y oportunidades para que tu web genere resultados medibles.',
      model: 'Proyecto estratégico a medida',
      price: 'Desde USD 2.800',
    },
  ];

  readonly ecommerceSolutions: Solution[] = [
    {
      id: 'tiendanube',
      name: 'E-commerce con Tiendanube',
      tagline: 'Tu tienda online operativa en semanas, no en meses.',
      idealFor: ['Marcas con catálogo acotado', 'Emprendedores que arrancan', 'Negocios B2C en Argentina y LATAM'],
      problem: 'Necesitás vender online ya. Tiendanube ofrece la infraestructura; nosotros la configuramos, diseñamos y optimizamos para que vendas más.',
      features: [
        'Configuración completa de la tienda',
        'Carga de productos y categorías',
        'Diseño personalizado (logo, banners, paleta)',
        'Integración Mercado Pago',
        'SEO y asesoramiento en estructura',
      ],
      diferencial: 'No solo configuramos: te asesoramos en estructura de fichas, fotografía y flujos de compra para maximizar conversiones desde el inicio.',
      model: 'Implementación escalable sobre plataforma',
      price: 'Desde USD 600',
    },
    {
      id: 'custom',
      name: 'E-commerce Personalizado',
      tagline: 'Cuando tu negocio necesita más que una tienda estándar.',
      idealFor: ['Mayoristas y distribuidores', 'Negocios B2B', 'Marcas con lógica de precios compleja', 'Multi-sucursal o multi-vendedor'],
      problem: 'Las plataformas estándar no cubren tu modelo: precios por volumen, pedidos mínimo, catálogos privados, integración con stock o ERP.',
      features: [
        'Desarrollo a medida en Angular + backend',
        'Lógica de negocio personalizada',
        'Integración con ERP, stock, facturación',
        'Gestión de usuarios y permisos',
        'Reportes y analíticas a medida',
      ],
      diferencial: 'Arquitectura pensada para crecer. Construimos la base técnica para que tu e-commerce escale sin límites de plataforma.',
      model: 'Desarrollo a medida escalable',
      price: 'Desde USD 3.500',
    },
  ];

  readonly sistemasSolutions: Solution[] = [
    {
      id: 'dashboard',
      name: 'Dashboard de Gestión Empresarial',
      tagline: 'Métricas, reportes y control en un solo lugar.',
      idealFor: ['Empresas con múltiples canales', 'Franquicias', 'Gerencia que necesita visibilidad', 'Equipos comerciales distribuidos'],
      problem: 'Los datos están dispersos en planillas, CRM y sistemas legacy. Necesitás un centro de comando que unifique y visualice lo que importa.',
      features: ['KPIs en tiempo real', 'Gráficos y reportes personalizados', 'Alertas y notificaciones', 'Exportación PDF/Excel', 'Acceso por roles'],
      diferencial: 'Diseño de información, no solo pantallas. Priorizamos qué mostrar y cómo para que las decisiones sean más rápidas.',
      model: 'Desarrollo a medida',
      price: 'Desde USD 5.000',
    },
    {
      id: 'crm',
      name: 'CRM Personalizado',
      tagline: 'Un CRM que se adapta a tu proceso comercial, no al revés.',
      idealFor: ['Equipos de ventas complejos', 'B2B con ciclos largos', 'Empresas con procesos únicos', 'Quienes no encajan en CRM genéricos'],
      problem: 'Salesforce, HubSpot y similares son poderosos pero rígidos. Tu proceso de venta es distinto y merece una herramienta a su medida.',
      features: ['Pipeline visual personalizable', 'Etapas y campos a medida', 'Historial de interacciones', 'Integración con email, calendario, WhatsApp', 'Reportes de funnel'],
      diferencial: 'Modelado de proceso primero. Mapeamos tu funnel real y construimos el CRM que lo refleje, no una plantilla que te obligue a adaptarte.',
      model: 'Desarrollo a medida escalable',
      price: 'Desde USD 6.500',
    },
    {
      id: 'sistema-interno',
      name: 'Sistema Interno de Gestión',
      tagline: 'Centralizá operaciones, documentación y flujos en una sola plataforma.',
      idealFor: ['Empresas con procesos manuales', 'Equipos que usan muchas planillas', 'Sectores regulados', 'Operaciones que necesitan trazabilidad'],
      problem: 'La información corre por email, Drive y planillas. Los procesos no están documentados y escalar duele. Necesitás un sistema que ordene todo.',
      features: ['Módulos según necesidad (turnos, stock, facturación, etc.)', 'Flujos de aprobación', 'Documentación centralizada', 'Roles y permisos', 'Auditoría de cambios'],
      diferencial: 'Implementación por fases. Empezamos por el dolor más grande y sumamos módulos sin reescribir todo. Crecimiento controlado.',
      model: 'Desarrollo a medida por fases',
      price: 'Desde USD 7.000',
    },
    {
      id: 'inmobiliaria',
      name: 'Plataforma Inmobiliaria',
      tagline: 'Mostrá y gestioná tus propiedades desde un solo lugar.',
      idealFor: ['Inmobiliarias', 'Corredores', 'Constructoras', 'Desarrolladores'],
      problem: 'Necesitás publicar propiedades de forma profesional, actualizarlas rápido y centralizar consultas sin depender de planillas o portales externos.',
      features: ['Listado de propiedades con filtros', 'Ficha completa con galería y ubicación', 'Destacados y propiedades relacionadas', 'Formulario de contacto por propiedad', 'Panel de administración con login'],
      diferencial: 'Pensada para conversión inmobiliaria: estructura clara, navegación ágil y foco en generar más consultas calificadas.',
      model: 'Plataforma a medida escalable',
      price: 'Desde USD 4.200',
    },
    {
      id: 'educativa',
      name: 'Plataforma para Artistas',
      tagline: 'Centralizá tu carrera en un espacio profesional y autogestionable.',
      idealFor: ['Músicos', 'Bandas', 'DJ/producers', 'Artistas visuales'],
      problem: 'Necesitás una web propia para mostrar tu identidad, organizar tu contenido y actualizar tu perfil sin depender de redes o terceros.',
      features: ['Perfil artístico completo y biografía', 'Galería de fotos y videos administrable', 'Sección de música y lanzamientos', 'Gestión de trabajos y proyectos', 'Panel de administración para autogestión'],
      diferencial: 'Pensada para potenciar tu marca personal: diseño a medida, contenido editable y estructura lista para crecer con tu carrera.',
      model: 'Plataforma a medida escalable',
      price: 'Desde USD 4.500',
    },
    {
      id: 'marketplace',
      name: 'Plataforma de Eventos para Productoras',
      tagline: 'Tu Eventloop propio, 100% personalizado para tu operación.',
      idealFor: ['Productoras de eventos', 'Colectivos y sellos', 'Festivales', 'Empresas de entretenimiento'],
      problem: 'Necesitás una plataforma propia para publicar eventos, vender entradas, gestionar accesos y centralizar métricas sin depender de soluciones genéricas.',
      features: ['Gestión de eventos y fechas', 'Venta de entradas con pasarela integrada', 'Panel para validación y control de accesos', 'Comisiones y liquidaciones configurables', 'Reportes y analytics en tiempo real'],
      diferencial: 'Diseño y lógica a medida de tu productora: branding, flujos y reglas de negocio totalmente personalizadas.',
      model: 'Plataforma a medida escalable',
      price: 'Desde USD 9.000',
    },
  ];

  readonly automatizacionSolutions: Solution[] = [
    {
      id: 'automatizacion',
      name: 'Automatización de Procesos',
      tagline: 'Menos trabajo manual, más tiempo para lo que importa.',
      idealFor: ['Empresas con tareas repetitivas', 'Equipos pequeños que hacen de todo', 'Quienes pierden tiempo en trámites internos'],
      problem: 'Hay procesos que consumen horas y no agregan valor: sincronizar datos, generar reportes, enviar recordatorios. La automatización libera ese tiempo.',
      features: ['Mapeo de procesos candidatos', 'Automatización con Zapier/Make o desarrollo propio', 'Webhooks e integraciones API', 'Monitoreo y alertas de fallos'],
      diferencial: 'Priorizamos por impacto. Identificamos qué automatizar primero para maximizar el ahorro de tiempo con la menor inversión.',
      model: 'Proyecto por proceso, escalable',
      price: 'Desde USD 800',
    },
    {
      id: 'mercadopago',
      name: 'Integración con Mercado Pago',
      tagline: 'Cobrá online de forma segura y en tiempo real.',
      idealFor: ['E-commerce', 'Servicios que cobran por adelantado', 'Suscripciones', 'Negocios en Argentina y LATAM'],
      problem: 'Necesitás recibir pagos online con la pasarela más usada en la región. Pero integrar bien requiere conocer el flujo, webhooks y edge cases.',
      features: ['Checkout Pro o integración API', 'Webhooks para confirmación automática', 'Suscripciones recurrentes (si aplica)', 'Manejo de estados y reembolsos'],
      diferencial: 'Implementación robusta. No solo conectamos: manejamos reintentos, idempotencia y edge cases para que no pierdas ventas por errores técnicos.',
      model: 'Integración a medida',
      price: 'Desde USD 500',
    },
    {
      id: 'erp-crm',
      name: 'Integración con ERP / CRM',
      tagline: 'Que tus sistemas hablen entre sí, sin planillas de por medio.',
      idealFor: ['Empresas con ERP (SAP, Odoo, etc.)', 'Equipos que usan CRM y necesitan sincronizar', 'Operaciones multi-sistema'],
      problem: 'Tenés un ERP para operaciones y un CRM para ventas, pero no se comunican. Los datos se cargan dos veces y los reportes no cuadran.',
      features: ['Conexión API o archivos intermedios', 'Sincronización bidireccional o unidireccional', 'Mapeo de datos y transformaciones', 'Manejo de errores y reintentos'],
      diferencial: 'Conocimiento de sistemas enterprise. Trabajamos con APIs complejas, autenticación y volúmenes que requieren arquitectura pensada.',
      model: 'Proyecto de integración a medida',
      price: 'Desde USD 1.500',
    },
    {
      id: 'whatsapp-email',
      name: 'Automatización WhatsApp + Email',
      tagline: 'Comunicación escalable sin sacrificar el trato personal.',
      idealFor: ['Equipos comerciales', 'Soporte al cliente', 'Ventas que cierran por WhatsApp', 'Marketing que usa múltiples canales'],
      problem: 'Respondés manualmente cada consulta y perdés ventas por demora. Necesitás automatizar mensajes, seguimientos y campañas sin sonar a bot.',
      features: ['Flujos de mensajes automatizados', 'Integración WhatsApp Business API', 'Emails transaccionales y marketing', 'Triggers por acción del usuario', 'Dashboard de conversaciones'],
      diferencial: 'Tono humano en automatización. Diseñamos mensajes que conversan, no que suenan a template. La tecnología al servicio de la relación.',
      model: 'Implementación por flujos, escalable',
      price: 'Desde USD 1.200',
    },
  ];
}
