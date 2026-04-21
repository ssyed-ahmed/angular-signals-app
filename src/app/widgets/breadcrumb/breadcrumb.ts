import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../utils/breadcrumb.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumb.html',
  styleUrls: ['./breadcrumb.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent implements OnInit {
  readonly breadcrumbService = inject(BreadcrumbService);

  ngOnInit() {
    console.log(this.breadcrumbService.breadcrumbs());
  }
}
