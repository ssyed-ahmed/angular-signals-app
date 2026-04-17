import { patchState, signalStore, watchState, withHooks, withMethods, withState } from '@ngrx/signals';
import { LoginService } from './login.service';
import { inject } from '@angular/core';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { catchError, map, Observable, of, tap } from 'rxjs';

export type AuthState = {
  isLoggedIn: boolean;
  token: string | null;
  userEmail: string | null;
};

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  userEmail: null,
};

const AUTH_STORAGE_KEY = 'auth-store-state-v1';
type StateWatcherRef = { destroy: () => void };

function isAuthState(value: unknown): value is AuthState {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<AuthState>;
  return typeof candidate.isLoggedIn === 'boolean'
    && (typeof candidate.token === 'string' || candidate.token === null)
    && (typeof candidate.userEmail === 'string' || candidate.userEmail === null);
}

function readPersistedAuthState(): AuthState {
  try {
    const storedValue = globalThis.localStorage?.getItem(AUTH_STORAGE_KEY);
    if (!storedValue) {
      return initialState;
    }

    const parsed = JSON.parse(storedValue) as unknown;
    if (!isAuthState(parsed)) {
      return initialState;
    }

    return parsed;
  } catch {
    return initialState;
  }
}

function persistAuthState(state: AuthState): void {
  try {
    const shouldClearStorage = !state.isLoggedIn && state.token === null && state.userEmail === null;
    if (shouldClearStorage) {
      globalThis.localStorage?.removeItem(AUTH_STORAGE_KEY);
      return;
    }

    globalThis.localStorage?.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore localStorage write errors to keep auth flow functional.
  }
}

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withDevtools('auth'),
  withState(initialState),
  withHooks((store) => {
    let stateWatcher: StateWatcherRef | undefined;

    return {
      onInit() {
        patchState(store, readPersistedAuthState());
        stateWatcher = watchState(store, (state) => {
          persistAuthState(state);
        });
      },
      onDestroy() {
        stateWatcher?.destroy();
      },
    };
  }),
  withMethods((store, loginService = inject(LoginService)) => ({
    login(email: string, password: string): Observable<boolean> {
      return loginService.login(email, password).pipe(
        tap((response) => {
          if (response.result) {
            patchState(store, ({
              isLoggedIn: response.result,
              token: response.data.token,
              userEmail: email,
            }));
            return;
          }

          console.error('Login failed:', response.message);
          patchState(store, ({
            isLoggedIn: false,
            token: null,
            userEmail: null,
          }));
        }),
        map((response) => response.result),
        catchError((error) => {
          console.error('Login error:', error);
          patchState(store, ({
            isLoggedIn: false,
            token: null,
            userEmail: null,
          }));
          return of(false);
        }),
      );
    },
    isAuthenticated() {
      return store.isLoggedIn() && !!store.token;
    },
    logout() {
      patchState(store, ({
        isLoggedIn: false,
        token: null,
        userEmail: null,
      }));
    },
  })
));
