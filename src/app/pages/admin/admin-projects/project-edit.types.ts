export interface ProjectFull {
  id: string;
  name: string;
  type?: string;
  status: string;
  category?: string;
  description?: string;
  longDescription?: string;
  clientId: string;
  client?: { id: string; name: string; email: string };
  coverImageId?: string | null;
  coverImage?: { id: string; url: string } | null;
  gallery?: GalleryItem[];
  videos?: VideoItem[];
  challenge?: string;
  solution?: string;
  country?: string;
  state?: string;
  city?: string;
  area?: string;
  duration?: string;
  date?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  budget?: string;
  invoiceStatus?: string;
  notes?: string;
  githubUrl?: string;
  demoUrl?: string;
  technologies?: string | string[];
  [key: string]: unknown;
}

export interface GalleryItem {
  id: string;
  url: string;
  title?: string;
  description?: string;
  order: number;
}

export interface VideoItem {
  id: string;
  title: string;
  description?: string;
  youtubeUrl: string;
  order: number;
}
