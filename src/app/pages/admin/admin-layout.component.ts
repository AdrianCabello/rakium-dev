import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, MenubarModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen surface-ground">
      <p-menubar [model]="menuItems()" [styleClass]="'border-none rounded-none shadow-sm'">
        <ng-template pTemplate="start">
          <a [routerLink]="['/admin']" class="font-bold text-xl text-primary no-underline">Rakium Admin</a>
          <a [routerLink]="['/']" class="ml-4 p-menubar-item-link flex align-items-center cursor-pointer text-color hover:text-primary no-underline">
            Inicio
          </a>
        </ng-template>
        <ng-template pTemplate="end">
          <span class="text-color-secondary mr-3">{{ currentUserEmail() }}</span>
          <p-button label="Cerrar sesión" icon="pi pi-sign-out" severity="danger" (onClick)="logout()" />
        </ng-template>
      </p-menubar>

      <main class="p-4 md:p-6 max-w-7xl mx-auto">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class AdminLayoutComponent {
  readonly authService = inject(AuthService);
  readonly currentUserEmail = () => this.authService.currentUser()?.email ?? '';

  readonly menuItems = computed(() => {
    const role = this.authService.currentUser()?.role;
    const isAdmin = role === 'ADMIN';
    const base = [
      { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/admin' },
      { label: 'Proyectos', icon: 'pi pi-folder', routerLink: '/admin/projects' },
    ];
    if (isAdmin) {
      return [
        { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/admin' },
        { label: 'Usuarios', icon: 'pi pi-users', routerLink: '/admin/users' },
        { label: 'Clientes', icon: 'pi pi-building', routerLink: '/admin/clients' },
        { label: 'Categorías', icon: 'pi pi-tags', routerLink: '/admin/categories' },
        { label: 'Proyectos', icon: 'pi pi-folder', routerLink: '/admin/projects' },
      ];
    }
    return base;
  });

  logout(): void {
    this.authService.logout();
  }
}
