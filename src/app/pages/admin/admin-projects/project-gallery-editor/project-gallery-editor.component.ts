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
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import type { GalleryItem } from '../project-edit.types';

export type UploadStatus = 'pending' | 'uploading' | 'success' | 'error';

export interface UploadQueueItem {
  id: string;
  file: File;
  status: UploadStatus;
  error?: string;
}

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
    ProgressSpinnerModule,
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
      <ng-container *ngFor="let item of gallery(); trackBy: trackByGalleryId">
        <div class="gallery-item">
          <div class="gallery-image-wrap" (click)="openImage(item)">
            <span *ngIf="coverImageId() === item.id" class="gallery-cover-badge">Portada</span>
            <img [src]="item.url" [alt]="item.title || 'Imagen'" loading="lazy" />
            <div class="gallery-image-overlay">
              <i class="pi pi-search-plus"></i>
              <span>Ver</span>
            </div>
            <div class="gallery-actions">
              <p-button icon="pi pi-image" [rounded]="true" [text]="true" severity="secondary" size="small" (onClick)="setAsCover(item); $event.stopPropagation()" pTooltip="Usar como portada" [disabled]="coverImageId() === item.id" />
              <p-button icon="pi pi-eye" [rounded]="true" [text]="true" severity="secondary" size="small" (onClick)="openImage(item); $event.stopPropagation()" pTooltip="Ver imagen" />
              <p-button icon="pi pi-trash" [rounded]="true" [text]="true" severity="danger" size="small" (onClick)="confirmDelete(item); $event.stopPropagation()" pTooltip="Eliminar" />
            </div>
          </div>
          <p *ngIf="item.title" class="gallery-caption">{{ item.title }}</p>
        </div>
      </ng-container>
    </div>

    <div
      class="gallery-drop-zone"
      [class.gallery-drop-zone--active]="dragActive()"
      (click)="fileInput.click()"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
    >
      <input
        #fileInput
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        multiple
        (change)="onFileSelected($event)"
        class="file-input-hidden"
      />
      <i class="pi pi-cloud-upload gallery-drop-icon"></i>
      <p class="gallery-drop-text">Arrastrá imágenes aquí o hacé clic para elegir</p>
      <span class="gallery-upload-hint">Varias a la vez. JPEG, PNG, GIF, WebP.</span>
    </div>

    <ng-container *ngIf="uploadQueueCount() > 0">
      <div class="upload-queue">
        <p class="upload-queue-title" [textContent]="uploadQueueTitle()"></p>
        <ul class="upload-queue-list">
          <ng-container *ngFor="let item of uploadQueue(); trackBy: trackByQueueId">
            <li class="upload-queue-item" [class.upload-queue-item--error]="item.status === 'error'">
              <span class="upload-queue-name" [title]="item.file.name">{{ item.file.name }}</span>
              <span class="upload-queue-status">
                <i *ngIf="item.status === 'pending'" class="pi pi-clock" title="En cola"></i>
                <p-progressSpinner *ngIf="item.status === 'uploading'" styleClass="upload-spinner-small" strokeWidth="4"></p-progressSpinner>
                <i *ngIf="item.status === 'success'" class="pi pi-check-circle upload-status-success" title="Subida correcta"></i>
                <i *ngIf="item.status === 'error'" class="pi pi-times-circle upload-status-error" title="Error"></i>
              </span>
              <span *ngIf="item.error" class="upload-queue-error">{{ item.error }}</span>
            </li>
          </ng-container>
        </ul>
      </div>
    </ng-container>

    <p-dialog
      [visible]="lightboxVisible()"
      (visibleChange)="setLightboxVisible($event)"
      [modal]="true"
      [closable]="true"
      [dismissableMask]="true"
      (onHide)="setLightboxVisible(false)"
      styleClass="gallery-lightbox"
      contentStyle="padding: 0; overflow: hidden; position: relative;"
      [showHeader]="true"
      header="Imagen"
    >
      <ng-container *ngIf="lightboxImage() as img">
        <img [src]="img.url" [alt]="img.title || 'Imagen'" class="lightbox-img" />
        <p *ngIf="img.title" class="lightbox-caption">{{ img.title }}</p>
      </ng-container>
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
    .gallery-cover-badge {
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      z-index: 2;
      background: var(--p-primary-color);
      color: var(--p-primary-contrast-color);
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
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
    .gallery-drop-zone {
      border: 2px dashed var(--p-border-color);
      border-radius: 8px;
      padding: 1.5rem;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
      margin-bottom: 1rem;
    }
    .gallery-drop-zone:hover,
    .gallery-drop-zone--active {
      border-color: var(--p-primary-color);
      background: rgba(var(--p-primary-color-rgb), 0.08);
    }
    .gallery-drop-icon {
      font-size: 2rem;
      color: var(--p-text-muted-color);
      display: block;
      margin-bottom: 0.5rem;
    }
    .gallery-drop-zone:hover .gallery-drop-icon,
    .gallery-drop-zone--active .gallery-drop-icon {
      color: var(--p-primary-color);
    }
    .gallery-drop-text {
      font-weight: 500;
      color: var(--p-text-color);
      margin: 0 0 0.25rem 0;
    }
    .gallery-upload-hint {
      font-size: 0.8125rem;
      color: var(--p-text-muted-color);
    }
    .file-input-hidden { display: none; }
    .upload-queue {
      margin-top: 1rem;
      padding: 1rem;
      background: rgba(0,0,0,0.15);
      border-radius: 8px;
    }
    .upload-queue-title {
      margin: 0 0 0.75rem 0;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--p-text-color);
    }
    .upload-queue-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .upload-queue-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.875rem;
      padding: 0.35rem 0;
    }
    .upload-queue-item--error {
      color: var(--p-danger-color);
    }
    .upload-queue-name {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .upload-queue-status {
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }
    .upload-status-success { color: var(--p-green-500); }
    .upload-status-error { color: var(--p-danger-color); }
    .upload-queue-error {
      font-size: 0.75rem;
      color: var(--p-danger-color);
      max-width: 12rem;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    :host ::ng-deep .upload-spinner-small {
      width: 20px;
      height: 20px;
    }
    :host ::ng-deep .upload-spinner-small .p-progress-spinner-circle {
      animation: none;
    }
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
  coverImageId = input<string | null>(null);
  updated = output<void>();

  private readonly api = inject(ApiService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly message = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly uploadQueue = signal<UploadQueueItem[]>([]);
  readonly uploadQueueCount = signal(0);
  readonly uploadQueueTitle = signal('');
  readonly dragActive = signal(false);
  readonly lightboxVisible = signal(false);
  readonly lightboxImage = signal<GalleryItem | null>(null);

  setAsCover(item: GalleryItem): void {
    const pid = this.projectId();
    if (!pid) return;
    this.api
      .patch(`projects/${pid}`, { coverImageId: item.id })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.message.add({ severity: 'success', summary: 'Portada actualizada' });
          this.updated.emit();
        },
        error: (err) => this.message.add({ severity: 'error', summary: err?.error?.message ?? 'Error al establecer portada' }),
      });
  }

  setLightboxVisible(value: boolean): void {
    this.lightboxVisible.set(value);
  }

  trackByGalleryId(_i: number, item: GalleryItem): string {
    return item.id;
  }

  trackByQueueId(_i: number, item: UploadQueueItem): string {
    return item.id;
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

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.types?.includes('Files')) this.dragActive.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive.set(false);
    const files = event.dataTransfer?.files;
    if (!files?.length) return;
    this.addFilesToQueue(Array.from(files));
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files?.length) return;
    this.addFilesToQueue(Array.from(files));
    input.value = '';
  }

  private addFilesToQueue(files: File[]): void {
    const pid = this.projectId();
    if (!pid) return;
    const imageFiles = files.filter((f) => /^image\/(jpeg|png|gif|webp)$/i.test(f.type));
    if (imageFiles.length === 0) {
      this.message.add({ severity: 'warn', summary: 'Solo se permiten imágenes (JPEG, PNG, GIF, WebP)' });
      return;
    }
    const items: UploadQueueItem[] = imageFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      status: 'pending' as UploadStatus,
    }));
    this.uploadQueue.update((q) => [...q, ...items]);
    this.syncUploadQueueCount();
    this.processQueue();
  }

  private processQueue(): void {
    const queue = this.uploadQueue();
    const uploading = queue.find((i) => i.status === 'uploading');
    if (uploading) return;
    const next = queue.find((i) => i.status === 'pending');
    if (!next) return;
    const pid = this.projectId();
    if (!pid) return;

    this.setQueueItemStatus(next.id, 'uploading');
    const formData = new FormData();
    formData.append('file', next.file);
    this.api
      .upload<GalleryItem>(`projects/${pid}/gallery/upload`, formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setQueueItemStatus(next.id, 'success');
          this.message.add({ severity: 'success', summary: next.file.name + ' subida' });
          this.updated.emit();
          setTimeout(() => this.removeQueueItem(next.id), 1500);
          this.processQueue();
        },
        error: (err) => {
          const msg = err?.error?.message ?? err?.message ?? 'Error al subir';
          this.setQueueItemStatus(next.id, 'error', msg);
          this.message.add({ severity: 'error', summary: msg });
          this.processQueue();
        },
      });
  }

  private setQueueItemStatus(id: string, status: UploadStatus, error?: string): void {
    this.uploadQueue.update((q) =>
      q.map((i) => (i.id === id ? { ...i, status, error } : i))
    );
  }

  private removeQueueItem(id: string): void {
    this.uploadQueue.update((q) => q.filter((i) => i.id !== id));
    this.syncUploadQueueCount();
  }

  private syncUploadQueueCount(): void {
    const n = this.uploadQueue().length;
    this.uploadQueueCount.set(n);
    this.uploadQueueTitle.set(n === 1 ? 'Subiendo 1 archivo' : 'Subiendo ' + n + ' archivos');
  }
}
