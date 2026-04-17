import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { LoginResponse } from '../models/login.model';

const BASE_URL = '/api/User';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  http = inject(HttpClient);

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post(`${BASE_URL}/Login`, {EmailId: email, Password: password}).pipe(
      map((response: any) => response as LoginResponse),
      catchError(error => {
        console.error('Login failed', error);
        throw error;
      })
    );
  }
}
