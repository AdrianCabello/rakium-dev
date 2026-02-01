import { Component, inject, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../../core/services/api.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';

interface Category {
  id: string;
  name: string;
  value: string;
  orderNum: number;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-admin-categories',
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
    CardModule,
  ],
  providers: [ConfirmationService, MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-toast />
    <p-confirmDialog />
    <p-card header="Categorías">
      <div class="flex flex-wrap gap-2 mb-4 align-items-center">
        <p-button label="Nueva categoría" icon="pi pi-plus" (onClick)="goToNew()" />
      </div>
      @if (errorMessage()) {
        <p-message severity="error" [text]="errorMessage()" styleClass="mb-3" />
      }
      <p-table
        [value]="categories()"
        [loading]="loading()"
        styleClass="p-datatable-sm"
      >
        <ng-template pTemplate="header">
          <tr>
            <th>Orden</th>
            <th>Nombre</th>
            <th>Valor</th>
            <th style="width: 10rem">Acciones</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-c>
          <tr>
            <td>{{ c.orderNum }}</td>
            <td>{{ c.name }}</td>
            <td>{{ c.value }}</td>
            <td>
              <p-button icon="pi pi-pencil" [rounded]="true" [text]="true" severity="info" (onClick)="goToEdit(c)" />
              <p-button icon="pi pi-trash" [rounded]="true" [text]="true" severity="danger" (onClick)="confirmDelete(c)" />
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr><td colspan="4">No hay categorías.</td></tr>
        </ng-template>
      </p-table>
    </p-card>
  `,
  styles: [`:host { display: block; }`],
})
export class AdminCategoriesComponent {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly confirmation = inject(ConfirmationService);
  private readonly message = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly categories = signal<Category[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  constructor() {
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.api
      .get<Category[]>('categories')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (list) => {
          this.categories.set(Array.isArray(list) ? list : (list as any)?.data ?? []);
          this.loading.set(false);
        },
        error: (err) => {
          this.errorMessage.set(err?.error?.message ?? 'Error al cargar categorías');
          this.loading.set(false);
        },
      });
  }

  goToNew(): void {
    this.router.navigate(['/admin/categories', 'new', 'edit']);
  }

  goToEdit(cat: Category): void {
    this.router.navigate(['/admin/categories', cat.id, 'edit']);
  }

  confirmDelete(cat: Category): void {
    this.confirmation.confirm({
      message: `¿Eliminar categoría "${cat.name}"? Los proyectos con esta categoría quedarán sin categoría.`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.delete(cat),
    });
  }

  delete(cat: Category): void {
    this.api
      .delete(`categories/${cat.id}`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.message.add({ severity: 'success', summary: 'Categoría eliminada' });
          this.fetch();
        },
        error: (err) =>
          this.message.add({ severity: 'error', summary: err?.error?.message ?? 'Error al eliminar' }),
      });
  }
}
