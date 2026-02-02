import { Component, inject, signal, computed, ChangeDetectionStrategy, DestroyRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProjectFull } from '../project-edit.types';
import { ProjectEditContextService } from '../project-edit-context.service';

@Component({
  selector: 'app-admin-project-edit',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    ButtonModule,
    ProgressSpinnerModule,
    MessageModule,
    ToastModule,
  ],
  providers: [MessageService, ProjectEditContextService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-toast />
    <div class="edit-project-page">
      <div class="flex align-items-center gap-3 mb-4">
        <p-button icon="pi pi-arrow-left" [rounded]="true" [text]="true" [routerLink]="['/admin/projects']" styleClass="text-zinc-400 hover:text-white" />
        <h1 class="m-0 text-2xl font-semibold text-white">{{ pageTitle() }}</h1>
      </div>

      <div *ngIf="loading()" class="flex justify-content-center align-items-center py-8">
        <p-progressSpinner strokeWidth="4" />
      </div>
      <p-message *ngIf="errorMessage() && !loading()" severity="error" [text]="errorMessage()" styleClass="w-full" />
      <ng-container *ngIf="project() && !loading() && !errorMessage()">
        <nav class="edit-tabs-nav">
          <a
            [routerLink]="['/admin/projects', projectId(), 'edit', 'informacion']"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: false }"
            class="tab-link"
          >
            Información
          </a>
          <ng-container *ngIf="!isNew()">
            <a [routerLink]="['/admin/projects', projectId(), 'edit', 'desafio-solucion']" routerLinkActive="active" class="tab-link">Desafío y solución</a>
            <a [routerLink]="['/admin/projects', projectId(), 'edit', 'ubicacion']" routerLinkActive="active" class="tab-link">Ubicación</a>
            <a [routerLink]="['/admin/projects', projectId(), 'edit', 'enlaces']" routerLinkActive="active" class="tab-link">Enlaces</a>
            <a [routerLink]="['/admin/projects', projectId(), 'edit', 'contacto']" routerLinkActive="active" class="tab-link">Contacto</a>
            <a [routerLink]="['/admin/projects', projectId(), 'edit', 'presupuesto']" routerLinkActive="active" class="tab-link">Presupuesto</a>
            <a [routerLink]="['/admin/projects', projectId(), 'edit', 'galeria']" routerLinkActive="active" class="tab-link">Galería</a>
            <a [routerLink]="['/admin/projects', projectId(), 'edit', 'videos']" routerLinkActive="active" class="tab-link">Videos</a>
          </ng-container>
        </nav>
        <router-outlet />
      </ng-container>
    </div>
  `,
  styles: [`
    .edit-project-page { max-width: 56rem; margin: 0 auto; }
    .edit-tabs-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
      margin-bottom: 1rem;
      border-bottom: 1px solid rgb(63 63 70);
      padding-bottom: 0.5rem;
    }
    .tab-link {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      text-decoration: none;
      color: rgb(161 161 170);
      font-size: 0.9rem;
      font-weight: 500;
      transition: background-color 0.2s, color 0.2s;
    }
    .tab-link:hover {
      background: rgb(63 63 70);
      color: white;
    }
    .tab-link.active {
      background: rgb(37 99 235);
      color: white;
    }
  `],
})
export class AdminProjectEditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  private readonly authService = inject(AuthService);
  private readonly message = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ctx = inject(ProjectEditContextService);

  readonly projectId = computed(() => this.route.snapshot.paramMap.get('id') ?? '');
  readonly isNew = computed(() => this.projectId() === 'new');
  readonly pageTitle = computed(() => {
    if (this.isNew()) return 'Nuevo proyecto';
    const p = this.project();
    return p?.name ? `Editar: ${p.name}` : 'Editar proyecto';
  });
  readonly canChangeClient = computed(() => {
    if (!this.isNew()) return true;
    return this.authService.currentUser()?.role === 'ADMIN';
  });
  readonly project = signal<ProjectFull | null>(null);
  readonly loading = signal(true);
  readonly errorMessage = signal('');
  readonly clients = signal<{ id: string; name: string; email: string }[]>([]);
  private lastLoadedId: string | null = null;

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
    this.loadClients();
    this.ctx.onReloadProject = () => this.loadProject();
    this.ctx.onProjectCreated = (updated) => {
      this.router.navigate(['/admin/projects', updated.id, 'edit', 'informacion'], { replaceUrl: true });
      this.message.add({ severity: 'success', summary: 'Proyecto creado' });
    };
    this.ctx.onProjectUpdated = () => {
      this.message.add({ severity: 'success', summary: 'Proyecto actualizado' });
    };
  }

  ngOnInit(): void {
    this.loadProject();
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      const id = this.route.snapshot.paramMap.get('id') ?? '';
      if (id !== this.lastLoadedId) this.loadProject();
    });
  }

  loadProject(): void {
    const id = this.projectId();
    this.lastLoadedId = id;
    if (id === 'new') {
      const role = this.authService.currentUser()?.role;
      if (role !== 'ADMIN' && role !== 'CLIENT_ADMIN') {
        this.router.navigate(['/admin/projects']);
        return;
      }
      const defaultClientId = role === 'CLIENT_ADMIN' ? this.authService.currentUser()?.clientId : undefined;
      const p = AdminProjectEditComponent.emptyProject(defaultClientId);
      this.project.set(p);
      this.ctx.setProject(p);
      this.ctx.setClients(this.clients());
      this.ctx.setCanChangeClient(this.canChangeClient());
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
          this.ctx.setProject(p);
          this.ctx.setClients(this.clients());
          this.ctx.setCanChangeClient(this.canChangeClient());
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
        next: (res) => {
          this.clients.set(res.data);
          this.ctx.setClients(res.data);
        },
        error: () => {},
      });
  }

}
