import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ProductsStore } from '../store/products.store';
import { ProductComponent } from './product/product';
import { JsonPipe } from '@angular/common';
import { SpinnerComponent } from '../widgets/spinner/spinner';

@Component({
  selector: 'app-products',
  imports: [ProductComponent, SpinnerComponent],
  templateUrl: './products.html',
  styleUrls: ['./products.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent implements OnInit {
  productsStore = inject(ProductsStore);
  readonly products = this.productsStore.entities;

  ngOnInit() {
    const products = this.productsStore.entities;
    console.log(products());
    this.productsStore.getAllProducts();
  }
}
