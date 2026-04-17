import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthStore } from '../store/auth.store';

const LOGIN_API_PATH = '/api/User/Login';

function isLoginRequest(url: string): boolean {
  return url.includes(LOGIN_API_PATH);
}

export const unauthorizedInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: unknown) => {
      const isUnauthorized = error instanceof HttpErrorResponse && error.status === 401;
      if (isUnauthorized && !isLoginRequest(req.url)) {
        authStore.logout();
        void router.navigate(['/login']);
      }

      return throwError(() => error);
    }),
  );
};
