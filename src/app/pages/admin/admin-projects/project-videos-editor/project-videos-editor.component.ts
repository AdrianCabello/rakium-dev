import { Component, input, output, inject, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../../../core/services/api.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';
import type { VideoItem } from '../project-edit.types';

@Component({
  selector: 'app-project-videos-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  providers: [ConfirmationService, MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-toast />
    <p-confirmDialog />
    <h2 class="text-xl font-semibold text-color mt-0 mb-3 flex align-items-center gap-2">
      <i class="pi pi-video"></i>
      Videos (YouTube)
    </h2>

    <div class="videos-list mb-4">
      @for (video of videos(); track video.id) {
        <div class="video-card flex align-items-center gap-3 p-3 surface-100 border-round mb-2">
          <div class="video-thumb">
            <img [src]="getThumbUrl(video.youtubeUrl)" alt="" width="120" height="68" style="object-fit: cover; border-radius: 4px;" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-color m-0 mb-1">{{ video.title }}</p>
            @if (video.description) {
              <p class="text-color-secondary text-sm m-0 line-clamp-2">{{ video.description }}</p>
            }
          </div>
          <p-button icon="pi pi-trash" [rounded]="true" severity="danger" [text]="true" (onClick)="confirmDelete(video)" />
        </div>
      }
      @empty {
        <p class="text-color-secondary m-0">Aún no hay videos. Añade uno con el enlace de YouTube.</p>
      }
    </div>

    <p-button label="Añadir video" icon="pi pi-plus" (onClick)="openDialog()" />

    <p-dialog
      [visible]="dialogVisible()"
      (visibleChange)="setDialogVisible($event)"
      header="Añadir video de YouTube"
      [modal]="true"
      styleClass="dialog-w-28"
      (onHide)="closeDialog()"
      [draggable]="false"
      [resizable]="false"
    >
      <form (ngSubmit)="addVideo()" class="flex flex-column gap-3">
        <div class="flex flex-column gap-2">
          <label for="videoTitle">Título</label>
          <input pInputText id="videoTitle" [(ngModel)]="form.title" name="title" required class="w-full" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="videoUrl">URL de YouTube</label>
          <input pInputText id="videoUrl" [(ngModel)]="form.youtubeUrl" name="youtubeUrl" required placeholder="https://www.youtube.com/watch?v=..." class="w-full" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="videoDesc">Descripción (opcional)</label>
          <input pInputText id="videoDesc" [(ngModel)]="form.description" name="description" class="w-full" />
        </div>
      </form>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" (onClick)="closeDialog()" />
        <p-button label="Añadir" (onClick)="addVideo()" [loading]="saving()" [disabled]="saving()" />
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    :host { display: block; }
    :host ::ng-deep .dialog-w-28 { width: 28rem; }
    .video-card { transition: background 0.2s; }
    .video-card:hover { background: var(--p-surface-200); }
    .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  `],
})
export class ProjectVideosEditorComponent {
  projectId = input.required<string>();
  videos = input.required<VideoItem[]>();
  updated = output<void>();

  private readonly api = inject(ApiService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly message = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly saving = signal(false);
  readonly dialogVisible = signal(false);
  form: { title: string; youtubeUrl: string; description?: string } = { title: '', youtubeUrl: '', description: '' };

  getThumbUrl(youtubeUrl: string): string {
    const match = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    const id = match?.[1] ?? '';
    return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : 'assets/placeholder-video.png';
  }

  openDialog(): void {
    this.form = { title: '', youtubeUrl: '', description: '' };
    this.dialogVisible.set(true);
  }

  setDialogVisible(visible: boolean): void {
    this.dialogVisible.set(visible);
  }

  closeDialog(): void {
    this.dialogVisible.set(false);
  }

  addVideo(): void {
    const pid = this.projectId();
    if (!pid || !this.form.title.trim() || !this.form.youtubeUrl.trim()) return;
    this.saving.set(true);
    this.api
      .post<VideoItem>(`projects/${pid}/videos`, {
        title: this.form.title.trim(),
        youtubeUrl: this.form.youtubeUrl.trim(),
        description: this.form.description?.trim() || undefined,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.closeDialog();
          this.message.add({ severity: 'success', summary: 'Video añadido' });
          this.updated.emit();
        },
        error: (err) => {
          this.saving.set(false);
          this.message.add({ severity: 'error', summary: err?.error?.message ?? 'Error al añadir video' });
        },
      });
  }

  confirmDelete(video: VideoItem): void {
    this.confirmation.confirm({
      message: `¿Eliminar el video "${video.title}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteVideo(video),
    });
  }

  deleteVideo(video: VideoItem): void {
    const pid = this.projectId();
    if (!pid) return;
    this.api
      .delete(`projects/${pid}/videos/${video.id}`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.message.add({ severity: 'success', summary: 'Video eliminado' });
          this.updated.emit();
        },
        error: (err) => this.message.add({ severity: 'error', summary: err?.error?.message ?? 'Error al eliminar' }),
      });
  }
}
