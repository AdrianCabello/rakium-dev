import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminRoleGuard } from './core/guards/admin-role.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
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
      { path: 'projects', loadComponent: () => import('./pages/admin/admin-projects/admin-projects.component').then(m => m.AdminProjectsComponent) },
      { path: 'projects/:id/edit', loadComponent: () => import('./pages/admin/admin-projects/admin-project-edit/admin-project-edit.component').then(m => m.AdminProjectEditComponent) },
    ],
  },
  { path: '**', redirectTo: '' },
];
