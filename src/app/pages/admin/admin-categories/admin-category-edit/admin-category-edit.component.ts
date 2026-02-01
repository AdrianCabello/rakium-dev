import { Component, inject, signal, computed, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../../../core/services/api.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

interface Category {
  id: string;
  name: string;
  value: string;
  orderNum: number;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-admin-category-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    CardModule,
    MessageModule,
    ToastModule,
    ProgressSpinnerModule,
  ],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-toast />
    <div class="edit-category-page">
      <div class="flex align-items-center gap-3 mb-4">
        <p-button icon="pi pi-arrow-left" [rounded]="true" [text]="true" [routerLink]="['/admin/categories']" />
        <h1 class="m-0 text-2xl font-semibold text-color">{{ pageTitle() }}</h1>
      </div>

      @if (loading()) {
        <div class="flex justify-content-center align-items-center py-8">
          <p-progressSpinner strokeWidth="4" />
        </div>
      } @else if (errorMessage()) {
        <p-message severity="error" [text]="errorMessage()" styleClass="w-full" />
      } @else {
        <p-card styleClass="form-card">
          <form (ngSubmit)="save()" class="category-form">
            <div class="form-field">
              <label for="name">Nombre</label>
              <input pInputText id="name" [(ngModel)]="form.name" name="name" required placeholder="Ej. Estaciones" class="w-full" />
            </div>
            <div class="form-field">
              <label for="value">Valor (slug, único)</label>
              <input pInputText id="value" [(ngModel)]="form.value" name="value" required placeholder="Ej. ESTACIONES" class="w-full" [disabled]="!isNew()" />
              @if (!isNew()) {
                <small class="text-muted">El valor no se puede modificar</small>
              }
            </div>
            <div class="form-field">
              <label for="orderNum">Orden</label>
              <input type="number" id="orderNum" [(ngModel)]="form.orderNum" name="orderNum" min="0" class="w-full" />
            </div>
            <div class="form-actions">
              <p-button
                type="submit"
                [label]="isNew() ? 'Crear categoría' : 'Guardar cambios'"
                icon="pi pi-check"
                [loading]="saving()"
                [disabled]="saving()"
              />
            </div>
          </form>
        </p-card>
      }
    </div>
  `,
  styles: [`
    .edit-category-page { max-width: 32rem; margin: 0 auto; }
    :host ::ng-deep .form-card .p-card-body { padding: 1.5rem; }
    :host ::ng-deep .form-card .p-card-content { padding: 0; }
    .category-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-field { display: flex; flex-direction: column; gap: 0.375rem; }
    .form-field label { font-size: 0.8125rem; font-weight: 500; color: var(--p-text-muted-color); }
    .form-field input { width: 100%; }
    .text-muted { font-size: 0.75rem; color: var(--p-text-muted-color); }
    .form-actions { display: flex; justify-content: flex-end; padding-top: 0.5rem; }
    :host ::ng-deep .w-full { width: 100%; }
  `],
})
export class AdminCategoryEditComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  private readonly message = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly categoryId = computed(() => this.route.snapshot.paramMap.get('id') ?? '');
  readonly isNew = computed(() => this.categoryId() === 'new');
  readonly pageTitle = computed(() => (this.isNew() ? 'Nueva categoría' : 'Editar categoría'));

  readonly category = signal<Category | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly errorMessage = signal('');

  form: { name: string; value: string; orderNum: number } = { name: '', value: '', orderNum: 0 };

  constructor() {
    this.loadCategory();
  }

  loadCategory(): void {
    const id = this.categoryId();
    if (id === 'new') {
      this.category.set(null);
      this.loading.set(false);
      this.errorMessage.set('');
      return;
    }
    if (!id) {
      this.loading.set(false);
      this.errorMessage.set('ID de categoría no válido');
      return;
    }
    this.loading.set(true);
    this.errorMessage.set('');
    this.api
      .get<Category>(`categories/${id}`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (c) => {
          this.category.set(c);
          this.form = {
            name: c.name ?? '',
            value: c.value ?? '',
            orderNum: c.orderNum ?? 0,
          };
          this.loading.set(false);
        },
        error: (err) => {
          this.errorMessage.set(err?.error?.message ?? 'Error al cargar la categoría');
          this.loading.set(false);
        },
      });
  }

  save(): void {
    const creating = this.isNew();
    this.saving.set(true);
    if (creating) {
      this.api
        .post<Category>('categories', {
          name: this.form.name,
          value: this.form.value,
          orderNum: this.form.orderNum,
        })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (created) => {
            this.saving.set(false);
            this.message.add({ severity: 'success', summary: 'Categoría creada' });
            if (created?.id) {
              this.router.navigate(['/admin/categories', created.id, 'edit'], { replaceUrl: true });
            } else {
              this.router.navigate(['/admin/categories']);
            }
          },
          error: (err) => {
            this.saving.set(false);
            this.message.add({ severity: 'error', summary: err?.error?.message ?? 'Error al crear' });
          },
        });
    } else {
      this.api
        .patch<Category>(`categories/${this.category()!.id}`, {
          name: this.form.name,
          orderNum: this.form.orderNum,
        })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (updated) => {
            this.saving.set(false);
            this.category.set(updated);
            this.message.add({ severity: 'success', summary: 'Categoría actualizada' });
          },
          error: (err) => {
            this.saving.set(false);
            this.message.add({ severity: 'error', summary: err?.error?.message ?? 'Error al actualizar' });
          },
        });
    }
  }
}
