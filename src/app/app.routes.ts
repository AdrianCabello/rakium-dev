import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./pages/admin/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'admin/projects',
    loadComponent: () => import('./pages/admin/projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'admin/projects/:id',
    loadComponent: () => import('./pages/admin/projects/project-detail/project-detail.component').then(m => m.ProjectDetailComponent)
  },
  {
    path: 'admin/clients',
    loadComponent: () => import('./pages/admin/clients/clients.component').then(m => m.ClientsComponent)
  },
  {
    path: 'admin/clients/:id',
    loadComponent: () => import('./pages/admin/clients/client-detail/client-detail.component').then(m => m.ClientDetailComponent)
  },
  {
    path: 'admin/users',
    loadComponent: () => import('./pages/admin/users/users.component').then(m => m.UsersComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
