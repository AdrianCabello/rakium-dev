import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteSettingsService } from '../../core/services/site-settings.service';
import { SafeHtmlPipe } from '../../core/pipes/safe-html.pipe';

@Component({
  selector: 'app-sobre-nosotros',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    @if (about()) {
      <section id="sobre-nosotros" class="w-full py-16 bg-zinc-50 dark:bg-zinc-900/50 transition-colors duration-300">
        <div class="container mx-auto px-4">
          <div class="max-w-3xl mx-auto">
            <h2 class="text-3xl font-bold text-zinc-900 dark:text-white mb-6">Sobre nosotros</h2>
            <div
              class="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 [&_p]:mb-4 [&_ul]:mb-4 [&_ol]:mb-4"
              [innerHTML]="about() | safeHtml"
            ></div>
          </div>
        </div>
      </section>
    }
  `,
})
export class SobreNosotrosComponent {
  readonly siteSettings = inject(SiteSettingsService);
  readonly about = this.siteSettings.about;
}
