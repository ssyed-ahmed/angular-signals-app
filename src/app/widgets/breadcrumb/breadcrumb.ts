import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BreadcrumbService } from '../../utils/breadcrumb.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './breadcrumb.html',
  styleUrls: ['./breadcrumb.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
  readonly breadcrumbService = inject(BreadcrumbService)
}
