import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, Globe, ImageOff } from 'lucide-angular';
import { ProjectsService } from '../../core/services/projects.service';

const CATEGORY_LABELS: Record<string, string> = {
  ESTACIONES: 'Estaciones',
  TIENDAS: 'Tiendas',
  COMERCIALES: 'Comerciales',
  SITIO_WEB: 'Sitio web',
};

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
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

  currentImageIndex = signal<Record<string, number>>({});

  globeIcon = Globe;
  imageOffIcon = ImageOff;

  /** Etiqueta legible para categoría/type (ej. SITIO_WEB → "Sitio web"). */
  getCategoryLabel(value: string): string {
    return CATEGORY_LABELS[value] ?? value;
  }

  /** Índice actual de imagen para un proyecto (0 en primera carga). */
  getImageIndex(projectId: string): number {
    return this.currentImageIndex()[projectId] ?? 0;
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

  prevImage(projectId: string, event: Event): void {
    event.stopPropagation();
    const list = this.projects().find((p) => p.id === projectId);
    if (!list) return;
    const total = list.images.length;
    if (total <= 1) return;
    this.currentImageIndex.update((idx) => {
      const key = String(projectId);
      const next = (idx[key] ?? 0) - 1 + total;
      return { ...idx, [key]: next % total };
    });
  }

  nextImage(projectId: string, event: Event): void {
    event.stopPropagation();
    const list = this.projects().find((p) => p.id === projectId);
    if (!list) return;
    const total = list.images.length;
    if (total <= 1) return;
    this.currentImageIndex.update((idx) => {
      const key = String(projectId);
      const next = (idx[key] ?? 0) + 1;
      return { ...idx, [key]: next % total };
    });
  }

  goToImage(projectId: string, index: number, event: Event): void {
    event.stopPropagation();
    this.currentImageIndex.update((idx) => ({ ...idx, [String(projectId)]: index }));
  }
}
