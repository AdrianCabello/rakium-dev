import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ApiService } from '../../core/services/api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface Paginated<T> {
  data: T[];
  total: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <p-card styleClass="shadow-2">
        <div class="flex align-items-center gap-3">
          <div class="flex align-items-center justify-content-center bg-primary-100 text-primary border-round p-3">
            <i class="pi pi-users text-2xl"></i>
          </div>
          <div>
            <span class="text-color-secondary font-medium block">Usuarios</span>
            <span class="text-2xl font-bold text-color">{{ usersCount() }}</span>
          </div>
        </div>
      </p-card>
      <p-card styleClass="shadow-2">
        <div class="flex align-items-center gap-3">
          <div class="flex align-items-center justify-content-center bg-blue-100 text-blue-600 border-round p-3">
            <i class="pi pi-building text-2xl"></i>
          </div>
          <div>
            <span class="text-color-secondary font-medium block">Clientes</span>
            <span class="text-2xl font-bold text-color">{{ clientsCount() }}</span>
          </div>
        </div>
      </p-card>
      <p-card styleClass="shadow-2">
        <div class="flex align-items-center gap-3">
          <div class="flex align-items-center justify-content-center bg-green-100 text-green-600 border-round p-3">
            <i class="pi pi-folder text-2xl"></i>
          </div>
          <div>
            <span class="text-color-secondary font-medium block">Proyectos</span>
            <span class="text-2xl font-bold text-color">{{ projectsCount() }}</span>
          </div>
        </div>
      </p-card>
    </div>
    <p-card header="Actividad reciente" styleClass="mt-6 shadow-2">
      <ul class="list-none p-0 m-0">
        <li class="flex flex-wrap align-items-center justify-content-between py-3 border-bottom-1 surface-border">
          <div>
            <span class="font-medium text-color block">Panel de administración</span>
            <span class="text-color-secondary text-sm">Gestiona usuarios, clientes y proyectos</span>
          </div>
          <p-tag value="Activo" severity="success" />
        </li>
      </ul>
    </p-card>
  `,
  styles: [`:host { display: block; }`],
})
export class AdminDashboardComponent {
  private readonly api = inject(ApiService);

  readonly usersCount = signal(0);
  readonly clientsCount = signal(0);
  readonly projectsCount = signal(0);

  constructor() {
    this.api.get<Paginated<unknown>>('users', { limit: 1 }).pipe(takeUntilDestroyed()).subscribe({
      next: (res: { total?: number }) => this.usersCount.set(res.total ?? 0),
      error: () => {},
    });
    this.api.get<Paginated<unknown>>('clients', { limit: 1 }).pipe(takeUntilDestroyed()).subscribe({
      next: (res: { total?: number }) => this.clientsCount.set(res.total ?? 0),
      error: () => {},
    });
    this.api.get<Paginated<unknown>>('projects', { limit: 1 }).pipe(takeUntilDestroyed()).subscribe({
      next: (res: { total?: number }) => this.projectsCount.set(res.total ?? 0),
      error: () => {},
    });
  }
}
