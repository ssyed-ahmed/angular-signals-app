import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '../store/auth.store';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const authStore = inject(AuthStore);

  const isAuthenticated = authStore.isAuthenticated();
  if (!isAuthenticated) {
    router.navigate(['/login']); // Redirect to login page if not authenticated
    return false;
  }

  return true; // Allow access if authenticated
}
