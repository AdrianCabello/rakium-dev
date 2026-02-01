import { Component, inject, signal, computed, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { MessageService } from 'primeng/api';
import { ProjectFull } from '../project-edit.types';
import { ProjectEditFormComponent } from '../project-edit-form/project-edit-form.component';
import { ProjectPresupuestoFormComponent } from '../project-presupuesto-form/project-presupuesto-form.component';
import { ProjectGalleryEditorComponent } from '../project-gallery-editor/project-gallery-editor.component';
import { ProjectVideosEditorComponent } from '../project-videos-editor/project-videos-editor.component';

@Component({
  selector: 'app-admin-project-edit',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    CardModule,
    ProgressSpinnerModule,
    MessageModule,
    ToastModule,
    TabViewModule,
    ProjectEditFormComponent,
    ProjectPresupuestoFormComponent,
    ProjectGalleryEditorComponent,
    ProjectVideosEditorComponent,
  ],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-toast />
    <div class="edit-project-page">
      <div class="flex align-items-center gap-3 mb-4">
        <p-button icon="pi pi-arrow-left" [rounded]="true" [text]="true" [routerLink]="['/admin/projects']" />
        <h1 class="m-0 text-2xl font-semibold text-color">{{ pageTitle() }}</h1>
      </div>

      <div *ngIf="loading()" class="flex justify-content-center align-items-center py-8">
        <p-progressSpinner strokeWidth="4" />
      </div>
      <p-message *ngIf="errorMessage() && !loading()" severity="error" [text]="errorMessage()" styleClass="w-full" />
      <p-tabView *ngIf="project() && !loading() && !errorMessage()" class="edit-tabs">
          <p-tabPanel header="Información">
            <section class="section-card">
              <app-project-edit-form
                [project]="project()!"
                [clients]="clients()"
                [canChangeClient]="canChangeClient()"
                (saved)="onProjectSaved($event)"
              />
            </section>
          </p-tabPanel>
          <ng-container *ngIf="!isNew()">
            <p-tabPanel header="Presupuesto">
              <section class="section-card">
                <app-project-presupuesto-form
                  [project]="project()!"
                  (saved)="onProjectSaved($event)"
                />
              </section>
            </p-tabPanel>
            <p-tabPanel header="Galería">
              <section class="section-card">
                <app-project-gallery-editor
                  [projectId]="projectId()"
                  [gallery]="project()!.gallery ?? []"
                  (updated)="loadProject()"
                />
              </section>
            </p-tabPanel>
            <p-tabPanel header="Videos">
              <section class="section-card">
                <app-project-videos-editor
                  [projectId]="projectId()"
                  [videos]="project()!.videos ?? []"
                  (updated)="loadProject()"
                />
              </section>
            </p-tabPanel>
          </ng-container>
        </p-tabView>
    </div>
  `,
  styles: [`
    .edit-project-page { max-width: 56rem; margin: 0 auto; }
    .edit-tabs :deep(.p-tabview-panels) { padding: 0; }
    .edit-tabs .section-card { margin-top: 0.5rem; }
    .section-card {
      background: var(--p-card-background, #2C3550);
      border-radius: 8px;
      padding: 1.5rem;
      border: 1px solid var(--p-card-border-color, #666);
    }
  `],
})
export class AdminProjectEditComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  private readonly authService = inject(AuthService);
  private readonly message = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly projectId = computed(() => this.route.snapshot.paramMap.get('id') ?? '');
  readonly isNew = computed(() => this.projectId() === 'new');
  readonly pageTitle = computed(() => (this.isNew() ? 'Nuevo proyecto' : 'Editar proyecto'));
  readonly canChangeClient = computed(() => {
    if (!this.isNew()) return true;
    return this.authService.currentUser()?.role === 'ADMIN';
  });
  readonly project = signal<ProjectFull | null>(null);
  readonly loading = signal(true);
  readonly errorMessage = signal('');
  readonly clients = signal<{ id: string; name: string; email: string }[]>([]);

  private static emptyProject(clientId?: string): ProjectFull {
    return {
      id: 'new',
      name: '',
      clientId: clientId ?? '',
      status: 'DRAFT',
      gallery: [],
      videos: [],
    };
  }

  constructor() {
    this.loadProject();
    this.loadClients();
  }

  loadProject(): void {
    const id = this.projectId();
    if (id === 'new') {
      const role = this.authService.currentUser()?.role;
      if (role !== 'ADMIN' && role !== 'CLIENT_ADMIN') {
        this.router.navigate(['/admin/projects']);
        return;
      }
      const defaultClientId = role === 'CLIENT_ADMIN' ? this.authService.currentUser()?.clientId : undefined;
      this.project.set(AdminProjectEditComponent.emptyProject(defaultClientId));
      this.loading.set(false);
      this.errorMessage.set('');
      return;
    }
    if (!id) {
      this.loading.set(false);
      this.errorMessage.set('ID de proyecto no válido');
      return;
    }
    this.loading.set(true);
    this.errorMessage.set('');
    this.api
      .get<ProjectFull>(`projects/${id}`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (p) => {
          this.project.set(p);
          this.loading.set(false);
        },
        error: (err) => {
          this.errorMessage.set(err?.error?.message ?? 'Error al cargar el proyecto');
          this.loading.set(false);
        },
      });
  }

  loadClients(): void {
    this.api
      .get<{ data: { id: string; name: string; email: string }[] }>('clients', { limit: 100 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => this.clients.set(res.data),
        error: () => {},
      });
  }

  onProjectSaved(updated: ProjectFull): void {
    if (this.isNew()) {
      this.router.navigate(['/admin/projects', updated.id, 'edit'], { replaceUrl: true });
      this.message.add({ severity: 'success', summary: 'Proyecto creado' });
    } else {
      this.project.set(updated);
      this.message.add({ severity: 'success', summary: 'Proyecto actualizado' });
    }
  }
}
