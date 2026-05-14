import { Component, OnInit, computed, inject, signal } from '@angular/core';
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

  readonly projects = computed(() =>
    this.projectsService.projects().filter((project) => !/eventloop/i.test(project.title))
  );
  readonly showFallbackProjects = computed(() =>
    !this.isLoading() && (Boolean(this.errorMessage()) || this.projects().length === 0)
  );
  readonly isLoading = this.projectsService.isLoading;
  readonly isLoadingMore = this.projectsService.isLoadingMore;
  readonly errorMessage = this.projectsService.errorMessage;
  readonly hasMoreProjects = this.projectsService.hasMoreProjects;
  readonly imageIndexByProject = signal<Record<string, number>>({});

  globeIcon = Globe;
  fallbackProjects = [
    {
      title: 'Kamak',
      type: 'Web institucional',
      description: 'Una presencia digital clara para presentar marca, servicios y canales de contacto.',
      image: '/assets/clients/necotec/1.png',
      url: '#',
    },
    {
      title: 'Adrian Cabello',
      type: 'Portfolio profesional',
      description: 'Portfolio personal orientado a mostrar experiencia, proyectos y perfil profesional.',
      image: '/assets/clients/jc-cosmetology/1.png',
      url: '#',
    },
    {
      title: 'Lautaro Vulcano',
      type: 'Portfolio creativo',
      description: 'Sitio visual para ordenar obra, identidad y comunicacion de un proyecto creativo.',
      image: '/assets/clients/lautaro-vulcano-portfolio/1.png',
      url: '#',
    },
  ];

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

  /** Etiqueta legible para category/type (ej. SITIO_WEB -> "Sitio web"). */
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
