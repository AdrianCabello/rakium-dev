import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const MEASUREMENT_ID = 'G-51XJCMK5W4';

@Injectable({ providedIn: 'root' })
export class GoogleAnalyticsService {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.initRouteTracking();
    }
  }

  private initRouteTracking(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.pageView(event.urlAfterRedirects);
      });
  }

  pageView(path: string): void {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('config', MEASUREMENT_ID, {
        page_path: path,
      });
    }
  }

  event(eventName: string, params?: Record<string, unknown>): void {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  }
}
