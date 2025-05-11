import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(
    private meta: Meta,
    private title: Title
  ) { }

  updateMetadata(data: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
  }) {
    const title = data.title ? `${data.title} | Rakium` : 'Rakium - Soluciones Web Profesionales';
    const description = data.description || 'Creamos sitios web y aplicaciones que destacan tu marca, conectan con tu audiencia y potencian tu presencia digital.';
    const image = data.image || 'https://adriancabello.github.io/rakium-dev/assets/images/og-image.jpg';
    const url = data.url || 'https://adriancabello.github.io/rakium-dev';
    const type = data.type || 'website';

    // Actualizar título
    this.title.setTitle(title);

    // Actualizar metadatos
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: type });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
  }
} 