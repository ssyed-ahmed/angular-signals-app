import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Product } from '../models/product';

const BASE_URL = '/api2';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  http = inject(HttpClient);

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${BASE_URL}/products`).pipe(
      map((response: any) => response.products as Product[]),
      catchError((error) => {
        console.error('Failed to fetch products', error);
        return throwError(() => error);
      })
    );
  }
}
