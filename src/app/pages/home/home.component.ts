import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { PlansSolutionsComponent } from '../../components/plans-solutions/plans-solutions.component';
import { ProjectsComponent } from '../../components/projects-section/projects.component';
import { ContactComponent } from '../../components/contact/contact.component';
import { SeoService } from '../../core/services/seo.service';
import { EventloopSectionComponent } from '../../components/eventloop-section/eventloop-section.component';
import { ProcessSectionComponent } from '../../components/process-section/process-section.component';
import { FaqSectionComponent } from '../../components/faq-section/faq-section.component';
import { WhatWeDoSectionComponent } from '../../components/what-we-do-section/what-we-do-section.component';
import { WhyRakiumSectionComponent } from '../../components/why-rakium-section/why-rakium-section.component';
import { TeamSectionComponent } from '../../components/team-section/team-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    WhatWeDoSectionComponent,
    WhyRakiumSectionComponent,
    EventloopSectionComponent,
    ProjectsComponent,
    PlansSolutionsComponent,
    ProcessSectionComponent,
    TeamSectionComponent,
    FaqSectionComponent,
    ContactComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, AfterViewInit {
  private readonly seoService = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  private readonly viewportScroller = inject(ViewportScroller);

  ngOnInit() {
    this.seoService.updateMetadata({
      title: 'Rakium - Estudio de producto digital',
      description: 'Diseñamos y construimos productos digitales con criterio, estrategia, diseño y desarrollo para proyectos que necesitan soluciones reales.',
    });
  }

  ngAfterViewInit(): void {
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        setTimeout(() => this.viewportScroller.scrollToAnchor(fragment), 100);
      }
    });
  }
}
