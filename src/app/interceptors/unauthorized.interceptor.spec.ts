import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { unauthorizedInterceptor } from './unauthorized.interceptor';
import { AuthStore } from '../store/auth.store';

describe('unauthorizedInterceptor', () => {
  let logout: ReturnType<typeof jest.fn>;
  let navigate: ReturnType<typeof jest.fn>;

  beforeEach(() => {
    logout = jest.fn();
    navigate = jest.fn().mockResolvedValue(true);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStore, useValue: { logout } },
        { provide: Router, useValue: { navigate } },
      ],
    });
  });

  it('logs out and redirects to login on 401 for non-login requests', (done) => {
    const request = new HttpRequest('GET', '/api/User/GetAllUsers');

    TestBed.runInInjectionContext(() => {
      unauthorizedInterceptor(request, () =>
        throwError(() => new HttpErrorResponse({ status: 401 })),
      ).subscribe({
        error: () => {
          expect(logout).toHaveBeenCalledTimes(1);
          expect(navigate).toHaveBeenCalledWith(['/login']);
          done();
        },
      });
    });
  });

  it('does not redirect on 401 from login request', (done) => {
    const request = new HttpRequest('POST', '/api/User/Login', null);

    TestBed.runInInjectionContext(() => {
      unauthorizedInterceptor(request, () =>
        throwError(() => new HttpErrorResponse({ status: 401 })),
      ).subscribe({
        error: () => {
          expect(logout).not.toHaveBeenCalled();
          expect(navigate).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });
});
