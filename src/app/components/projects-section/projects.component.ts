import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, Globe, ImageOff } from 'lucide-angular';
import { GalleriaModule } from 'primeng/galleria';
import { ProjectsService } from '../../core/services/projects.service';
import { SafeHtmlPipe } from '../../core/pipes/safe-html.pipe';

const CATEGORY_LABELS: Record<string, string> = {
  ESTACIONES: 'Estaciones',
  TIENDAS: 'Tiendas',
  COMERCIALES: 'Comerciales',
  SITIO_WEB: 'Sitio web',
};

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, GalleriaModule, SafeHtmlPipe],
  templateUrl: './projects.component.html',
})
export class ProjectsComponent implements OnInit {
  private readonly projectsService = inject(ProjectsService);
  private readonly router = inject(Router);

  readonly projects = this.projectsService.projects;
  readonly isLoading = this.projectsService.isLoading;
  readonly isLoadingMore = this.projectsService.isLoadingMore;
  readonly errorMessage = this.projectsService.errorMessage;
  readonly hasMoreProjects = this.projectsService.hasMoreProjects;

  globeIcon = Globe;

  /** Convierte las URLs del proyecto al formato que Galleria espera */
  getGalleriaImages(project: { images: string[] }): { itemImageSrc: string; thumbnailImageSrc: string }[] {
    return (project.images || []).map((url) => ({ itemImageSrc: url, thumbnailImageSrc: url }));
  }

  /** Opciones responsivas para Galleria (basado en ejemplo PrimeNG) */
  readonly responsiveOptions = [
    { breakpoint: '1024px', numVisible: 5 },
    { breakpoint: '768px', numVisible: 3 },
    { breakpoint: '560px', numVisible: 1 },
  ];
  imageOffIcon = ImageOff;

  /** Etiqueta legible para categoría/type (ej. SITIO_WEB → "Sitio web"). */
  getCategoryLabel(value: string): string {
    return CATEGORY_LABELS[value] ?? value;
  }

  ngOnInit(): void {
    this.projectsService.loadClientProjects();
  }

  loadMore(): void {
    this.projectsService.loadMoreProjects();
  }

  goToProject(id: string): void {
    this.router.navigate(['/proyecto', id]);
  }
}
