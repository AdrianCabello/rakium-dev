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
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
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
