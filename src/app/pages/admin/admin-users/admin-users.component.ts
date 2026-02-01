import { Component, inject, signal, computed, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../../core/services/api.service';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';

interface User {
  id: string;
  email: string;
  role: string;
  clientId?: string;
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
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
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
    <p-card header="Usuarios">
      <div class="flex flex-wrap gap-2 mb-4 align-items-center">
        <span class="p-input-icon-left flex-1 min-w-200">
          <i class="pi pi-search"></i>
          <input
            pInputText
            type="text"
            [(ngModel)]="search"
            (ngModelChange)="onSearch()"
            placeholder="Buscar por email..."
            class="w-full"
          />
        </span>
        <p-button label="Nuevo usuario" icon="pi pi-plus" (onClick)="goToNew()" />
      </div>
      @if (errorMessage()) {
        <p-message severity="error" [text]="errorMessage()" styleClass="mb-3" />
      }
      <p-table
        [value]="users()"
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
            <th>Email</th>
            <th>Rol</th>
            <th>Cliente</th>
            <th style="width: 10rem">Acciones</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-u>
          <tr>
            <td>{{ u.email }}</td>
            <td>{{ u.role }}</td>
            <td>{{ u.client?.name || '-' }}</td>
            <td>
              <p-button icon="pi pi-pencil" [rounded]="true" [text]="true" severity="info" (onClick)="goToEdit(u)" />
              <p-button icon="pi pi-trash" [rounded]="true" [text]="true" severity="danger" (onClick)="confirmDelete(u)" />
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr><td colspan="4">No hay usuarios.</td></tr>
        </ng-template>
      </p-table>
    </p-card>
  `,
  styles: [`
    :host { display: block; }
    :host ::ng-deep .w-full { width: 100%; }
    :host ::ng-deep .p-input-icon-left i { top: 50%; transform: translateY(-50%); }
  `],
})
export class AdminUsersComponent {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly confirmation = inject(ConfirmationService);
  private readonly message = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly users = signal<User[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly limit = signal(10);
  search = '';
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly clients = signal<{ id: string; name: string; email: string }[]>([]);
  readonly reportTemplate = 'Mostrando {first} a {last} de {totalRecords}';
  readonly firstRowIndex = computed(() => (this.page() - 1) * this.limit());

  constructor() {
    this.loadClients();
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

  fetch(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.api
      .get<Paginated<User>>('users', { page: this.page(), limit: this.limit(), search: this.search || undefined })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.users.set(res.data);
          this.total.set(res.total);
          this.loading.set(false);
        },
        error: (err) => {
          this.errorMessage.set(err?.error?.message || 'Error al cargar usuarios');
          this.loading.set(false);
        },
      });
  }

  goToNew(): void {
    this.router.navigate(['/admin/users', 'new', 'edit']);
  }

  goToEdit(user: User): void {
    this.router.navigate(['/admin/users', user.id, 'edit']);
  }

  confirmDelete(user: User): void {
    this.confirmation.confirm({
      message: `¿Eliminar usuario ${user.email}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.delete(user),
    });
  }

  delete(user: User): void {
    this.api.delete(`users/${user.id}`).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.message.add({ severity: 'success', summary: 'Usuario eliminado' });
        this.fetch();
      },
      error: (err) => this.message.add({ severity: 'error', summary: err?.error?.message || 'Error al eliminar' }),
    });
  }
}
