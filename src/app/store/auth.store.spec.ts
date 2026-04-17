import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LoginService } from '../login/login.service';
import { AuthStore } from './auth.store';

const AUTH_STORAGE_KEY = 'auth-store-state-v1';

describe('AuthStore persistence', () => {
  let loginService: { login: ReturnType<typeof jest.fn> };

  beforeEach(() => {
    localStorage.clear();
    loginService = { login: jest.fn() };

    TestBed.configureTestingModule({
      providers: [{ provide: LoginService, useValue: loginService }],
    });
  });

  it('hydrates auth state from localStorage on init', () => {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        isLoggedIn: true,
        token: 'persisted-token',
        userEmail: 'test@example.com',
      }),
    );

    const store = TestBed.inject(AuthStore);

    expect(store.isLoggedIn()).toBe(true);
    expect(store.token()).toBe('persisted-token');
    expect(store.userEmail()).toBe('test@example.com');
  });

  it('persists successful login state to localStorage', () => {
    loginService.login.mockReturnValue(
      of({
        message: 'ok',
        result: true,
        data: { token: 'new-token' },
      }),
    );

    const store = TestBed.inject(AuthStore);
    store.login('user@example.com', 'password').subscribe();

    const persistedState = localStorage.getItem(AUTH_STORAGE_KEY);
    expect(persistedState).not.toBeNull();
    expect(JSON.parse(persistedState as string)).toEqual({
      isLoggedIn: true,
      token: 'new-token',
      userEmail: 'user@example.com',
    });
  });

  it('clears localStorage when user logs out', () => {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        isLoggedIn: true,
        token: 'persisted-token',
        userEmail: 'test@example.com',
      }),
    );

    const store = TestBed.inject(AuthStore);
    store.logout();

    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
    expect(store.isLoggedIn()).toBe(false);
    expect(store.token()).toBeNull();
  });
});
