export interface SiteContact {
  whatsappNumber: string;
  whatsappMessage?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface SocialNetwork {
  id: string;
  name: string;
  url: string;
  icon: string; // nombre del icono Lucide: 'instagram', 'linkedin', 'twitter', etc.
}

export interface SiteService {
  id: string;
  title: string;
  subtitle: string;
  icon: string; // nombre del icono Lucide
  description: string;
  precioEstatico: string;
  precioAutogestionable: string;
  idealFor: string[];
  incluye: string[];
  incluyeWithBackend?: string[];
  order: number;
}

export interface SiteSettings {
  contact: SiteContact;
  about: string; // Sobre mí (HTML permitido)
  description: string; // Descripción corta para hero, SEO
  services: SiteService[];
  socialNetworks: SocialNetwork[];
}
