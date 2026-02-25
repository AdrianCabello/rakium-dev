import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, Globe, ImageOff } from 'lucide-angular';
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
  imports: [CommonModule, LucideAngularModule, SafeHtmlPipe],
  templateUrl: './projects.component.html',
})
export class ProjectsComponent implements OnInit {
  private readonly projectsService = inject(ProjectsService);
  private readonly router = inject(Router);
  private readonly touchStartByProject = new Map<string, number>();

  readonly projects = this.projectsService.projects;
  readonly isLoading = this.projectsService.isLoading;
  readonly isLoadingMore = this.projectsService.isLoadingMore;
  readonly errorMessage = this.projectsService.errorMessage;
  readonly hasMoreProjects = this.projectsService.hasMoreProjects;
  readonly imageIndexByProject = signal<Record<string, number>>({});

  globeIcon = Globe;

  getImageIndex(projectId: string, imageCount: number): number {
    const current = this.imageIndexByProject()[projectId] ?? 0;
    if (imageCount <= 0) return 0;
    return Math.max(0, Math.min(current, imageCount - 1));
  }

  setImageIndex(projectId: string, index: number, imageCount: number): void {
    if (imageCount <= 0) return;
    const bounded = ((index % imageCount) + imageCount) % imageCount;
    this.imageIndexByProject.update((state) => ({
      ...state,
      [projectId]: bounded,
    }));
  }

  nextImage(projectId: string, imageCount: number): void {
    this.setImageIndex(projectId, this.getImageIndex(projectId, imageCount) + 1, imageCount);
  }

  prevImage(projectId: string, imageCount: number): void {
    this.setImageIndex(projectId, this.getImageIndex(projectId, imageCount) - 1, imageCount);
  }

  onTouchStart(projectId: string, event: TouchEvent): void {
    const startX = event.changedTouches[0]?.clientX;
    if (startX != null) this.touchStartByProject.set(projectId, startX);
  }

  onTouchEnd(projectId: string, imageCount: number, event: TouchEvent): void {
    const startX = this.touchStartByProject.get(projectId);
    const endX = event.changedTouches[0]?.clientX;
    if (startX == null || endX == null) return;
    const deltaX = endX - startX;
    this.touchStartByProject.delete(projectId);
    if (Math.abs(deltaX) < 40) return;
    if (deltaX < 0) {
      this.nextImage(projectId, imageCount);
    } else {
      this.prevImage(projectId, imageCount);
    }
  }

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
