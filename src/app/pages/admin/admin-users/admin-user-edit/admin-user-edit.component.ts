import { Component, inject, signal, computed, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../../../core/services/api.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

const USER_ROLES = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Admin Cliente', value: 'CLIENT_ADMIN' },
  { label: 'Cliente', value: 'CLIENT' },
];

interface User {
  id: string;
  email: string;
  role: string;
  clientId?: string;
  client?: { id: string; name: string; email: string };
  createdAt?: string;
}

interface Paginated<T> {
  data: T[];
}

@Component({
  selector: 'app-admin-user-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CardModule,
    MessageModule,
    ToastModule,
    ProgressSpinnerModule,
  ],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-toast />
    <div class="edit-user-page">
      <div class="flex align-items-center gap-3 mb-4">
        <p-button icon="pi pi-arrow-left" [rounded]="true" [text]="true" [routerLink]="['/admin/users']" />
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
          <form (ngSubmit)="save()" class="user-form">
            <div class="form-field">
              <label for="email">Email</label>
              <input
                pInputText
                id="email"
                [(ngModel)]="form.email"
                name="email"
                type="email"
                required
                [disabled]="!isNew()"
                class="w-full"
              />
              @if (!isNew()) {
                <small class="text-muted">El email no se puede modificar</small>
              }
            </div>
            <div class="form-field">
              <label for="password">Contraseña</label>
              <input
                pInputText
                id="password"
                [(ngModel)]="form.password"
                name="password"
                type="password"
                [required]="isNew()"
                class="w-full"
              />
              @if (!isNew()) {
                <small class="text-muted">Dejar en blanco para no cambiar</small>
              }
            </div>
            <div class="form-field">
              <label for="role">Rol</label>
              <p-dropdown
                id="role"
                [options]="userRoles"
                [(ngModel)]="form.role"
                name="role"
                optionLabel="label"
                optionValue="value"
                styleClass="w-full"
              />
            </div>
            <div class="form-field">
              <label for="clientId">Cliente (opcional)</label>
              <p-dropdown
                id="clientId"
                [options]="clients()"
                [(ngModel)]="form.clientId"
                name="clientId"
                optionLabel="name"
                optionValue="id"
                [showClear]="true"
                placeholder="Sin cliente"
                styleClass="w-full"
              />
            </div>
            <div class="form-actions">
              <p-button
                type="submit"
                [label]="isNew() ? 'Crear usuario' : 'Guardar cambios'"
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
    .edit-user-page { max-width: 32rem; margin: 0 auto; }
    :host ::ng-deep .form-card .p-card-body { padding: 1.5rem; }
    :host ::ng-deep .form-card .p-card-content { padding: 0; }
    .user-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-field { display: flex; flex-direction: column; gap: 0.375rem; }
    .form-field label { font-size: 0.8125rem; font-weight: 500; color: #A0A0A0; }
    .form-field input, :host ::ng-deep .form-field .p-dropdown { width: 100%; }
    .text-muted { font-size: 0.75rem; color: #A0A0A0; }
    .form-actions { display: flex; justify-content: flex-end; padding-top: 0.5rem; }
    :host ::ng-deep .w-full { width: 100%; }
  `],
})
export class AdminUserEditComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  private readonly message = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly userId = computed(() => this.route.snapshot.paramMap.get('id') ?? '');
  readonly isNew = computed(() => this.userId() === 'new');
  readonly pageTitle = computed(() => (this.isNew() ? 'Nuevo usuario' : 'Editar usuario'));

  readonly user = signal<User | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly clients = signal<{ id: string; name: string; email: string }[]>([]);

  protected readonly userRoles = USER_ROLES;

  form: { email: string; password: string; role: string; clientId?: string } = {
    email: '',
    password: '',
    role: 'CLIENT',
  };

  constructor() {
    this.loadUser();
    this.loadClients();
  }

  loadUser(): void {
    const id = this.userId();
    if (id === 'new') {
      this.user.set(null);
      this.loading.set(false);
      this.errorMessage.set('');
      return;
    }
    if (!id) {
      this.loading.set(false);
      this.errorMessage.set('ID de usuario no válido');
      return;
    }
    this.loading.set(true);
    this.errorMessage.set('');
    this.api
      .get<User>(`users/${id}`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (u) => {
          this.user.set(u);
          this.form = {
            email: u.email ?? '',
            password: '',
            role: u.role ?? 'CLIENT',
            clientId: u.clientId ?? undefined,
          };
          this.loading.set(false);
        },
        error: (err) => {
          this.errorMessage.set(err?.error?.message ?? 'Error al cargar el usuario');
          this.loading.set(false);
        },
      });
  }

  loadClients(): void {
    this.api
      .get<Paginated<{ id: string; name: string; email: string }>>('clients', { limit: 100 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => this.clients.set(res.data),
        error: () => {},
      });
  }

  save(): void {
    const creating = this.isNew();
    this.saving.set(true);
    if (creating) {
      this.api
        .post<User>('users', {
          email: this.form.email,
          password: this.form.password,
          role: this.form.role,
          clientId: this.form.clientId ?? null,
        })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (created) => {
            this.saving.set(false);
            this.message.add({ severity: 'success', summary: 'Usuario creado' });
            if (created?.id) {
              this.router.navigate(['/admin/users', created.id, 'edit'], { replaceUrl: true });
            } else {
              this.router.navigate(['/admin/users']);
            }
          },
          error: (err) => {
            this.saving.set(false);
            this.message.add({ severity: 'error', summary: err?.error?.message ?? 'Error al crear' });
          },
        });
    } else {
      const payload: Record<string, unknown> = {
        role: this.form.role,
        clientId: this.form.clientId ?? null,
      };
      if (this.form.password) payload['password'] = this.form.password;
      this.api
        .patch<User>(`users/${this.user()!.id}`, payload)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (updated) => {
            this.saving.set(false);
            this.user.set(updated);
            this.message.add({ severity: 'success', summary: 'Usuario actualizado' });
          },
          error: (err) => {
            this.saving.set(false);
            this.message.add({ severity: 'error', summary: err?.error?.message ?? 'Error al actualizar' });
          },
        });
    }
  }
}
