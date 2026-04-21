import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { Product, ProductsResponse } from '../models/product';
import { addEntity, setAllEntities, withEntities } from '@ngrx/signals/entities';
import { inject } from '@angular/core';
import { ToastService } from '../widgets/toast/toast.service';
import { ProductService } from './products.service';
import { Router } from '@angular/router';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, finalize, pipe, switchMap, tap } from 'rxjs';

export type ProductsState = {
  isLoading: boolean;
  error: string | null;
  totalCount: number;
};

export const initialProductsState: ProductsState = {
  isLoading: false,
  error: null,
  totalCount: 0,
};

export const ProductsStore = signalStore(
  { providedIn: 'root' },
  withDevtools('products'),
  withState(initialProductsState),
  withEntities<Product>(),
  withMethods((
    store,
    productsService = inject(ProductService),
    toastService = inject(ToastService),
    router = inject(Router)
  ) => ({
    getProducts: rxMethod<{limit: number, skip: number}>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({limit, skip}) =>
          productsService.getProducts(limit, skip).pipe(
            tap((response: ProductsResponse) => {
              patchState(store, setAllEntities(response.products));
              patchState(store, { totalCount: response.total });
            }),
            catchError((error) => {
              patchState(store, { error: error.message });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    getProductById: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          productsService.getProductById(id).pipe(
            tap((product: Product) => {
              patchState(store, addEntity(product));
            }),
            catchError((error) => {
              patchState(store, { error: error.message });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    )
  }))
);
