import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Solo permite acceso a usuarios con rol ADMIN.
 * CLIENT y CLIENT_ADMIN son redirigidos a /admin/projects.
 */
export const adminRoleGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const role = auth.currentUser()?.role;
  if (role === 'ADMIN') {
    return true;
  }
  router.navigate(['/admin/projects']);
  return false;
};
