import { Lead } from '../admin-leads/lead-shared';

export type SellerStatus = 'TRAINING' | 'ACTIVE' | 'PAUSED' | 'INACTIVE';
export type SellerActivityType =
  | 'INSTAGRAM_SENT'
  | 'LINKEDIN_SENT'
  | 'WHATSAPP_SENT'
  | 'EMAIL_SENT'
  | 'CALLED'
  | 'VISITED'
  | 'MEETING'
  | 'REPLIED'
  | 'FOLLOW_UP'
  | 'NOTE';

export interface SellerProfileChecklist {
  instagramBioClear?: boolean;
  instagramHasProof?: boolean;
  instagramHasHighlights?: boolean;
  linkedinHeadlineClear?: boolean;
  linkedinHasOffer?: boolean;
  linkedinHasPortfolio?: boolean;
  hasCalendarLink?: boolean;
  hasSavedReplies?: boolean;
}

export interface Seller {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  instagram?: string;
  linkedin?: string;
  city?: string;
  role?: string;
  status: SellerStatus;
  profileChecklist?: SellerProfileChecklist;
  salesPlaybook?: unknown;
  notes?: string;
  dailyTarget?: number;
  weeklyVisitTarget?: number;
  createdAt: string;
  updatedAt: string;
  leads?: Lead[];
  activities?: SellerActivity[];
  _count?: {
    leads: number;
    activities: number;
  };
}

export interface SellerActivity {
  id: string;
  sellerId: string;
  leadId?: string;
  type: SellerActivityType;
  channel?: string;
  note?: string;
  outcome?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  occurredAt: string;
  nextFollowUpAt?: string;
  seller?: Pick<Seller, 'id' | 'name'>;
  lead?: Pick<Lead, 'id' | 'name' | 'city' | 'category' | 'googleMapsUrl'>;
}

export interface SellerStats {
  total: number;
  active: number;
  training: number;
  assignedLeads: number;
  contactedLeads: number;
  totalActivities: number;
  contacts: number;
  visits: number;
  meetings: number;
  bySeller: Seller[];
  recentActivities: SellerActivity[];
}

export const SELLER_STATUS_LABELS: Record<SellerStatus, string> = {
  TRAINING: 'En entrenamiento',
  ACTIVE: 'Activo',
  PAUSED: 'Pausado',
  INACTIVE: 'Inactivo',
};

export const SELLER_ACTIVITY_LABELS: Record<SellerActivityType, string> = {
  INSTAGRAM_SENT: 'Mensaje Instagram',
  LINKEDIN_SENT: 'Mensaje LinkedIn',
  WHATSAPP_SENT: 'WhatsApp',
  EMAIL_SENT: 'Email',
  CALLED: 'Llamada',
  VISITED: 'Visita fisica',
  MEETING: 'Reunion',
  REPLIED: 'Respondio',
  FOLLOW_UP: 'Follow-up',
  NOTE: 'Nota',
};

export const PROFILE_CHECKLIST_LABELS: Array<{ key: keyof SellerProfileChecklist; label: string }> = [
  { key: 'instagramBioClear', label: 'Bio de Instagram dice que ayuda a negocios a vender mas' },
  { key: 'instagramHasProof', label: 'Tiene pruebas: casos, antes/despues, screenshots o resultados' },
  { key: 'instagramHasHighlights', label: 'Destacadas: servicios, trabajos, testimonios y contacto' },
  { key: 'linkedinHeadlineClear', label: 'LinkedIn explica rol y propuesta en una linea' },
  { key: 'linkedinHasOffer', label: 'LinkedIn muestra oferta: web, marketing, automatizacion' },
  { key: 'linkedinHasPortfolio', label: 'Tiene links a Rakium, Lautaro Vulcano y trabajos reales' },
  { key: 'hasCalendarLink', label: 'Tiene link o proceso claro para agendar llamada' },
  { key: 'hasSavedReplies', label: 'Tiene respuestas guardadas para objeciones frecuentes' },
];

export const SALES_GUIDES = [
  {
    title: 'Rutina diaria',
    items: [
      'Elegir 30 leads por ciudad o rubro antes de escribir.',
      'Revisar web, Instagram, Google Maps y WhatsApp antes del mensaje.',
      'Mandar 20 mensajes personalizados y registrar cada envio.',
      'Agendar 5 follow-ups para 48 horas despues.',
      'Cerrar el dia mirando respuestas, reuniones y proximas visitas.',
    ],
  },
  {
    title: 'Primer mensaje por Instagram',
    items: [
      'Abrir con algo concreto del negocio, no con un saludo generico.',
      'Mencionar una oportunidad visible: falta de web, link flojo, carta confusa o Instagram sin conversion.',
      'Pedir permiso para mandar una idea corta, no vender todo en el primer mensaje.',
      'Usar tono humano: corto, local y directo.',
    ],
  },
  {
    title: 'Visita fisica',
    items: [
      'Entrar como consultor, no como vendedor desesperado.',
      'Preguntar quien maneja redes, web y consultas de WhatsApp.',
      'Detectar perdida de oportunidades: reservas, turnos, catalogo, presupuestos.',
      'Salir con nombre del decisor, mejor canal y proximo paso concreto.',
    ],
  },
  {
    title: 'Objeciones',
    items: [
      'Es caro: responder con una mejora chica medible antes de hablar de proyecto grande.',
      'Ya tengo Instagram: separar presencia de conversion, y mostrar que falta un camino claro a consulta.',
      'No tengo tiempo: ofrecer diagnostico corto y propuesta de una pagina.',
      'Lo veo despues: dejar follow-up pactado con fecha.',
    ],
  },
];

export const MESSAGE_EXAMPLES = [
  {
    title: 'Negocio sin web',
    channel: 'Instagram',
    text:
      'Hola {{negocio}}, como va? Vi que tienen buena presencia local, pero no encontre una web clara para consultas. En Rakium armamos paginas simples con WhatsApp y medicion para que no dependan solo de Instagram. Te puedo mandar una idea puntual?',
  },
  {
    title: 'Restaurante o cafeteria',
    channel: 'Instagram',
    text:
      'Hola! Vi {{negocio}} y pense que podrian vender mejor con una carta online prolija, link a reservas/pedidos y campanas locales. Si queres te mando una mini propuesta con 2 mejoras concretas.',
  },
  {
    title: 'Estetica, turnos o salud',
    channel: 'WhatsApp',
    text:
      'Hola, soy de Rakium. Vi {{negocio}} y creo que podemos ayudarles a ordenar consultas con una landing, turnos por WhatsApp y contenido para captar pacientes/clientes. Te puedo compartir un ejemplo corto?',
  },
  {
    title: 'LinkedIn B2B',
    channel: 'LinkedIn',
    text:
      'Hola {{nombre}}, vi el trabajo de {{negocio}}. Estoy contactando negocios que podrian convertir mas consultas con web + automatizacion simple de contacto. Si te sirve, te paso un diagnostico breve sin compromiso.',
  },
];

export const OBJECTION_GUIDES = [
  {
    objection: 'Ya tenemos Instagram',
    answer:
      'Buenisimo, eso es una base. Lo que buscamos es que Instagram no sea el unico punto de venta: una web simple ordena servicios, WhatsApp, confianza y medicion de consultas.',
  },
  {
    objection: 'No tenemos presupuesto',
    answer:
      'Tiene sentido cuidar caja. Por eso podemos empezar con una version chica: una landing con propuesta clara, contacto y medicion. Si trae consultas, despues se escala.',
  },
  {
    objection: 'Mandame info',
    answer:
      'Dale. Para no mandarte algo generico, te paso 2 mejoras que vi en su caso y un ejemplo de como quedaria el recorrido cliente -> WhatsApp.',
  },
  {
    objection: 'Lo vemos mas adelante',
    answer:
      'Perfecto. Te agendo para retomarlo en unos dias. Mientras tanto te dejo una idea puntual: hoy el cliente que los busca necesita encontrar rapido servicios, precios orientativos o forma de contacto.',
  },
];

export const PROFILE_TEMPLATES = [
  {
    title: 'Bio Instagram',
    text: 'Ayudo a negocios locales a conseguir mas consultas con paginas web, WhatsApp y marketing digital. Equipo Rakium.dev + Lautaro Vulcano.',
  },
  {
    title: 'Destacadas Instagram',
    text: 'Servicios / Trabajos / Testimonios / Antes y despues / Contacto / Preguntas frecuentes.',
  },
  {
    title: 'Titular LinkedIn',
    text: 'Desarrollo comercial en Rakium.dev | Webs, automatizacion y marketing para negocios que quieren vender mas.',
  },
  {
    title: 'Acerca de LinkedIn',
    text: 'Trabajo con negocios que necesitan ordenar su presencia digital: web clara, WhatsApp, captacion de leads y seguimiento comercial. Si queres, reviso tu presencia actual y te paso oportunidades concretas.',
  },
];

export const TRAINING_DOCS = [
  {
    title: 'Como elegir leads del dia',
    body:
      'Priorizar negocios con telefono, Google Maps activo, sin web detectada y rubros donde una pagina mejora conversion: gastronomia, estetica, salud, turismo, inmobiliarias, talleres y servicios profesionales.',
  },
  {
    title: 'Como investigar antes de escribir',
    body:
      'Abrir Maps, revisar fotos, horarios y reseñas. Buscar web e Instagram. Anotar una oportunidad visible: link roto, falta de WhatsApp, catalogo confuso, pocos posteos o propuesta poco clara.',
  },
  {
    title: 'Como medir calidad del contacto',
    body:
      'Un buen contacto tiene nombre del decisor, canal usado, mensaje enviado, respuesta, objecion, proximo paso y fecha. Si falta uno de esos datos, el seguimiento pierde fuerza.',
  },
  {
    title: 'Como cerrar una visita fisica',
    body:
      'La visita no termina al salir del local. Termina cuando queda registrado quien atendio, que dolor tiene, que le prometimos enviar y cuando hacemos follow-up.',
  },
];
