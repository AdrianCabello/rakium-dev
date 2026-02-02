import { Component, inject, signal, computed, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../../core/services/api.service';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';

interface Client {
  id: string;
  name: string;
  email: string;
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
  selector: 'app-admin-clients',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    MessageModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    CardModule,
  ],
  providers: [ConfirmationService, MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-toast />
    <p-confirmDialog />
    <p-card header="Clientes">
      <div class="flex flex-wrap gap-2 mb-4 align-items-center">
        <span class="p-input-icon-left flex-1 min-w-200">
          <i class="pi pi-search"></i>
          <input
            pInputText
            type="text"
            [(ngModel)]="search"
            (ngModelChange)="onSearch()"
            placeholder="Buscar por nombre o email..."
            class="w-full"
          />
        </span>
        <p-button label="Nuevo cliente" icon="pi pi-plus" (onClick)="goToNew()" />
      </div>
      @if (errorMessage()) {
        <p-message severity="error" [text]="errorMessage()" styleClass="mb-3" />
      }
      <p-table
        [value]="clients()"
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
            <th>Email</th>
            <th style="width: 10rem">Acciones</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-c>
          <tr>
            <td>{{ c.name }}</td>
            <td>{{ c.email }}</td>
            <td>
              <p-button icon="pi pi-copy" [rounded]="true" [text]="true" pTooltip="Copiar ID" (onClick)="copyClientId(c)" />
              <p-button icon="pi pi-pencil" [rounded]="true" [text]="true" severity="info" (onClick)="goToEdit(c)" />
              <p-button icon="pi pi-trash" [rounded]="true" [text]="true" severity="danger" (onClick)="confirmDelete(c)" />
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr><td colspan="3">No hay clientes.</td></tr>
        </ng-template>
      </p-table>
    </p-card>
  `,
  styles: [`
    :host { display: block; }
    :host ::ng-deep .p-input-icon-left i { top: 50%; transform: translateY(-50%); }
  `],
})
export class AdminClientsComponent {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly confirmation = inject(ConfirmationService);
  private readonly message = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly clients = signal<Client[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly limit = signal(10);
  search = '';
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly reportTemplate = 'Mostrando {first} a {last} de {totalRecords}';
  readonly firstRowIndex = computed(() => (this.page() - 1) * this.limit());

  constructor() {
    this.fetch();
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
      .get<Paginated<Client>>('clients', { page: this.page(), limit: this.limit(), search: this.search || undefined })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.clients.set(res.data);
          this.total.set(res.total);
          this.loading.set(false);
        },
        error: (err) => {
          this.errorMessage.set(err?.error?.message || 'Error al cargar clientes');
          this.loading.set(false);
        },
      });
  }

  goToNew(): void {
    this.router.navigate(['/admin/clients', 'new', 'edit']);
  }

  goToEdit(client: Client): void {
    this.router.navigate(['/admin/clients', client.id, 'edit']);
  }

  copyClientId(client: Client): void {
    navigator.clipboard.writeText(client.id).then(
      () => this.message.add({ severity: 'success', summary: 'ID copiado', detail: client.id }),
      () => this.message.add({ severity: 'error', summary: 'No se pudo copiar' })
    );
  }

  confirmDelete(client: Client): void {
    this.confirmation.confirm({
      message: `¿Eliminar cliente ${client.name}? Se eliminarán también sus proyectos.`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.delete(client),
    });
  }

  delete(client: Client): void {
    this.api.delete(`clients/${client.id}`).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.message.add({ severity: 'success', summary: 'Cliente eliminado' });
        this.fetch();
      },
      error: (err) => this.message.add({ severity: 'error', summary: err?.error?.message || 'Error al eliminar' }),
    });
  }
}
