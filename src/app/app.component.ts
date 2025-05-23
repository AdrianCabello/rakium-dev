import { Component, OnInit, HostListener } from '@angular/core';

import { HeroComponent } from './components/hero/hero.component';
import { ServicesComponent } from './components/services/services.component';
import { SolutionsComponent } from './components/solutions/solutions.component';
import { ContactComponent } from './components/contact/contact.component';
import { SeoService } from './core/services/seo.service';
import { HeaderComponent } from './components/header/header.component';
import { LucideAngularModule } from 'lucide-angular';
import { ProjectsComponent } from './components/projects-section/projects.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    ServicesComponent,
    SolutionsComponent,
    ProjectsComponent,
    ContactComponent,
    LucideAngularModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'rakium-dev';

  constructor(private seoService: SeoService) { }

  ngOnInit() {
    // Configurar metadatos para la página principal
    this.seoService.updateMetadata({
      title: 'Inicio',
      description: 'Creamos sitios web y aplicaciones que destacan tu marca, conectan con tu audiencia y potencian tu presencia digital.',
      url: 'https://adriancabello.github.io/rakium-dev/'
    });
  }


}
