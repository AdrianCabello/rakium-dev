import { Component, inject, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CardModule,
    ButtonModule,
    InputTextModule,
    MessageModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="login-screen surface-ground">
      <div class="login-card-wrapper">
        <p-card styleClass="shadow-4 login-card">
          <ng-template pTemplate="header">
            <div class="text-center pt-4">
              <h2 class="m-0 text-3xl font-bold text-color">Iniciar sesión</h2>
              <p class="text-color-secondary mt-2 mb-0">Accede al panel de administración</p>
            </div>
          </ng-template>
          @if (errorMessage()) {
            <p-message severity="error" [text]="errorMessage()" styleClass="w-full mb-3" />
          }
          <form (ngSubmit)="onSubmit()" class="login-form">
            <div class="login-field">
              <label for="email" class="font-medium text-color">Email</label>
              <input
                pInputText
                id="email"
                type="email"
                [(ngModel)]="email"
                name="email"
                required
                placeholder="Email"
                class="w-full block"
              />
            </div>
            <div class="login-field">
              <label for="password" class="font-medium text-color">Contraseña</label>
              <div class="password-input-wrapper">
                <input
                  pInputText
                  id="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  [(ngModel)]="password"
                  name="password"
                  required
                  placeholder="Contraseña"
                  class="w-full block"
                />
                <button
                  type="button"
                  class="password-toggle"
                  (click)="toggleShowPassword()"
                  [attr.aria-label]="showPassword() ? 'Ocultar contraseña' : 'Ver contraseña'"
                  tabindex="-1"
                >
                  <i [class]="showPassword() ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                </button>
              </div>
            </div>
            <p-button
              type="submit"
              label="Iniciar sesión"
              icon="pi pi-sign-in"
              [loading]="loading()"
              [disabled]="loading()"
              styleClass="w-full block"
            />
          </form>
          <ng-template pTemplate="footer">
            <div class="text-center">
              <a [routerLink]="['/']" class="text-primary hover:underline cursor-pointer">Volver al inicio</a>
            </div>
          </ng-template>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .login-screen {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .login-card-wrapper {
      width: 100%;
      max-width: 28rem;
    }
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      width: 100%;
    }
    .login-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
    }
    .login-field input,
    .login-form .p-button {
      width: 100%;
      box-sizing: border-box;
    }
    .password-input-wrapper {
      position: relative;
      display: flex;
      width: 100%;
    }
    .password-input-wrapper input {
      padding-right: 2.5rem;
    }
    .password-toggle {
      position: absolute;
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--p-text-muted-color, #A0A0A0);
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .password-toggle:hover {
      color: var(--p-primary-color, #639BF0);
    }
    .password-toggle i {
      font-size: 1rem;
    }
  `]
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  email = '';
  password = '';
  readonly showPassword = signal(false);
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  constructor() {
    effect(() => {
      if (this.authService.isLoggedIn()) {
        this.router.navigate(['/admin']);
      }
    }, { allowSignalWrites: false });
  }

  toggleShowPassword(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.loading.set(true);
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.error?.message || err?.status === 401 ? 'Credenciales inválidas' : 'Error al iniciar sesión');
      },
    });
  }
}
