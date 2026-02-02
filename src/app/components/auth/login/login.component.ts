import { Component, inject, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MessageModule } from 'primeng/message';
import { LucideAngularModule, Eye, EyeOff, Loader2 } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MessageModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
          <!-- Header with gradient background -->
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 text-center">
            <div class="flex items-center justify-center">
              <img src="/assets/logos/Logotipo - Blanco.svg" alt="Rakium Logo" class="h-12 w-auto" />
            </div>
          </div>

          <!-- Form -->
          <div class="p-8 pb-10">
            <form (ngSubmit)="onSubmit()" class="space-y-6">
              <!-- Email -->
              <div class="space-y-2">
                <label for="email" class="block text-sm font-semibold text-slate-200">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@rakium.com"
                  [(ngModel)]="email"
                  name="email"
                  required
                  class="w-full px-4 py-3 bg-slate-700/60 border border-slate-500/50 rounded-xl text-white placeholder-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 transition-all duration-200"
                />
              </div>

              <!-- Password -->
              <div class="space-y-2">
                <label for="password" class="block text-sm font-semibold text-slate-200">
                  Contraseña
                </label>
                <div class="relative">
                  <input
                    id="password"
                    [type]="showPassword() ? 'text' : 'password'"
                    placeholder="••••••••"
                    [(ngModel)]="password"
                    name="password"
                    required
                    class="w-full px-4 py-3 pr-12 bg-slate-700/60 border border-slate-500/50 rounded-xl text-white placeholder-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 transition-all duration-200"
                  />
                  <button
                    type="button"
                    class="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                    (click)="toggleShowPassword()"
                    [attr.aria-label]="showPassword() ? 'Ocultar contraseña' : 'Ver contraseña'"
                    tabindex="-1"
                  >
                    <lucide-icon [name]="showPassword() ? eyeOffIcon : eyeIcon" size="20"></lucide-icon>
                  </button>
                </div>
              </div>

              <!-- Error Message -->
              @if (errorMessage()) {
                <p-message
                  [text]="errorMessage()"
                  severity="error"
                  styleClass="w-full !bg-red-900/20 !border-red-800 !text-red-200 rounded-xl"
                />
              }

              <!-- Submit Button -->
              <button
                type="submit"
                [disabled]="loading()"
                class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center mt-2 disabled:cursor-not-allowed"
              >
                @if (!loading()) {
                  <span>Iniciar Sesión</span>
                } @else {
                  <span class="flex items-center">
                    <lucide-icon [name]="loaderIcon" size="20" class="animate-spin mr-2"></lucide-icon>
                    Iniciando sesión...
                  </span>
                }
              </button>
            </form>

            <!-- Footer -->
            <div class="mt-8 text-center">
              <p class="text-sm text-slate-400">
                © 2024 Rakium. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  email = '';
  password = '';
  readonly showPassword = signal(false);
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  readonly eyeIcon = Eye;
  readonly eyeOffIcon = EyeOff;
  readonly loaderIcon = Loader2;

  constructor() {
    effect(() => {
      if (this.authService.isLoggedIn()) {
        this.router.navigate(['/admin']);
      }
    }, { allowSignalWrites: false });
  }

  toggleShowPassword(): void {
    this.showPassword.update((v) => !v);
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
        this.errorMessage.set(err?.error?.message || (err?.status === 401 ? 'Credenciales inválidas' : 'Error al iniciar sesión'));
      },
    });
  }
}
