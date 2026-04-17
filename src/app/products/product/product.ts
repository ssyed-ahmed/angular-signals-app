import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Product } from '../../models/product';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-product',
  imports: [DecimalPipe],
  templateUrl: './product.html',
  styleUrls: ['./product.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductComponent {
  @Input() product!: Product;

  router = inject(Router);

  openProductDetails(id: number) {
    this.router.navigate(['/products', id]);
  }
}
