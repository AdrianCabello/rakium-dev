import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MenubarModule,
    CardModule,
    ButtonModule,
    TagModule,
  ],
  template: `
    <div class="min-h-screen surface-ground">
      <p-menubar [model]="menuItems" [styleClass]="'border-none rounded-none shadow-sm'">
        <ng-template pTemplate="start">
          <span class="font-bold text-xl text-primary">Rakium Admin</span>
          <a [routerLink]="['/']" class="ml-4 p-menubar-item-link flex align-items-center cursor-pointer text-color hover:text-primary">
            Inicio
          </a>
        </ng-template>
        <ng-template pTemplate="end">
          <span class="text-color-secondary mr-3">{{ authService.currentUser()?.email }}</span>
          <p-button label="Cerrar sesión" icon="pi pi-sign-out" severity="danger" (onClick)="logout()" />
        </ng-template>
      </p-menubar>

      <main class="p-4 md:p-6 max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <p-card styleClass="shadow-2">
            <div class="flex align-items-center gap-3">
              <div class="flex align-items-center justify-content-center bg-primary-100 text-primary border-round p-3">
                <i class="pi pi-users text-2xl"></i>
              </div>
              <div>
                <span class="text-color-secondary font-medium block">Usuarios totales</span>
                <span class="text-2xl font-bold text-color">100</span>
              </div>
            </div>
          </p-card>
          <p-card styleClass="shadow-2">
            <div class="flex align-items-center gap-3">
              <div class="flex align-items-center justify-content-center bg-blue-100 text-blue-600 border-round p-3">
                <i class="pi pi-chart-line text-2xl"></i>
              </div>
              <div>
                <span class="text-color-secondary font-medium block">Proyectos activos</span>
                <span class="text-2xl font-bold text-color">25</span>
              </div>
            </div>
          </p-card>
          <p-card styleClass="shadow-2">
            <div class="flex align-items-center gap-3">
              <div class="flex align-items-center justify-content-center bg-green-100 text-green-600 border-round p-3">
                <i class="pi pi-dollar text-2xl"></i>
              </div>
              <div>
                <span class="text-color-secondary font-medium block">Ingresos mensuales</span>
                <span class="text-2xl font-bold text-color">$50,000</span>
              </div>
            </div>
          </p-card>
        </div>

        <p-card header="Actividad reciente" styleClass="mt-6 shadow-2">
          <ul class="list-none p-0 m-0">
            <li class="flex flex-wrap align-items-center justify-content-between py-3 border-bottom-1 surface-border">
              <div>
                <span class="font-medium text-color block">Nuevo proyecto creado</span>
                <span class="text-color-secondary text-sm">Cliente XYZ</span>
              </div>
              <div class="flex align-items-center gap-2 mt-2 md:mt-0">
                <p-tag value="Completado" severity="success" />
                <span class="text-color-secondary text-sm">Hace 1 hora</span>
              </div>
            </li>
          </ul>
        </p-card>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AdminComponent {
  menuItems: MenuItem[] = [];

  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
