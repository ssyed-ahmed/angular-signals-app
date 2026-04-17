import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { Product } from '../models/product';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { inject } from '@angular/core';
import { ToastService } from '../widgets/toast/toast.service';
import { ProductService } from './products.service';
import { Router } from '@angular/router';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, finalize, pipe, switchMap, tap } from 'rxjs';

export type ProductsState = {
  isLoading: boolean;
  error: string | null;
};

export const initialProductsState: ProductsState = {
  isLoading: false,
  error: null
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
    getAllProducts: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          productsService.getAllProducts().pipe(
            tap((products: Product[]) => {
              patchState(store, setAllEntities(products));
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
