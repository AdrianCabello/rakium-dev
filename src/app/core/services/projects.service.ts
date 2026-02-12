import { Injectable, signal, computed } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from './api.service';
import { RAKIUM_CLIENT_ID } from '../config/rakium.config';

const PAGE_SIZE = 9;

/** Proyecto tal como lo devuelve rakium-be (public por cliente). */
export interface RakiumProject {
  id: string;
  name: string;
  status?: string;
  description?: string | null;
  longDescription?: string | null;
  imageBefore?: string | null;
  imageAfter?: string | null;
  coverImage?: { id: string; url: string } | null;
  url?: string | null;
  demoUrl?: string | null;
  technologies?: string | string[] | null;
  category?: string | null;
  gallery?: { id: string; url: string; order: number }[];
  videoUrl?: string | null;
  videos?: { id: string; url: string; title?: string }[] | null;
}

export interface RakiumProjectsResponse {
  data: RakiumProject[];
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

/** Proyecto para la vista de lista (Casos de Éxito). */
export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  url: string;
  images: string[];
  type: string;
}

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private readonly loading = signal(false);
  private readonly loadingMore = signal(false);
  private readonly error = signal<string | null>(null);
  private readonly rawProjects = signal<RakiumProject[]>([]);
  private readonly hasMore = signal(true);
  private readonly currentPage = signal(0);

  readonly projects = computed<PortfolioProject[]>(() =>
    this.rawProjects().map((p) => this.mapToPortfolio(p))
  );
  readonly isLoading = this.loading.asReadonly();
  readonly isLoadingMore = this.loadingMore.asReadonly();
  readonly errorMessage = this.error.asReadonly();
  readonly hasMoreProjects = this.hasMore.asReadonly();

  /** Obtiene el proyecto completo por id (desde la lista ya cargada). */
  getProjectById(id: string): RakiumProject | undefined {
    return this.rawProjects().find((p) => p.id === id);
  }

  constructor(private api: ApiService) {}

  /**
   * Carga un solo proyecto por ID (endpoint público published).
   * Útil cuando se abre directamente la URL /proyecto/:id y el proyecto no está en la primera página.
   */
  loadProjectById(id: string): void {
    if (this.getProjectById(id)) return;
    this.loading.set(true);
    this.error.set(null);
    this.api
      .get<RakiumProject>(`projects/${id}/published`)
      .pipe(
        tap((project) => {
          this.rawProjects.update((prev) => {
            const i = prev.findIndex((p) => p.id === project.id);
            if (i >= 0) {
              const next = [...prev];
              next[i] = project;
              return next;
            }
            return [...prev, project];
          });
        }),
        catchError((err) => {
          this.error.set(err?.error?.message ?? err?.message ?? 'Error al cargar el proyecto');
          return of(null);
        })
      )
      .subscribe(() => this.loading.set(false));
  }

  loadClientProjects(): void {
    this.loading.set(true);
    this.error.set(null);
    this.currentPage.set(0);
    this.hasMore.set(true);
    this.fetchPage(1, (projects) => {
      this.rawProjects.set(projects);
      this.currentPage.set(1);
      this.loading.set(false);
    });
  }

  loadMoreProjects(): void {
    if (this.loadingMore() || !this.hasMore()) return;
    const nextPage = this.currentPage() + 1;
    this.loadingMore.set(true);
    this.fetchPage(nextPage, (newProjects) => {
      this.rawProjects.update((prev) => [...prev, ...newProjects]);
      this.currentPage.set(nextPage);
      this.loadingMore.set(false);
    });
  }

  private fetchPage(
    page: number,
    onSuccess: (projects: RakiumProject[]) => void
  ): void {
    this.api
      .get<RakiumProjectsResponse | RakiumProject[]>(`projects/client/${RAKIUM_CLIENT_ID}/public`, {
        page,
        limit: PAGE_SIZE,
      })
      .pipe(
        map((response) => {
          let projects: RakiumProject[] = [];
          let hasNext: boolean | undefined;
          if (response && !Array.isArray(response) && Array.isArray((response as RakiumProjectsResponse).data)) {
            const res = response as RakiumProjectsResponse;
            projects = res.data;
            hasNext = res.hasNext;
          } else if (Array.isArray(response)) {
            projects = response;
            hasNext = projects.length >= PAGE_SIZE;
          } else if (response && Array.isArray((response as unknown as { projects?: RakiumProject[] }).projects)) {
            const res = response as unknown as { projects: RakiumProject[]; hasNext?: boolean };
            projects = res.projects;
            hasNext = res.hasNext;
          }
          const filtered = projects.filter((p: RakiumProject) => p.status === 'PUBLISHED' || !p.status);
          this.hasMore.set(hasNext === true || (hasNext !== false && filtered.length >= PAGE_SIZE));
          return filtered;
        }),
        tap(onSuccess),
        catchError((err) => {
          this.loading.set(false);
          this.loadingMore.set(false);
          this.error.set(err?.message ?? 'Error al cargar proyectos');
          if (this.currentPage() === 0) this.rawProjects.set([]);
          return of([]);
        })
      )
      .subscribe();
  }

  private mapToPortfolio(p: RakiumProject): PortfolioProject {
    const coverUrl = p.coverImage?.url ?? p.imageAfter ?? p.imageBefore ?? null;
    const galleryUrls = (p.gallery ?? []).map((g) => g.url).filter(Boolean);
    const images = coverUrl
      ? [coverUrl, ...galleryUrls.filter((u) => u !== coverUrl)]
      : galleryUrls;
    const image = images[0] ?? '';
    const description =
      (p.description ?? p.longDescription ?? '').trim() || 'Sin descripción';
    let tags: string[] = [];
    if (p.technologies != null) {
      tags = Array.isArray(p.technologies)
        ? p.technologies
        : typeof p.technologies === 'string'
          ? [p.technologies]
          : [];
    }
    if (p.category && !tags.includes(p.category)) {
      tags = [p.category, ...tags];
    }
    const url = (p.demoUrl ?? p.url ?? '').trim() || '#';
    return {
      id: p.id,
      title: p.name,
      description,
      image,
      tags,
      url,
      images,
      type: p.category ?? '',
    };
  }
}
