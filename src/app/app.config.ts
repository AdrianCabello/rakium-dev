import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import { RakiumPreset } from './core/config/primeng-rakium.theme';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    provideClientHydration(withEventReplay()),
    providePrimeNG({
      theme: {
        preset: RakiumPreset,
      },
      ripple: true,
    }),
    {
      provide: FaIconLibrary,
      useFactory: () => {
        const library = new FaIconLibrary();
        library.addIconPacks(fas, fab);
        return library;
      }
    }
  ]
};
