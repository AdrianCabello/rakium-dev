import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

/**
 * Guard for project edit tabs that require an existing project (not "new").
 * Redirects to informacion when id is 'new'.
 */
export const projectEditTabGuard: CanActivateFn = (route) => {
  const id = route.paramMap.get('id') ?? route.parent?.paramMap.get('id');
  if (id === 'new') {
    return inject(Router).createUrlTree(['/admin/projects', 'new', 'edit', 'informacion']);
  }
  return true;
};
