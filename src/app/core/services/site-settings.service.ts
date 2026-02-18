import { Injectable, signal, computed } from '@angular/core';
import { DEFAULT_SITE_SETTINGS } from '../config/site-settings.defaults';
import type { SiteSettings } from '../config/site-settings.types';

const STORAGE_KEY = 'rakium-site-settings';

@Injectable({ providedIn: 'root' })
export class SiteSettingsService {
  private readonly raw = signal<SiteSettings>(this.load());

  readonly settings = this.raw.asReadonly();
  readonly contact = computed(() => this.raw().contact);
  readonly about = computed(() => this.raw().about);
  readonly description = computed(() => this.raw().description);
  readonly services = computed(() => [...this.raw().services].sort((a, b) => a.order - b.order));
  readonly socialNetworks = computed(() => this.raw().socialNetworks);

  readonly whatsappUrl = computed(() => {
    const c = this.raw().contact;
    const num = (c.whatsappNumber || '').replace(/\D/g, '');
    const msg = encodeURIComponent(c.whatsappMessage || '');
    return `https://wa.me/${num}${msg ? `?text=${msg}` : ''}`;
  });

  private load(): SiteSettings {
    if (typeof window === 'undefined') return DEFAULT_SITE_SETTINGS;
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) {
        const parsed = JSON.parse(s) as Partial<SiteSettings>;
        return this.mergeWithDefaults(parsed);
      }
    } catch {
      // ignore
    }
    return { ...this.deepClone(DEFAULT_SITE_SETTINGS) };
  }

  private mergeWithDefaults(partial: Partial<SiteSettings>): SiteSettings {
    const def = this.deepClone(DEFAULT_SITE_SETTINGS);
    return {
      contact: { ...def.contact, ...partial.contact },
      about: partial.about ?? def.about,
      description: partial.description ?? def.description,
      services: partial.services?.length ? partial.services : def.services,
      socialNetworks: partial.socialNetworks?.length ? partial.socialNetworks : def.socialNetworks,
    };
  }

  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  save(settings: Partial<SiteSettings>): void {
    const current = this.raw();
    const next = this.mergeWithDefaults({ ...current, ...settings });
    this.raw.set(next);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
    }
  }

  reset(): void {
    this.save(this.deepClone(DEFAULT_SITE_SETTINGS));
  }
}
