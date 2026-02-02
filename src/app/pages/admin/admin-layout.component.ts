import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-zinc-900 text-white">
      <!-- Top Navigation Bar -->
      <div class="bg-zinc-800 border-b border-zinc-700">
        <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <!-- Left: Logo -->
          <div class="flex items-center space-x-3">
            <a [routerLink]="['/admin']" class="flex items-center space-x-2 no-underline text-white hover:text-zinc-300">
              <span class="text-zinc-400">&lt; /&gt;</span>
              <span class="text-lg font-semibold">Rakium Dashboard</span>
            </a>
            <a [routerLink]="['/']" class="ml-4 text-zinc-400 hover:text-white text-sm no-underline">Inicio</a>
          </div>

          <!-- Center: Navigation Tabs -->
          <div class="flex space-x-1">
            <a
              [routerLink]="['/admin']"
              routerLinkActive="bg-blue-600 text-white"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors no-underline"
            >
              Dashboard
            </a>
            @if (isAdmin()) {
              <a
                [routerLink]="['/admin/clients']"
                routerLinkActive="bg-blue-600 text-white"
                class="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors no-underline"
              >
                Gestión de Clientes
              </a>
              <a
                [routerLink]="['/admin/users']"
                routerLinkActive="bg-blue-600 text-white"
                class="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors no-underline"
              >
                Usuarios
              </a>
              <a
                [routerLink]="['/admin/categories']"
                routerLinkActive="bg-blue-600 text-white"
                class="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors no-underline"
              >
                Categorías
              </a>
            }
            <a
              [routerLink]="['/admin/projects']"
              routerLinkActive="bg-blue-600 text-white"
              class="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors no-underline"
            >
              Proyectos
            </a>
          </div>

          <!-- Right: User and Logout -->
          <div class="flex items-center space-x-4">
            <span class="text-sm text-zinc-400">{{ currentUserEmail() }}</span>
            <button
              (click)="logout()"
              class="flex items-center space-x-2 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
            >
              <span>Cerrar Sesión</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <main class="max-w-7xl mx-auto p-6">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class AdminLayoutComponent {
  readonly authService = inject(AuthService);
  readonly currentUserEmail = () => this.authService.currentUser()?.email ?? '';
  readonly isAdmin = computed(() => this.authService.currentUser()?.role === 'ADMIN');

  logout(): void {
    this.authService.logout();
  }
}
