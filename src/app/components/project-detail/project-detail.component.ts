import { Component, inject, computed, OnInit, signal, HostListener } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SafeHtmlPipe } from '../../core/pipes/safe-html.pipe';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-angular';
import { DialogModule } from 'primeng/dialog';
import { ProjectsService, RakiumProject } from '../../core/services/projects.service';
import { HeaderComponent } from '../header/header.component';

const CATEGORY_LABELS: Record<string, string> = {
  ESTACIONES: 'Estaciones',
  TIENDAS: 'Tiendas',
  COMERCIALES: 'Comerciales',
  SITIO_WEB: 'Sitio web',
  'sitio web': 'Sitio web',
  sitioweb: 'Sitio web',
};

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, HeaderComponent, DialogModule, SafeHtmlPipe],
  templateUrl: './project-detail.component.html',
  styles: [
    `
      :host ::ng-deep .p-dialog-no-header .p-dialog-header {
        display: none;
      }
      .prose-content {
        min-width: 0;
        overflow-wrap: break-word;
        word-wrap: break-word;
      }
      .prose-content ::ng-deep p {
        margin-bottom: 1rem;
      }
      .prose-content ::ng-deep p:last-child {
        margin-bottom: 0;
      }
      .prose-content ::ng-deep ul,
      .prose-content ::ng-deep ol {
        margin: 1rem 0;
        padding-left: 1.5rem;
      }
      .prose-content ::ng-deep li {
        margin-bottom: 0.5rem;
      }
      .prose-content ::ng-deep h1,
      .prose-content ::ng-deep h2,
      .prose-content ::ng-deep h3 {
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
        font-weight: 600;
      }
    `,
  ],
})
export class ProjectDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly projectsService = inject(ProjectsService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly viewportScroller = inject(ViewportScroller);

  private readonly id = signal<string | null>(null);
  readonly project = computed<RakiumProject | undefined>(() => {
    const pid = this.id();
    return pid ? this.projectsService.getProjectById(pid) : undefined;
  });

  readonly gallerySorted = computed(() => {
    const p = this.project();
    if (!p?.gallery?.length) return [];
    return [...p.gallery].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  });

  readonly videoUrls = computed(() => {
    const p = this.project();
    const list: string[] = [];
    if (p?.videoUrl) list.push(p.videoUrl);
    if (p?.videos?.length) p.videos.forEach((v) => list.push(v.url));
    return list;
  });

  readonly tags = computed(() => {
    const p = this.project();
    if (!p) return [];
    let t: string[] = [];
    if (p.technologies != null) {
      t = Array.isArray(p.technologies)
        ? p.technologies
        : typeof p.technologies === 'string'
          ? [p.technologies]
          : [];
    }
    if (p.category && !t.includes(p.category)) t = [p.category, ...t];
    return t;
  });

  readonly projectUrl = computed(() => {
    const p = this.project();
    const raw = (p?.demoUrl ?? p?.url ?? '').trim();
    if (!raw) return null;
    // Solo usar URLs absolutas para evitar enlaces a localhost/url
    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
    return null;
  });

  readonly isLoading = this.projectsService.isLoading;
  readonly errorMessage = this.projectsService.errorMessage;

  arrowLeftIcon = ArrowLeft;
  externalLinkIcon = ExternalLink;
  chevronLeftIcon = ChevronLeft;
  chevronRightIcon = ChevronRight;
  closeIcon = X;

  readonly lightboxVisible = signal(false);
  readonly lightboxIndex = signal(0);

  /** Todas las imágenes del proyecto en orden: antes, después, galería. */
  readonly allImages = computed(() => {
    const p = this.project();
    if (!p) return [];
    const list: string[] = [];
    if (p.imageBefore) list.push(p.imageBefore);
    if (p.imageAfter) list.push(p.imageAfter);
    const gallery = this.gallerySorted();
    gallery.forEach((g) => list.push(g.url));
    return list;
  });

  /** Formato que espera PrimeNG Galleria: itemImageSrc y thumbnailImageSrc. */
  readonly galleriaItems = computed(() =>
    this.allImages().map((url) => ({ itemImageSrc: url, thumbnailImageSrc: url }))
  );

  /** URL de la imagen actual para el modal simple. */
  readonly lightboxCurrentUrl = computed(() => {
    const urls = this.allImages();
    const idx = this.lightboxIndex();
    return urls[idx] ?? null;
  });

  /** Índice en allImages donde empieza la galería (después de antes/después). */
  readonly galleryStartIndex = computed(() => {
    const p = this.project();
    if (!p) return 0;
    let idx = 0;
    if (p.imageBefore) idx++;
    if (p.imageAfter) idx++;
    return idx;
  });

  openLightbox(index: number): void {
    this.lightboxIndex.set(index);
    this.lightboxVisible.set(true);
  }

  closeLightbox(): void {
    this.lightboxVisible.set(false);
  }

  lightboxPrev(): void {
    const total = this.allImages().length;
    if (total <= 1) return;
    const idx = this.lightboxIndex();
    this.lightboxIndex.set(idx <= 0 ? total - 1 : idx - 1);
  }

  lightboxNext(): void {
    const total = this.allImages().length;
    if (total <= 1) return;
    const idx = this.lightboxIndex();
    this.lightboxIndex.set(idx >= total - 1 ? 0 : idx + 1);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.lightboxVisible()) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.lightboxPrev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.lightboxNext();
    }
  }

  getCategoryLabel(value: string): string {
    if (!value) return '';
    const normalized = value.trim();
    const exact = CATEGORY_LABELS[normalized];
    if (exact) return exact;
    const upper = normalized.toUpperCase().replace(/\s+/g, '_');
    return CATEGORY_LABELS[upper] ?? normalized;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.id.set(id);
      this.viewportScroller.scrollToPosition([0, 0]);
      if (id && !this.projectsService.getProjectById(id)) {
        this.projectsService.loadProjectById(id);
      }
    });
  }

  isVideoUrl(url: string): boolean {
    return /\.(mp4|webm|ogg)(\?|$)/i.test(url) || url.startsWith('blob:');
  }

  isEmbedUrl(url: string): boolean {
    return /youtube|vimeo|youtu\.be/i.test(url);
  }

  getSafeVideoUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
