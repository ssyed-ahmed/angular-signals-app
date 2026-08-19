import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  authStore = inject(AuthStore);

  loginForm = this.formBuilder.group({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  handleLogin() {
    if (this.loginForm.invalid) {
      return;
    }

    const loginRequest = this.loginForm.getRawValue();
    this.authStore
      .login(loginRequest.username, loginRequest.password)
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigateByUrl('/home');
        }
      });
  }
}
