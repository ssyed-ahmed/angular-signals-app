import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { LoginComponent } from './login';
import { AuthStore } from '../store/auth.store';

type AuthStoreLike = {
  login: (email: string, password: string) => Observable<boolean>;
};

type RouterLike = {
  navigateByUrl: (url: string) => Promise<boolean>;
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authStore: { login: ReturnType<typeof jest.fn> };
  let router: { navigateByUrl: ReturnType<typeof jest.fn> };

  beforeEach(async () => {
    authStore = { login: jest.fn() };
    router = { navigateByUrl: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthStore, useValue: authStore as AuthStoreLike },
        { provide: Router, useValue: router as RouterLike },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home on first successful login', () => {
    authStore.login.mockReturnValue(of(true));
    component.loginForm.setValue({
      EmailId: 'test@example.com',
      Password: 'password',
    });

    component.handleLogin();

    expect(authStore.login).toHaveBeenCalledWith('test@example.com', 'password');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
  });

  it('should not navigate when login fails', () => {
    authStore.login.mockReturnValue(of(false));
    component.loginForm.setValue({
      EmailId: 'test@example.com',
      Password: 'password',
    });

    component.handleLogin();

    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
