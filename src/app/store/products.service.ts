import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Product, ProductsResponse } from '../models/product';

const BASE_URL = '/api2';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  http = inject(HttpClient);

  getProducts(limit: number, skip: number): Observable<ProductsResponse> {
    return this.http.get<Product[]>(`${BASE_URL}/products?limit=${limit}&skip=${skip}`).pipe(
      map((response: any) => response as ProductsResponse),
      catchError((error) => {
        console.error('Failed to fetch products', error);
        return throwError(() => error);
      })
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${BASE_URL}/products/${id}`).pipe(
      map((response: any) => response as Product),
      catchError((error) => {
        console.error('Failed to fetch product', error);
        return throwError(() => error);
      })
    )
  }
}
