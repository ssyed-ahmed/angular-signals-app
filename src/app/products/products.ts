import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ProductsStore } from '../store/products.store';
import { ProductComponent } from './product/product';
import { SpinnerComponent } from '../widgets/spinner/spinner';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap/pagination';

@Component({
  selector: 'app-products',
  imports: [ProductComponent, SpinnerComponent, NgbPagination],
  templateUrl: './products.html',
  styleUrls: ['./products.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent implements OnInit {
  productsStore = inject(ProductsStore);
  readonly products = this.productsStore.entities;

  pageSize = 30;
  currentPage = 1;
  totalPages = 0;
  totalCount = 0;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    const skip = (this.currentPage - 1) * this.pageSize;
    const limit = this.pageSize;
    this.productsStore.getProducts({ limit, skip });
    this.totalCount = this.productsStore.totalCount();
    this.totalPages = Math.ceil(this.totalCount / this.pageSize);
  }

  navigateToPage(page: number) {
    this.currentPage = page;
    this.loadProducts();
  }
}
