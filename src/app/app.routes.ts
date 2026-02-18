import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminRoleGuard } from './core/guards/admin-role.guard';
import { projectEditTabGuard } from './core/guards/project-edit-tab.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'proyecto/:id', loadComponent: () => import('./components/project-detail/project-detail.component').then(m => m.ProjectDetailComponent) },
  { path: 'login', loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent) },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'users', canActivate: [adminRoleGuard], loadComponent: () => import('./pages/admin/admin-users/admin-users.component').then(m => m.AdminUsersComponent) },
      { path: 'users/:id/edit', canActivate: [adminRoleGuard], loadComponent: () => import('./pages/admin/admin-users/admin-user-edit/admin-user-edit.component').then(m => m.AdminUserEditComponent) },
      { path: 'clients', canActivate: [adminRoleGuard], loadComponent: () => import('./pages/admin/admin-clients/admin-clients.component').then(m => m.AdminClientsComponent) },
      { path: 'clients/:id/edit', canActivate: [adminRoleGuard], loadComponent: () => import('./pages/admin/admin-clients/admin-client-edit/admin-client-edit.component').then(m => m.AdminClientEditComponent) },
      { path: 'categories', canActivate: [adminRoleGuard], loadComponent: () => import('./pages/admin/admin-categories/admin-categories.component').then(m => m.AdminCategoriesComponent) },
      { path: 'categories/:id/edit', canActivate: [adminRoleGuard], loadComponent: () => import('./pages/admin/admin-categories/admin-category-edit/admin-category-edit.component').then(m => m.AdminCategoryEditComponent) },
      { path: 'site-settings', loadComponent: () => import('./pages/admin/admin-site-settings/admin-site-settings.component').then(m => m.AdminSiteSettingsComponent) },
      { path: 'projects', loadComponent: () => import('./pages/admin/admin-projects/admin-projects.component').then(m => m.AdminProjectsComponent) },
      {
        path: 'projects/:id/edit',
        loadComponent: () => import('./pages/admin/admin-projects/admin-project-edit/admin-project-edit.component').then(m => m.AdminProjectEditComponent),
        children: [
          { path: '', redirectTo: 'informacion', pathMatch: 'full' },
          { path: 'informacion', loadComponent: () => import('./pages/admin/admin-projects/admin-project-edit/project-edit-informacion-tab.component').then(m => m.ProjectEditInformacionTabComponent) },
          { path: 'desafio-solucion', loadComponent: () => import('./pages/admin/admin-projects/admin-project-edit/project-edit-desafio-solucion-tab.component').then(m => m.ProjectEditDesafioSolucionTabComponent), canActivate: [projectEditTabGuard] },
          { path: 'ubicacion', loadComponent: () => import('./pages/admin/admin-projects/admin-project-edit/project-edit-ubicacion-tab.component').then(m => m.ProjectEditUbicacionTabComponent), canActivate: [projectEditTabGuard] },
          { path: 'enlaces', redirectTo: 'informacion', pathMatch: 'full' },
          { path: 'contacto', loadComponent: () => import('./pages/admin/admin-projects/admin-project-edit/project-edit-contacto-tab.component').then(m => m.ProjectEditContactoTabComponent), canActivate: [projectEditTabGuard] },
          { path: 'presupuesto', loadComponent: () => import('./pages/admin/admin-projects/admin-project-edit/project-edit-presupuesto-tab.component').then(m => m.ProjectEditPresupuestoTabComponent), canActivate: [projectEditTabGuard] },
          { path: 'galeria', loadComponent: () => import('./pages/admin/admin-projects/admin-project-edit/project-edit-galeria-tab.component').then(m => m.ProjectEditGaleriaTabComponent), canActivate: [projectEditTabGuard] },
          { path: 'videos', loadComponent: () => import('./pages/admin/admin-projects/admin-project-edit/project-edit-videos-tab.component').then(m => m.ProjectEditVideosTabComponent), canActivate: [projectEditTabGuard] },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
