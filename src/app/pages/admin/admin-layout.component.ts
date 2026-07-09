import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ButtonModule, DrawerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#1A1C20] text-white">
      <header class="sticky top-0 z-30 border-b border-[#666666] bg-[#1A1C20]/95 backdrop-blur">
        <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div class="flex min-w-0 items-center gap-3">
            <p-button
              label="Menu"
              icon="pi pi-bars"
              severity="primary"
              size="small"
              type="button"
              ariaLabel="Abrir menu"
              styleClass="rakium-menu-button"
              (onClick)="openMenu()"
            />
            <a [routerLink]="['/admin']" class="flex min-w-0 items-center gap-2 no-underline text-white hover:text-zinc-300">
              <span class="font-mono text-[#639BF0]">&lt;/&gt;</span>
              <span class="truncate text-base font-semibold sm:text-lg">Rakium Dashboard</span>
            </a>
          </div>

          <div class="flex min-w-0 items-center gap-3">
            <span class="hidden max-w-56 truncate text-sm text-[#A0A0A0] sm:block">{{ currentUserEmail() }}</span>
            <p-button
              label="Cerrar sesi&oacute;n"
              icon="pi pi-sign-out"
              severity="danger"
              size="small"
              type="button"
              (onClick)="logout()"
            />
          </div>
        </div>
      </header>

      <p-drawer
        [visible]="menuOpen()"
        (visibleChange)="menuOpen.set($event)"
        position="left"
        header="Menu principal"
        [modal]="true"
        [blockScroll]="true"
        styleClass="rakium-admin-drawer"
      >
        <div class="flex h-full flex-col">
          <div class="mb-4">
            <p class="text-xs uppercase tracking-wide text-[#639BF0]">Admin</p>
            <p class="mt-1 truncate text-sm text-[#A0A0A0]">{{ currentUserEmail() }}</p>
          </div>

          <nav class="flex-1 space-y-1 overflow-y-auto">
            <a
              [routerLink]="['/admin']"
              routerLinkActive="border-[#639BF0] bg-[#639BF0]/15 text-white"
              [routerLinkActiveOptions]="{ exact: true }"
              class="block rounded border border-transparent px-3 py-3 text-sm font-medium text-[#A0A0A0] no-underline hover:bg-[#2C3550] hover:text-white"
              (click)="closeMenu()"
            >
              Dashboard
            </a>
            @if (isAdmin()) {
              <a
                [routerLink]="['/admin/clients']"
                routerLinkActive="border-[#639BF0] bg-[#639BF0]/15 text-white"
                class="block rounded border border-transparent px-3 py-3 text-sm font-medium text-[#A0A0A0] no-underline hover:bg-[#2C3550] hover:text-white"
                (click)="closeMenu()"
              >
                Gesti&oacute;n de clientes
              </a>
              <a
                [routerLink]="['/admin/users']"
                routerLinkActive="border-[#639BF0] bg-[#639BF0]/15 text-white"
                class="block rounded border border-transparent px-3 py-3 text-sm font-medium text-[#A0A0A0] no-underline hover:bg-[#2C3550] hover:text-white"
                (click)="closeMenu()"
              >
                Usuarios
              </a>
              <a
                [routerLink]="['/admin/categories']"
                routerLinkActive="border-[#639BF0] bg-[#639BF0]/15 text-white"
                class="block rounded border border-transparent px-3 py-3 text-sm font-medium text-[#A0A0A0] no-underline hover:bg-[#2C3550] hover:text-white"
                (click)="closeMenu()"
              >
                Categor&iacute;as
              </a>
              <a
                [routerLink]="['/admin/leads']"
                routerLinkActive="border-[#639BF0] bg-[#639BF0]/15 text-white"
                class="block rounded border border-transparent px-3 py-3 text-sm font-medium text-[#A0A0A0] no-underline hover:bg-[#2C3550] hover:text-white"
                (click)="closeMenu()"
              >
                Captaci&oacute;n
              </a>
            }
            <a
              [routerLink]="['/admin/site-settings']"
              routerLinkActive="border-[#639BF0] bg-[#639BF0]/15 text-white"
              class="block rounded border border-transparent px-3 py-3 text-sm font-medium text-[#A0A0A0] no-underline hover:bg-[#2C3550] hover:text-white"
              (click)="closeMenu()"
            >
              Configuraci&oacute;n del sitio
            </a>
            <a
              [routerLink]="['/admin/projects']"
              routerLinkActive="border-[#639BF0] bg-[#639BF0]/15 text-white"
              class="block rounded border border-transparent px-3 py-3 text-sm font-medium text-[#A0A0A0] no-underline hover:bg-[#2C3550] hover:text-white"
              (click)="closeMenu()"
            >
              Proyectos
            </a>
            <a
              [routerLink]="['/']"
              class="block rounded border border-transparent px-3 py-3 text-sm font-medium text-[#A0A0A0] no-underline hover:bg-[#2C3550] hover:text-white"
              (click)="closeMenu()"
            >
              Ir al sitio
            </a>
          </nav>

          <div class="border-t border-[#666666] pt-4">
            <p-button
              label="Cerrar sesi&oacute;n"
              icon="pi pi-sign-out"
              severity="danger"
              styleClass="w-full"
              (onClick)="logout()"
            />
          </div>
        </div>
      </p-drawer>

      <main class="mx-auto max-w-7xl p-4 sm:p-6">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class AdminLayoutComponent {
  readonly authService = inject(AuthService);
  readonly menuOpen = signal(false);
  readonly currentUserEmail = () => this.authService.currentUser()?.email ?? '';
  readonly isAdmin = computed(() => this.authService.currentUser()?.role === 'ADMIN');

  openMenu(): void {
    this.menuOpen.set(true);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
  }
}
