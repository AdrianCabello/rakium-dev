import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { LucideAngularModule, ArrowLeft, Loader2, Mail } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 text-center">
            <div class="flex items-center justify-center">
              <img src="/assets/logos/Logotipo - Blanco.svg" alt="Rakium Logo" class="h-12 w-auto" />
            </div>
          </div>

          <div class="p-8 pb-10">
            <a routerLink="/login" class="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors mb-6">
              <lucide-icon [name]="arrowLeftIcon" size="18"></lucide-icon>
              Volver al login
            </a>

            <div class="space-y-2 mb-8">
              <h1 class="text-2xl font-semibold text-white">Recuperar contraseña</h1>
              <p class="text-sm text-slate-400">Ingresá tu email y te mandamos un link para crear una nueva contraseña.</p>
            </div>

            <form (ngSubmit)="onSubmit()" class="space-y-6">
              <div class="space-y-2">
                <label for="email" class="block text-sm font-semibold text-slate-200">Email</label>
                <div class="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    [(ngModel)]="email"
                    name="email"
                    required
                    class="w-full px-4 py-3 pr-12 bg-slate-700/60 border border-slate-500/50 rounded-xl text-white placeholder-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 transition-all duration-200"
                  />
                  <lucide-icon [name]="mailIcon" size="20" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"></lucide-icon>
                </div>
              </div>

              @if (message()) {
                <div class="rounded-xl border border-emerald-700/70 bg-emerald-900/20 px-4 py-3 text-sm text-emerald-100">
                  {{ message() }}
                </div>
              }

              @if (errorMessage()) {
                <div class="rounded-xl border border-red-800 bg-red-900/20 px-4 py-3 text-sm text-red-200">
                  {{ errorMessage() }}
                </div>
              }

              <button
                type="submit"
                [disabled]="loading() || !email"
                class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center mt-2 disabled:cursor-not-allowed"
              >
                @if (!loading()) {
                  <span>Enviar link</span>
                } @else {
                  <span class="flex items-center">
                    <lucide-icon [name]="loaderIcon" size="20" class="animate-spin mr-2"></lucide-icon>
                    Enviando...
                  </span>
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class ForgotPasswordComponent {
  private readonly authService = inject(AuthService);

  email = '';
  readonly loading = signal(false);
  readonly message = signal('');
  readonly errorMessage = signal('');

  readonly arrowLeftIcon = ArrowLeft;
  readonly loaderIcon = Loader2;
  readonly mailIcon = Mail;

  onSubmit(): void {
    if (!this.email || this.loading()) return;

    this.loading.set(true);
    this.message.set('');
    this.errorMessage.set('');

    this.authService
      .forgotPassword(this.email)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => this.message.set(response.message),
        error: () => this.errorMessage.set('No pudimos enviar el email. Intentá nuevamente.'),
      });
  }
}
