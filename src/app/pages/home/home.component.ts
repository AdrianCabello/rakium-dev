import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { ServicesComponent } from '../../components/services/services.component';
import { SolutionsComponent } from '../../components/solutions/solutions.component';
import { ProjectsComponent } from '../../components/projects-section/projects.component';
import { ContactComponent } from '../../components/contact/contact.component';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    ServicesComponent,
    SolutionsComponent,
    ProjectsComponent,
    ContactComponent,
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 transition-colors duration-300 font-sans antialiased">
      <app-header></app-header>
      <main class="flex-1 w-full">
        <app-hero></app-hero>
        <app-services></app-services>
        <app-solutions></app-solutions>
        <app-projects></app-projects>
        <app-contact></app-contact>
        <div class="py-6 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800">
          <div class="container mx-auto px-4">
            <div class="text-center text-sm text-zinc-600 dark:text-zinc-400">
              © 2025 Rakium. All rights reserved.
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [],
})
export class HomeComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  ngOnInit() {
    this.seoService.updateMetadata({
      title: 'Rakium - Soluciones Web Profesionales',
      description: 'Creamos sitios web y aplicaciones que destacan tu marca, conectan con tu audiencia y potencian tu presencia digital.',
    });
  }
}
