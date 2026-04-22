import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ProductsStore } from '../../store/products.store';
import { SpinnerComponent } from '../../widgets/spinner/spinner';
import { DecimalPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  imports: [SpinnerComponent, DecimalPipe, ReactiveFormsModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetailsComponent implements OnInit {
  route = inject(ActivatedRoute);
  productsStore = inject(ProductsStore);
  readonly activeImageIndex = signal(0);

  private readonly routeProductId = toSignal(
    this.route.paramMap.pipe(
      map((params) => {
        const id = params.get('id');
        if (id === null) {
          return null;
        }
        const parseId = Number(id);
        return Number.isNaN(parseId) ? null : parseId;
      }),
    ),
    { initialValue: null },
  );

  readonly selectedProduct = computed<Product | undefined>(() => {
    const productId = this.routeProductId();
    if (productId === null) {
      return undefined;
    }

    return this.productsStore.entities().find((product) => product.id === productId);
  });

  quantity = new FormControl(1, { nonNullable: true, validators: [Validators.required] });

  constructor() {
    effect(() => {
      const imagesLength = this.selectedProduct()?.images?.length ?? 0;
      if (imagesLength === 0) {
        this.activeImageIndex.set(0);
        return;
      }

      if (this.activeImageIndex() >= imagesLength) {
        this.activeImageIndex.set(0);
      }

      const product = this.selectedProduct();
      if (product) {
        this.quantity.setValue(this.selectedProduct()?.minimumOrderQuantity ?? 1);
      }
    });
  }

  showPrevious(totalImages: number): void {
    if (totalImages <= 1) {
      return;
    }
    const previous = (this.activeImageIndex() - 1 + totalImages) % totalImages;
    this.activeImageIndex.set(previous);
  }

  showNext(totalImages: number): void {
    if (totalImages <= 1) {
      return;
    }
    const next = (this.activeImageIndex() + 1) % totalImages;
    this.activeImageIndex.set(next);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.productsStore.getProductById(id);
    });
  }
}
