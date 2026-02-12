import { Component, inject, signal, computed, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';

const PROJECT_CATEGORIES = [
  { label: 'Estaciones', value: 'ESTACIONES' },
  { label: 'Tiendas', value: 'TIENDAS' },
  { label: 'Comerciales', value: 'COMERCIALES' },
  { label: 'Sitio web', value: 'SITIO_WEB' },
];

const PROJECT_TYPES = [
  { label: 'Landing', value: 'LANDING' },
  { label: 'E-commerce', value: 'ECOMMERCE' },
  { label: 'Inmobiliaria', value: 'INMOBILIARIA' },
  { label: 'Custom', value: 'CUSTOM' },
];

const PROJECT_TYPES_SITIO_WEB = [
  { label: 'Landing', value: 'LANDING' },
  { label: 'Portfolio', value: 'PORTFOLIO' },
  { label: 'Blog', value: 'BLOG' },
  { label: 'Corporativo', value: 'CORPORATIVO' },
  { label: 'One Page', value: 'ONE_PAGE' },
];

const PROJECT_STATUSES = [
  { label: 'Borrador', value: 'DRAFT' },
  { label: 'Publicado', value: 'PUBLISHED' },
  { label: 'Pendiente', value: 'PENDING' },
];

interface Project {
  id: string;
  name: string;
  type?: string;
  status: string;
  category?: string;
  description?: string;
  clientId: string;
  client?: { id: string; name: string; email: string };
  createdAt: string;
  order?: number;
}

interface Paginated<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    DropdownModule,
    MessageModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
  ],
  providers: [ConfirmationService, MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-toast />
    <p-confirmDialog />
    <div>
      <!-- Header (estilo dashboard) -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2 text-white">Proyectos</h1>
        <p class="text-zinc-400">Gestiona y edita tus proyectos</p>
      </div>

      <!-- Contenedor tabla (estilo dashboard) -->
      <div class="projects-table-wrapper bg-zinc-800 rounded-lg border border-zinc-700">
        <div class="p-6 border-b border-zinc-700">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex flex-wrap items-center gap-4">
              <div class="relative">
                <input
                  type="text"
                  [(ngModel)]="search"
                  (ngModelChange)="onSearch()"
                  placeholder="Buscar proyectos..."
                  class="pl-10 pr-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              @if (isAdmin()) {
                <p-dropdown
                  [options]="clients()"
                  [(ngModel)]="filterClientId"
                  (ngModelChange)="onFilterClient()"
                  optionLabel="name"
                  optionValue="id"
                  [showClear]="true"
                  placeholder="Todos los clientes"
                  styleClass="projects-client-dropdown"
                />
              }
            </div>
            @if (canCreateProject()) {
              <a
                [routerLink]="['/admin/projects', 'new', 'edit']"
                class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors no-underline"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span>Nuevo proyecto</span>
              </a>
            }
          </div>
        </div>

        @if (errorMessage()) {
          <div class="px-6 pt-4">
            <p-message severity="error" [text]="errorMessage()" />
          </div>
        }

        <div class="p-6 pt-0">
          <p-table
            [value]="projects()"
            [lazy]="true"
            [paginator]="true"
            [first]="firstRowIndex()"
            [rows]="limit()"
            [totalRecords]="total()"
            (onLazyLoad)="load($event)"
            [loading]="loading()"
            [rowsPerPageOptions]="[5, 10, 25]"
            [showCurrentPageReport]="true"
            [currentPageReportTemplate]="getReportTemplate()"
            styleClass="p-datatable-sm projects-datatable"
          >
            <ng-template pTemplate="header">
              <tr>
                <th style="width: 4rem">Orden</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Cliente</th>
                <th style="width: 12rem">Acciones</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-p>
              <tr class="cursor-pointer" (click)="goToEdit(p)">
                <td (click)="$event.stopPropagation()">
                  <span class="font-semibold text-white" [innerText]="displayOrder(p)"></span>
                  <div class="flex gap-1 mt-1">
                    <button
                      type="button"
                      class="p-1.5 rounded bg-zinc-600 hover:bg-zinc-500 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed"
                      [disabled]="isFirstOrder(p)"
                      (click)="moveUp(p); $event.stopPropagation()"
                      pTooltip="Subir"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
                    </button>
                    <button
                      type="button"
                      class="p-1.5 rounded bg-zinc-600 hover:bg-zinc-500 text-zinc-300"
                      (click)="moveDown(p); $event.stopPropagation()"
                      pTooltip="Bajar"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                  </div>
                </td>
                <td class="text-white font-medium">{{ p.name }}</td>
                <td class="text-zinc-400">{{ p.category || '-' }}</td>
                <td>
                  <span
                    class="px-2 py-1 text-xs rounded"
                    [ngClass]="getStatusClasses(p)"
                  >{{ p.status }}</span>
                </td>
                <td class="text-zinc-400">{{ p.client?.name || '-' }}</td>
                <td (click)="$event.stopPropagation()">
                  <div class="flex items-center gap-1">
                    <a
                      [routerLink]="['/admin/projects', p.id, 'edit']"
                      class="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-600 hover:bg-zinc-500 text-white text-sm rounded transition-colors no-underline"
                      (click)="$event.stopPropagation()"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      <span>Editar</span>
                    </a>
                    @if (isAdmin()) {
                      <button
                        type="button"
                        class="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-red-600/20 hover:bg-red-600/40 text-red-400 text-sm transition-colors"
                        (click)="confirmDelete(p); $event.stopPropagation()"
                        pTooltip="Eliminar proyecto"
                      >
                        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        <span>Eliminar</span>
                      </button>
                    }
                  </div>
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr><td colspan="6" class="text-zinc-400 text-center py-8">No hay proyectos.</td></tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </div>

    <p-dialog
      [visible]="dialogVisible()"
      (visibleChange)="setDialogVisible($event)"
      [header]="editingProject() ? 'Editar proyecto' : 'Nuevo proyecto'"
      [modal]="true"
      styleClass="dialog-w-32"
      (onHide)="closeDialog()"
      [draggable]="false"
      [resizable]="false"
    >
      <form (ngSubmit)="save()" class="flex flex-column gap-3">
        <div class="flex flex-column gap-2">
          <label for="name">Nombre</label>
          <input pInputText id="name" [(ngModel)]="form.name" name="name" required class="w-full" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="clientId">Cliente</label>
          <p-dropdown
            id="clientId"
            [options]="clients()"
            [(ngModel)]="form.clientId"
            name="clientId"
            optionLabel="name"
            optionValue="id"
            placeholder="Seleccionar cliente"
            styleClass="w-full"
            required
          />
        </div>
        <div class="flex flex-column gap-2">
          <label for="category">Categoría</label>
          <p-dropdown id="category" [options]="PROJECT_CATEGORIES" [(ngModel)]="form.category" (ngModelChange)="onDialogCategoryChange($event)" name="category" optionLabel="label" optionValue="value" styleClass="w-full" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="type">Tipo</label>
          <p-dropdown id="type" [options]="dialogTypeOptions()" [(ngModel)]="form.type" name="type" optionLabel="label" optionValue="value" styleClass="w-full" [showClear]="true" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="status">Estado</label>
          <p-dropdown id="status" [options]="PROJECT_STATUSES" [(ngModel)]="form.status" name="status" optionLabel="label" optionValue="value" styleClass="w-full" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="description">Descripción</label>
          <input pInputText id="description" [(ngModel)]="form.description" name="description" class="w-full" />
        </div>
      </form>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" (onClick)="closeDialog()" />
        <p-button label="Guardar" (onClick)="save()" />
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    :host { display: block; }
    :host ::ng-deep .dialog-w-32 { width: 32rem; }
    :host ::ng-deep .w-full { width: 100%; }
    :host ::ng-deep .projects-client-dropdown .p-dropdown {
      background: rgb(63 63 70);
      border-color: rgb(82 82 91);
      min-width: 12rem;
    }
    :host ::ng-deep .projects-client-dropdown .p-dropdown-label,
    :host ::ng-deep .projects-client-dropdown .p-dropdown-placeholder {
      color: rgb(161 161 170);
    }
    :host ::ng-deep .projects-datatable .p-datatable-header,
    :host ::ng-deep .projects-datatable .p-datatable-thead > tr > th {
      background: rgb(63 63 70) !important;
      border-color: rgb(82 82 91) !important;
      color: rgb(212 212 216) !important;
    }
    :host ::ng-deep .projects-datatable .p-datatable-tbody > tr > td {
      background: rgb(39 39 42) !important;
      border-color: rgb(63 63 70) !important;
    }
    :host ::ng-deep .projects-datatable .p-datatable-tbody > tr:hover > td {
      background: rgb(63 63 70) !important;
    }
    :host ::ng-deep .projects-datatable .p-paginator {
      background: rgb(63 63 70) !important;
      border-color: rgb(82 82 91) !important;
      color: rgb(212 212 216) !important;
    }
    :host ::ng-deep .projects-datatable .p-paginator .p-paginator-element {
      color: rgb(212 212 216);
    }
    :host ::ng-deep .projects-datatable .p-paginator .p-paginator-element:hover {
      background: rgb(82 82 91);
      color: white;
    }
  `],
})
export class AdminProjectsComponent {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly message = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly PROJECT_CATEGORIES = PROJECT_CATEGORIES;
  protected readonly PROJECT_TYPES = PROJECT_TYPES;
  protected readonly PROJECT_TYPES_SITIO_WEB = PROJECT_TYPES_SITIO_WEB;
  protected readonly PROJECT_STATUSES = PROJECT_STATUSES;

  private readonly dialogCategoryForTypes = signal<string | undefined>(undefined);
  readonly dialogTypeOptions = computed(() =>
    this.dialogCategoryForTypes() === 'SITIO_WEB' ? PROJECT_TYPES_SITIO_WEB : PROJECT_TYPES
  );

  readonly isAdmin = computed(() => this.authService.currentUser()?.role === 'ADMIN');
  readonly canCreateProject = computed(() => {
    const role = this.authService.currentUser()?.role;
    return role === 'ADMIN' || role === 'CLIENT_ADMIN';
  });
  readonly projects = signal<Project[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly limit = signal(10);
  search = '';
  filterClientId: string | null = null;
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly dialogVisible = signal(false);
  readonly editingProject = signal<Project | null>(null);
  readonly clients = signal<{ id: string; name: string; email: string }[]>([]);
  form: { name: string; clientId: string; category?: string; type?: string; status: string; description?: string } = {
    name: '',
    clientId: '',
    category: undefined,
    type: undefined,
    status: 'DRAFT',
    description: '',
  };
  readonly firstRowIndex = computed(() => (this.page() - 1) * this.limit());

  getReportTemplate(): string {
    return 'Mostrando {first} a {last} de {totalRecords}';
  }

  getStatusClasses(p: Project): string {
    if (p.status === 'DRAFT') return 'bg-yellow-600/20 text-yellow-400';
    if (p.status === 'PUBLISHED') return 'bg-green-600/20 text-green-400';
    if (p.status === 'PENDING') return 'bg-orange-600/20 text-orange-400';
    return '';
  }

  displayOrder(p: Project): number {
    return (p.order != null ? p.order : 0) + 1;
  }

  isFirstOrder(p: Project): boolean {
    return (p.order ?? 0) === 0;
  }

  constructor() {
    const user = this.authService.currentUser();
    if (user?.role !== 'ADMIN' && user?.clientId) {
      this.filterClientId = user.clientId;
    }
    if (this.isAdmin()) {
      this.loadClients();
    }
    this.fetch();
  }

  loadClients(): void {
    this.api.get<Paginated<{ id: string; name: string; email: string }>>('clients', { limit: 100 }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => this.clients.set(res.data),
      error: () => {},
    });
  }

  load(event: TableLazyLoadEvent): void {
    const first = event.first ?? 0;
    const rows = event.rows ?? 10;
    const page = Math.floor(first / rows) + 1;
    this.page.set(page);
    this.limit.set(rows);
    this.fetch();
  }

  onSearch(): void {
    this.page.set(1);
    this.fetch();
  }

  onFilterClient(): void {
    this.page.set(1);
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    const params: Record<string, string | number | undefined> = {
      page: this.page(),
      limit: this.limit(),
      search: this.search || undefined,
    };
    const user = this.authService.currentUser();
    if (user?.role !== 'ADMIN' && user?.clientId) {
      params['clientId'] = user.clientId;
    } else if (this.filterClientId) {
      params['clientId'] = this.filterClientId;
    }
    this.api
      .get<Paginated<Project>>('projects', params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.projects.set(res.data);
          this.total.set(res.total);
          this.loading.set(false);
        },
        error: (err) => {
          this.errorMessage.set(err?.error?.message || 'Error al cargar proyectos');
          this.loading.set(false);
        },
      });
  }

  goToEdit(project: Project): void {
    this.router.navigate(['/admin/projects', project.id, 'edit']);
  }

  goToNew(): void {
    this.router.navigate(['/admin/projects', 'new', 'edit']);
  }

  openDialog(project?: Project): void {
    this.editingProject.set(project ?? null);
    this.form = {
      name: project?.name ?? '',
      clientId: project?.clientId ?? '',
      category: project?.category,
      type: project?.type,
      status: project?.status ?? 'DRAFT',
      description: project?.description ?? '',
    };
    this.dialogCategoryForTypes.set(this.form.category);
    this.dialogVisible.set(true);
  }

  onDialogCategoryChange(value: string | undefined): void {
    this.dialogCategoryForTypes.set(value);
    if (value === 'SITIO_WEB') {
      const webValues = PROJECT_TYPES_SITIO_WEB.map((o) => o.value);
      if (this.form.type && !webValues.includes(this.form.type)) this.form.type = undefined;
    }
  }

  setDialogVisible(visible: boolean): void {
    this.dialogVisible.set(visible);
  }

  closeDialog(): void {
    this.dialogVisible.set(false);
    this.editingProject.set(null);
  }

  save(): void {
    const editing = this.editingProject();
    const payload = {
      name: this.form.name,
      clientId: this.form.clientId,
      category: this.form.category,
      type: this.form.type,
      status: this.form.status,
      description: this.form.description || undefined,
    };
    if (editing) {
      this.api.patch<Project>(`projects/${editing.id}`, payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.message.add({ severity: 'success', summary: 'Proyecto actualizado' });
          this.closeDialog();
          this.fetch();
        },
        error: (err) => this.message.add({ severity: 'error', summary: err?.error?.message || 'Error al actualizar' }),
      });
    } else {
      this.api.post<Project>('projects', payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (created) => {
          this.message.add({ severity: 'success', summary: 'Proyecto creado' });
          this.closeDialog();
          if (created?.id) {
            this.router.navigate(['/admin/projects', created.id, 'edit']);
          } else {
            this.fetch();
          }
        },
        error: (err) => this.message.add({ severity: 'error', summary: err?.error?.message || 'Error al crear' }),
      });
    }
  }

  confirmDelete(project: Project): void {
    this.confirmation.confirm({
      message: `¿Eliminar proyecto "${project.name}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.delete(project),
    });
  }

  delete(project: Project): void {
    this.api.delete(`projects/${project.id}`).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.message.add({ severity: 'success', summary: 'Proyecto eliminado' });
        this.fetch();
      },
      error: (err) => this.message.add({ severity: 'error', summary: err?.error?.message || 'Error al eliminar' }),
    });
  }

  moveUp(project: Project): void {
    const currentOrder = project.order ?? 0;
    if (currentOrder <= 0) return;
    const newOrder = currentOrder - 1;
    this.api.patch(`projects/${project.id}/order/${newOrder}`, {}).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.message.add({ severity: 'success', summary: 'Orden actualizado' });
        this.fetch();
      },
      error: (err) => this.message.add({ severity: 'error', summary: err?.error?.message || 'Error al cambiar orden' }),
    });
  }

  moveDown(project: Project): void {
    const currentOrder = project.order ?? 0;
    const newOrder = currentOrder + 1;
    this.api.patch(`projects/${project.id}/order/${newOrder}`, {}).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.message.add({ severity: 'success', summary: 'Orden actualizado' });
        this.fetch();
      },
      error: (err) => this.message.add({ severity: 'error', summary: err?.error?.message || 'Error al cambiar orden' }),
    });
  }
}
