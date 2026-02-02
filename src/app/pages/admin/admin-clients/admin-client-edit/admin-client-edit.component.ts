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

interface Client {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

@Component({
  selector: 'app-admin-client-edit',
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
    <div class="edit-client-page">
      <div class="flex align-items-center gap-3 mb-4">
        <p-button icon="pi pi-arrow-left" [rounded]="true" [text]="true" [routerLink]="['/admin/clients']" />
        <h1 class="m-0 text-2xl font-semibold text-color">{{ pageTitle() }}</h1>
      </div>

      @if (loading()) {
        <div class="flex justify-content-center align-items-center py-8">
          <p-progressSpinner strokeWidth="4" />
        </div>
      } @else if (errorMessage()) {
        <p-message severity="error" [text]="errorMessage()" styleClass="w-full" />
      } @else {
        <p-card styleClass="shadow-2 form-card">
          <form (ngSubmit)="save()" class="client-form">
            <div class="form-field">
              <label for="name">Nombre</label>
              <input pInputText id="name" [(ngModel)]="form.name" name="name" required class="w-full" />
            </div>
            <div class="form-field">
              <label for="email">Email</label>
              <input pInputText id="email" [(ngModel)]="form.email" name="email" type="email" required class="w-full" />
            </div>
            <div class="form-actions">
              <p-button
                type="submit"
                [label]="isNew() ? 'Crear cliente' : 'Guardar cambios'"
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
    .edit-client-page { max-width: 32rem; margin: 0 auto; }
    :host ::ng-deep .form-card .p-card-body { padding: 1.5rem; }
    :host ::ng-deep .form-card .p-card-content { padding: 0; }
    .client-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-field { display: flex; flex-direction: column; gap: 0.375rem; }
    .form-field label { font-size: 0.8125rem; font-weight: 500; color: #A0A0A0; }
    .form-field input { width: 100%; }
    .form-actions { display: flex; justify-content: flex-end; padding-top: 0.5rem; }
    :host ::ng-deep .w-full { width: 100%; }
  `],
})
export class AdminClientEditComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  private readonly message = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly clientId = computed(() => this.route.snapshot.paramMap.get('id') ?? '');
  readonly isNew = computed(() => this.clientId() === 'new');
  readonly pageTitle = computed(() => (this.isNew() ? 'Nuevo cliente' : 'Editar cliente'));

  readonly client = signal<Client | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly errorMessage = signal('');

  form: { name: string; email: string } = { name: '', email: '' };

  constructor() {
    this.loadClient();
  }

  loadClient(): void {
    const id = this.clientId();
    if (id === 'new') {
      this.client.set(null);
      this.loading.set(false);
      this.errorMessage.set('');
      return;
    }
    if (!id) {
      this.loading.set(false);
      this.errorMessage.set('ID de cliente no válido');
      return;
    }
    this.loading.set(true);
    this.errorMessage.set('');
    this.api
      .get<Client>(`clients/${id}`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (c) => {
          this.client.set(c);
          this.form = { name: c.name ?? '', email: c.email ?? '' };
          this.loading.set(false);
        },
        error: (err) => {
          this.errorMessage.set(err?.error?.message ?? 'Error al cargar el cliente');
          this.loading.set(false);
        },
      });
  }

  save(): void {
    const creating = this.isNew();
    this.saving.set(true);
    if (creating) {
      this.api
        .post<Client>('clients', this.form)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (created) => {
            this.saving.set(false);
            this.message.add({ severity: 'success', summary: 'Cliente creado' });
            if (created?.id) {
              this.router.navigate(['/admin/clients', created.id, 'edit'], { replaceUrl: true });
            } else {
              this.router.navigate(['/admin/clients']);
            }
          },
          error: (err) => {
            this.saving.set(false);
            this.message.add({ severity: 'error', summary: err?.error?.message ?? 'Error al crear' });
          },
        });
    } else {
      this.api
        .patch<Client>(`clients/${this.client()!.id}`, this.form)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (updated) => {
            this.saving.set(false);
            this.client.set(updated);
            this.message.add({ severity: 'success', summary: 'Cliente actualizado' });
          },
          error: (err) => {
            this.saving.set(false);
            this.message.add({ severity: 'error', summary: err?.error?.message ?? 'Error al actualizar' });
          },
        });
    }
  }
}
