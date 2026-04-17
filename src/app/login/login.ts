import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {

  formBuilder = inject(FormBuilder);
  router = inject(Router);
  authStore = inject(AuthStore);

  loginForm = this.formBuilder.group({
    EmailId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    Password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  })

  handleLogin() {
    if (this.loginForm.invalid) {
      return;
    }

    const loginRequest = this.loginForm.getRawValue();
    this.authStore.login(loginRequest.EmailId, loginRequest.Password).subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigateByUrl('/home');
      }
    });
  }
}
