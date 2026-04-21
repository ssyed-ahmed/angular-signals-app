import { computed, inject, Injectable, signal } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, PRIMARY_OUTLET, Router } from '@angular/router';
import { Breadcrumb, BreadcrumbLabel } from '../models/breadcrumb.model';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private readonly router = inject(Router);

  private readonly _breadcrumbs = signal<Breadcrumb[]>([]);
  readonly breadcrumbs = computed(() => this._breadcrumbs());

  constructor() {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
    ).subscribe(() => {
      this._breadcrumbs.set(
        this.buildBreadcrumbs(this.router.routerState.snapshot.root)
      );
    });

    this._breadcrumbs.set(
      this.buildBreadcrumbs(this.router.routerState.snapshot.root)
    );
  }

  private buildBreadcrumbs(
    root: ActivatedRouteSnapshot
  ): Breadcrumb[] {
    const breadcrumbs: Breadcrumb[] = [];
    let currentRoute: ActivatedRouteSnapshot | null = root;
    let currentUrl = '';

    while (currentRoute) {
      const primaryChild: ActivatedRouteSnapshot | null = currentRoute.children.find(child => child.outlet === PRIMARY_OUTLET) ?? currentRoute.firstChild;
      if (!primaryChild) {
        break;
      }

      const routeUrl = primaryChild.url.map(segment => segment.path).join('/');
      if (routeUrl) {
        currentUrl += `/${routeUrl}`;
      }

      const breadcrumb = primaryChild.data?.['breadcrumb'] as BreadcrumbLabel | undefined;

      if (breadcrumb !== undefined && breadcrumb !== null) {
        const label =
          typeof breadcrumb === 'function' ?
            breadcrumb(
              primaryChild.data as Record<string, unknown>,
              primaryChild.params as Record<string, string>
            ) : breadcrumb;
        if (label) {
          if (breadcrumbs.length === 0 || breadcrumbs[breadcrumbs.length - 1].url !== (currentUrl || '/')) {
            breadcrumbs.push({
              label,
              url: currentUrl || '/ ',
            });
          }
        }
      }

      currentRoute = primaryChild;
    }
    return breadcrumbs;
  }
}
