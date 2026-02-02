import { Component, input, output, inject, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../../../core/services/api.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import type { GalleryItem } from '../project-edit.types';

@Component({
  selector: 'app-project-gallery-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    DialogModule,
    TooltipModule,
  ],
  providers: [ConfirmationService, MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-toast />
    <p-confirmDialog />
    <h2 class="gallery-heading">
      <i class="pi pi-images"></i>
      Galería de fotos
    </h2>

    <div class="gallery-grid">
      @for (item of gallery(); track item.id) {
        <div class="gallery-item">
          <div class="gallery-image-wrap" (click)="openImage(item)">
            <img [src]="item.url" [alt]="item.title || 'Imagen'" loading="lazy" />
            <div class="gallery-image-overlay">
              <i class="pi pi-search-plus"></i>
              <span>Ver</span>
            </div>
            <div class="gallery-actions">
              <p-button icon="pi pi-eye" [rounded]="true" [text]="true" severity="secondary" size="small" (onClick)="openImage(item); $event.stopPropagation()" pTooltip="Ver imagen" />
              <p-button icon="pi pi-trash" [rounded]="true" [text]="true" severity="danger" size="small" (onClick)="confirmDelete(item); $event.stopPropagation()" pTooltip="Eliminar" />
            </div>
          </div>
          @if (item.title) {
            <p class="gallery-caption">{{ item.title }}</p>
          }
        </div>
      }
    </div>

    <div class="gallery-upload">
      <input
        #fileInput
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        (change)="onFileSelected($event)"
        class="file-input-hidden"
      />
      <p-button
        type="button"
        label="Subir imagen"
        icon="pi pi-upload"
        (onClick)="fileInput.click()"
        [loading]="uploading()"
        [disabled]="uploading()"
      />
      <span class="gallery-upload-hint">Máx. 10 imágenes. JPEG, PNG, GIF, WebP.</span>
    </div>

    <p-dialog
      [visible]="lightboxVisible()"
      (visibleChange)="setLightboxVisible($event)"
      [modal]="true"
      [closable]="true"
      (onHide)="setLightboxVisible(false)"
      styleClass="gallery-lightbox"
      [contentStyle]="{ padding: '0', overflow: 'hidden' }"
      [showHeader]="false"
    >
      @if (lightboxImage()) {
        <img [src]="lightboxImage()!.url" [alt]="lightboxImage()!.title || 'Imagen'" class="lightbox-img" />
        @if (lightboxImage()!.title) {
          <p class="lightbox-caption">{{ lightboxImage()!.title }}</p>
        }
      }
    </p-dialog>
  `,
  styles: [`
    :host { display: block; }
    .gallery-heading {
      margin: 0 0 1rem 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--p-text-color);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 1rem;
      margin-bottom: 1.25rem;
    }
    .gallery-item {
      border-radius: 8px;
      overflow: hidden;
      background: rgba(0,0,0,0.2);
    }
    .gallery-image-wrap {
      position: relative;
      aspect-ratio: 4/3;
      background: #1a1a1a;
      cursor: pointer;
      overflow: hidden;
    }
    .gallery-image-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.2s;
    }
    .gallery-image-wrap:hover img { transform: scale(1.03); }
    .gallery-image-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.4);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      opacity: 0;
      transition: opacity 0.2s;
      color: white;
      font-size: 0.875rem;
    }
    .gallery-image-overlay i { font-size: 1.5rem; }
    .gallery-image-wrap:hover .gallery-image-overlay { opacity: 1; }
    .gallery-actions {
      position: absolute;
      bottom: 0.5rem;
      right: 0.5rem;
      display: flex;
      gap: 0.25rem;
      align-items: center;
      opacity: 0;
      transition: opacity 0.2s;
    }
    .gallery-image-wrap:hover .gallery-actions { opacity: 1; }
    .gallery-caption {
      margin: 0.5rem 0 0 0;
      font-size: 0.8125rem;
      color: var(--p-text-muted-color);
      padding: 0 0.25rem;
    }
    .gallery-upload {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem;
    }
    .gallery-upload-hint {
      font-size: 0.8125rem;
      color: var(--p-text-muted-color);
    }
    .file-input-hidden { display: none; }
    :host ::ng-deep .gallery-lightbox {
      max-width: 90vw;
      width: auto;
    }
    :host ::ng-deep .gallery-lightbox .p-dialog-content {
      padding: 0;
      overflow: hidden;
    }
    .lightbox-img {
      max-width: 100%;
      max-height: 85vh;
      width: auto;
      height: auto;
      display: block;
    }
    .lightbox-caption {
      margin: 0;
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      color: var(--p-text-muted-color);
      text-align: center;
    }
  `],
})
export class ProjectGalleryEditorComponent {
  projectId = input.required<string>();
  gallery = input.required<GalleryItem[]>();
  updated = output<void>();

  private readonly api = inject(ApiService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly message = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly uploading = signal(false);
  readonly lightboxVisible = signal(false);
  readonly lightboxImage = signal<GalleryItem | null>(null);

  setLightboxVisible(value: boolean): void {
    this.lightboxVisible.set(value);
  }

  openImage(item: GalleryItem): void {
    this.lightboxImage.set(item);
    this.lightboxVisible.set(true);
  }

  confirmDelete(item: GalleryItem): void {
    this.confirmation.confirm({
      message: '¿Eliminar esta imagen de la galería?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteImage(item),
    });
  }

  deleteImage(item: GalleryItem): void {
    const pid = this.projectId();
    if (!pid) return;
    this.api
      .delete(`projects/${pid}/gallery/${item.id}`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.message.add({ severity: 'success', summary: 'Imagen eliminada' });
          this.updated.emit();
        },
        error: (err) => this.message.add({ severity: 'error', summary: err?.error?.message ?? 'Error al eliminar' }),
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const pid = this.projectId();
    if (!pid) return;
    this.uploading.set(true);
    const formData = new FormData();
    formData.append('file', file);
    this.api
      .upload<GalleryItem>(`projects/${pid}/gallery/upload`, formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.uploading.set(false);
          input.value = '';
          this.message.add({ severity: 'success', summary: 'Imagen subida' });
          this.updated.emit();
        },
        error: (err) => {
          this.uploading.set(false);
          input.value = '';
          this.message.add({ severity: 'error', summary: err?.error?.message ?? 'Error al subir' });
        },
      });
  }
}
