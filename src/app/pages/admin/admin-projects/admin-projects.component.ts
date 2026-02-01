import { Component, inject, signal, computed, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
import { ConfirmationService, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';

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
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    DropdownModule,
    MessageModule,
    ConfirmDialogModule,
    ToastModule,
    CardModule,
  ],
  providers: [ConfirmationService, MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-toast />
    <p-confirmDialog />
    <p-card header="Proyectos">
      <div class="flex flex-wrap gap-2 mb-4 align-items-center">
        <span class="p-input-icon-left search-bar">
          <i class="pi pi-search"></i>
          <input
            pInputText
            type="text"
            [(ngModel)]="search"
            (ngModelChange)="onSearch()"
            placeholder="Buscar por nombre..."
            class="search-input"
          />
        </span>
        @if (isAdmin()) {
          <p-dropdown
            [options]="clients()"
            [(ngModel)]="filterClientId"
            (ngModelChange)="onFilterClient()"
            optionLabel="name"
            optionValue="id"
            [showClear]="true"
            placeholder="Todos los clientes"
            styleClass="filter-dropdown-min-width"
          />
        }
        @if (canCreateProject()) {
          <p-button label="Nuevo proyecto" icon="pi pi-plus" size="small" styleClass="btn-new-project" (onClick)="goToNew()" />
        }
      </div>
      @if (errorMessage()) {
        <p-message severity="error" [text]="errorMessage()" styleClass="mb-3" />
      }
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
        [currentPageReportTemplate]="reportTemplate"
        styleClass="p-datatable-sm"
      >
        <ng-template pTemplate="header">
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Estado</th>
            <th>Cliente</th>
            <th style="width: 10rem">Acciones</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-p>
          <tr>
            <td>{{ p.name }}</td>
            <td>{{ p.category || '-' }}</td>
            <td>{{ p.status }}</td>
            <td>{{ p.client?.name || '-' }}</td>
            <td>
              <p-button icon="pi pi-pencil" [rounded]="true" [text]="true" severity="info" (onClick)="goToEdit(p)" />
              @if (isAdmin()) {
                <p-button icon="pi pi-trash" [rounded]="true" [text]="true" severity="danger" (onClick)="confirmDelete(p)" />
              }
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr><td colspan="5">No hay proyectos.</td></tr>
        </ng-template>
      </p-table>
    </p-card>

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
    :host ::ng-deep .filter-dropdown-min-width { min-width: 12rem; }
    :host ::ng-deep .btn-new-project { padding: 0.4rem 0.75rem; }
    .search-bar {
      flex: 1 1 auto;
      min-width: 12rem;
      max-width: 20rem;
    }
    :host ::ng-deep .search-bar.p-input-icon-left {
      display: block;
    }
    :host ::ng-deep .search-bar .p-inputtext,
    :host ::ng-deep .search-bar input.search-input {
      width: 100%;
      background: var(--p-input-background, #1e2433);
      border: 1px solid var(--p-input-border-color, #495057);
      border-radius: var(--p-border-radius, 6px);
    }
    :host ::ng-deep .search-bar.p-input-icon-left i {
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--p-text-muted-color, #a0aec0);
    }
    :host ::ng-deep .search-bar.p-input-icon-left .p-inputtext {
      padding-left: 2.25rem;
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
  readonly reportTemplate = 'Mostrando {first} a {last} de {totalRecords}';
  readonly firstRowIndex = computed(() => (this.page() - 1) * this.limit());

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
        next: () => {
          this.message.add({ severity: 'success', summary: 'Proyecto creado' });
          this.closeDialog();
          this.fetch();
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
}
