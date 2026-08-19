import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { User, UsersResponse } from '../models/user';

const BASE_URL = '/api';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  http = inject(HttpClient);

  getUsers(limit: number, skip: number): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${BASE_URL}/users?limit=${limit}&skip=${skip}`).pipe(
      map((response: UsersResponse) => response),
      catchError((error) => {
        console.error('Failed to fetch users', error);
        return throwError(() => error);
      }),
    );
  }

  addNewUser(user: User) {
    return this.http.post<User>(`${BASE_URL}/CreateNewUser`, user).pipe(
      map((response: any) => response.result as boolean),
      map((result: boolean) => {
        if (!result) {
          throw new Error('User creation failed!');
        }

        return user;
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }

  // updateUser(user: User) {
  //   return this.http.put(`${BASE_URL}/UpdateUser`, user).pipe(
  //     map((response: any) => response.result as boolean),
  //     map((result: boolean) => {
  //       if (!result) {
  //         throw new Error('User update failed!');
  //       }
  //       return {
  //         ...user,
  //         id: user.userId,
  //       } as UserEntity;
  //     }),
  //     catchError((error) => {
  //       return throwError(() => error);
  //     }),
  //   );
  // }

  deleteUser(userId: number) {
    return this.http.delete(`${BASE_URL}/DeleteUserById?userId=${userId}`).pipe(
      map((response: any) => {
        const result = response.result as boolean;
        if (!result) {
          throw new Error('User delete failed!');
        }
        return response.data as string;
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }
}
