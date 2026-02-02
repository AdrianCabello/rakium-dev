import { Component, inject, signal, computed, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

interface Project {
  id: string;
  name: string;
  type?: string;
  status: string;
  category?: string;
  description?: string;
  clientId: string;
  client?: { id: string; name: string; email: string };
}

interface Paginated<T> {
  data: T[];
  total: number;
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Borrador',
  PUBLISHED: 'Publicado',
  PENDING: 'Pendiente',
};

const TYPE_LABELS: Record<string, string> = {
  LANDING: 'Landing Page',
  ECOMMERCE: 'E-commerce',
  INMOBILIARIA: 'Inmobiliaria',
  CUSTOM: 'Personalizado',
  PORTFOLIO: 'Portfolio',
  BLOG: 'Blog',
  CORPORATIVO: 'Corporativo',
  ONE_PAGE: 'One Page',
};

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Dashboard Administrativo</h1>
        <p class="text-zinc-400">Bienvenido, {{ currentUserEmail() }} - Gestiona tus proyectos y clientes de manera eficiente</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Proyectos Activos -->
        <div class="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-zinc-400 text-sm">Proyectos Activos</p>
              <p class="text-2xl font-bold text-blue-400">{{ stats().activeProjects }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path>
              </svg>
            </div>
          </div>
        </div>

        @if (!isClientAdmin()) {
          <!-- Clientes Activos -->
          <div class="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-zinc-400 text-sm">Clientes Activos</p>
                <p class="text-2xl font-bold text-green-400">{{ stats().activeClients }}</p>
              </div>
              <div class="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        }

        <!-- Borradores -->
        <div class="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-zinc-400 text-sm">Borradores</p>
              <p class="text-2xl font-bold text-orange-400">{{ stats().drafts }}</p>
            </div>
            <div class="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Sitios Publicados -->
        <div class="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-zinc-400 text-sm">Sitios Publicados</p>
              <p class="text-2xl font-bold text-green-400">{{ stats().publishedSites }}</p>
            </div>
            <div class="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Projects Section -->
      <div class="bg-zinc-800 rounded-lg border border-zinc-700">
        <div class="p-6 border-b border-zinc-700">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="relative">
                <input
                  type="text"
                  [(ngModel)]="search"
                  (ngModelChange)="onSearch()"
                  placeholder="Buscar proyectos..."
                  class="pl-10 pr-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            <a
              [routerLink]="['/admin/projects', 'new', 'edit']"
              class="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors no-underline"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span>Nuevo Proyecto</span>
            </a>
          </div>
        </div>

        <!-- Projects Grid -->
        <div class="p-6">
          @if (loading()) {
            <div class="flex justify-center py-12">
              <div class="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent"></div>
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (p of projects(); track p.id) {
                <div class="bg-zinc-700 rounded-lg p-4 border border-zinc-600">
                  <div class="flex items-start justify-between mb-3">
                    <h3 class="font-semibold text-white">{{ p.name }}</h3>
                    <div class="flex flex-wrap gap-1 justify-end">
                      <span
                        class="px-2 py-1 text-xs rounded"
                        [ngClass]="{
                          'bg-yellow-600/20 text-yellow-400': p.status === 'DRAFT',
                          'bg-green-600/20 text-green-400': p.status === 'PUBLISHED',
                          'bg-orange-600/20 text-orange-400': p.status === 'PENDING'
                        }"
                      >
                        {{ getStatusLabel(p.status) }}
                      </span>
                      @if (p.type || p.category) {
                        <span class="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded">
                          {{ getTypeLabel(p.type || p.category || '') }}
                        </span>
                      }
                    </div>
                  </div>
                  <p class="text-zinc-400 text-sm mb-3 line-clamp-3">{{ p.description || 'Sin descripción' }}</p>
                  <div class="flex items-center justify-between">
                    <span class="text-zinc-500 text-xs">Asignado a: {{ p.client?.name || '-' }}</span>
                    <a
                      [routerLink]="['/admin/projects', p.id, 'edit']"
                      class="flex items-center space-x-1 px-3 py-1 bg-zinc-600 hover:bg-zinc-500 text-white text-xs rounded transition-colors no-underline"
                    >
                      <span>Editar</span>
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              }
              @empty {
                <div class="col-span-full text-center py-12 text-zinc-400">No hay proyectos.</div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  `],
})
export class AdminDashboardComponent {
  private readonly api = inject(ApiService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  readonly currentUserEmail = () => this.authService.currentUser()?.email ?? '';
  readonly isClientAdmin = computed(() => {
    const u = this.authService.currentUser();
    return u?.role === 'CLIENT_ADMIN' && !!u?.clientId;
  });

  readonly stats = signal({
    activeProjects: 0,
    activeClients: 0,
    drafts: 0,
    publishedSites: 0,
  });

  readonly projects = signal<Project[]>([]);
  readonly loading = signal(true);
  search = '';

  constructor() {
    this.loadStats();
    this.loadProjects();
  }

  private loadStats(): void {
    const user = this.authService.currentUser();
    const isClientAdmin = user?.role === 'CLIENT_ADMIN' && user?.clientId;
    const projectParams: Record<string, string | number | undefined> = { limit: 500 };
    if (isClientAdmin) {
      projectParams['clientId'] = user.clientId!;
    }
    this.api.get<Paginated<Project>>('projects', projectParams).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        const data = res.data ?? [];
        const drafts = data.filter((p: Project) => p.status === 'DRAFT').length;
        const published = data.filter((p: Project) => p.status === 'PUBLISHED').length;
        this.stats.update((s) => ({
          ...s,
          activeProjects: res.total ?? data.length,
          drafts,
          publishedSites: published,
        }));
      },
      error: () => {},
    });
    if (!isClientAdmin) {
      this.api.get<{ total?: number }>('clients', { limit: 1 }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          this.stats.update((s) => ({ ...s, activeClients: res.total ?? 0 }));
        },
        error: () => {},
      });
    } else {
      this.stats.update((s) => ({ ...s, activeClients: 1 }));
    }
  }

  private loadProjects(): void {
    this.loading.set(true);
    const user = this.authService.currentUser();
    const isClientAdmin = user?.role === 'CLIENT_ADMIN' && user?.clientId;
    const params: Record<string, string | number | undefined> = { limit: 50, search: this.search || undefined };
    if (isClientAdmin) {
      params['clientId'] = user.clientId!;
    }
    this.api
      .get<Paginated<Project>>('projects', params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.projects.set(res.data ?? []);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  onSearch(): void {
    this.loadProjects();
  }

  getStatusLabel(status: string): string {
    return STATUS_LABELS[status] ?? status;
  }

  getTypeLabel(type: string): string {
    return TYPE_LABELS[type] ?? type;
  }
}
