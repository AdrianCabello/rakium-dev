export type LeadStatus = 'NEW' | 'QUALIFIED' | 'CONTACTED' | 'REPLIED' | 'MEETING' | 'WON' | 'LOST' | 'ARCHIVED';
export type LeadActivityType = 'NOTE' | 'INSTAGRAM_SENT' | 'WHATSAPP_SENT' | 'EMAIL_SENT' | 'CALLED' | 'REPLIED' | 'FOLLOW_UP' | 'STATUS_CHANGE';
export type LeadContactFilter = 'any' | 'instagram' | 'email' | 'phone';

export interface LeadActivity {
  id: string;
  type: LeadActivityType;
  note?: string;
  channel?: string;
  createdAt: string;
  scheduledAt?: string;
}

export interface Lead {
  id: string;
  name: string;
  city: string;
  category?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  googleMapsUrl?: string;
  digitalPresenceScore: number;
  needsWebsite: boolean;
  priority: number;
  status: LeadStatus;
  assignedTo?: string;
  tags?: string[];
  checklist?: LeadChecklist;
  estimatedValue?: number;
  suggestedMessage?: string;
  convertedClientId?: string;
  notes?: string;
  lastContactedAt?: string;
  nextFollowUpAt?: string;
  activities?: LeadActivity[];
}

export interface LeadChecklist {
  hasWebsite?: boolean;
  websiteLooksOld?: boolean;
  hasInstagram?: boolean;
  instagramLooksWeak?: boolean;
  hasWhatsapp?: boolean;
  hasClearOffer?: boolean;
  hasRecentPosts?: boolean;
  needsAds?: boolean;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface LeadStats {
  total: number;
  needsWebsite: number;
  byCity: Array<{ city: string; total: number }>;
  byCategory: Array<{ category: string; total: number }>;
  byStatus: Array<{ status: LeadStatus; total: number }>;
  mapLeads: Lead[];
}

export const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: 'Nuevo',
  QUALIFIED: 'Calificado',
  CONTACTED: 'Contactado',
  REPLIED: 'Respondio',
  MEETING: 'Reunion',
  WON: 'Ganado',
  LOST: 'Perdido',
  ARCHIVED: 'Archivado',
};

export const PIPELINE: LeadStatus[] = ['NEW', 'QUALIFIED', 'CONTACTED', 'REPLIED', 'MEETING', 'WON', 'LOST'];

export const CHECKLIST_LABELS: Array<{ key: keyof LeadChecklist; label: string }> = [
  { key: 'hasWebsite', label: 'Tiene web' },
  { key: 'websiteLooksOld', label: 'Web vieja o floja' },
  { key: 'hasInstagram', label: 'Tiene Instagram' },
  { key: 'instagramLooksWeak', label: 'Instagram flojo' },
  { key: 'hasWhatsapp', label: 'WhatsApp claro' },
  { key: 'hasClearOffer', label: 'Oferta clara' },
  { key: 'hasRecentPosts', label: 'Publica seguido' },
  { key: 'needsAds', label: 'Necesita pauta' },
];

export const MESSAGE_TEMPLATES: Record<string, string> = {
  default:
    'Hola {{name}}, como va? Soy de Rakium. Estuvimos viendo {{business}} en {{city}} y creemos que podriamos ayudarlos a conseguir mas consultas con una web simple, WhatsApp bien armado y campanas de Instagram. Te puedo mandar una idea corta?',
  gastronomia:
    'Hola {{name}}, como va? Soy de Rakium. Vi {{business}} y pense que una carta/link claro con WhatsApp + campanas locales podria traerles mas reservas y pedidos. Te puedo mandar una idea concreta?',
  estetica:
    'Hola {{name}}, como va? Soy de Rakium. Vi {{business}} y creo que con una landing prolija, turnos por WhatsApp y contenido/pauta local podrian captar mas consultas. Te puedo mandar una propuesta corta?',
  inmobiliaria:
    'Hola {{name}}, como va? Soy de Rakium. Vi {{business}} y queria mostrarte una idea para mejorar captacion de consultas con web, propiedades destacadas y pauta local. Te la puedo pasar?',
  turismo:
    'Hola {{name}}, como va? Soy de Rakium. Vi {{business}} y creo que podemos ayudarlos a vender mejor la experiencia con web, redes y anuncios segmentados para turistas. Te puedo mandar una idea?',
};

export function messageForLead(lead: Lead): string {
  if (lead.suggestedMessage) return lead.suggestedMessage;
  const category = (lead.category || '').toLowerCase();
  const key =
    category.includes('cafe') || category.includes('restaurant') || category.includes('bar')
      ? 'gastronomia'
      : category.includes('estet')
        ? 'estetica'
        : category.includes('inmob')
          ? 'inmobiliaria'
          : category.includes('tur')
            ? 'turismo'
            : 'default';
  return MESSAGE_TEMPLATES[key]
    .replaceAll('{{name}}', lead.name)
    .replaceAll('{{business}}', lead.name)
    .replaceAll('{{city}}', lead.city);
}

export function normalizeUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export function normalizeInstagram(value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  const handle = value.replace(/^@/, '');
  return `https://www.instagram.com/${handle}`;
}

export function dateInputValue(value?: string): string {
  return value ? value.slice(0, 10) : '';
}

export function dateToIso(value: string): string | undefined {
  return value ? new Date(`${value}T12:00:00`).toISOString() : undefined;
}

export function toNumber(value: string | number | null): number | undefined {
  if (value === null || value === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
