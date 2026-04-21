import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { LayoutComponent } from './layout/layout';
import { HomeComponent } from './home/home';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';
import { UsersComponent } from './users/users';
import { ProductsComponent } from './products/products';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      breadcrumb: null,
    },
    canActivate: [loginGuard],
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: null,
    },
    children: [
      {
        path: 'home',
        component: HomeComponent,
        data: {
          breadcrumb: 'Home',
        },
      },
      {
        path: 'users',
        data: {
          breadcrumb: 'Users',
        },
        children: [
          {
            path: '',
            component: UsersComponent,
          },
          {
            path: ':id',
            loadComponent: () =>
              import('../app/users/user-details/user-details').then((m) => m.UserDetailsComponent),
            data: {
              breadcrumb: (_data: Record<string, unknown>, params: Record<string, string>) =>
                `User ${params['id']}`,
            },
          },
        ],
      },
      {
        path: 'products',
        data: {
          breadcrumb: 'Products',
        },
        children: [
          {
            path: '',
            component: ProductsComponent,
          },
          {
            path: ':id',
            loadComponent: () =>
              import('../app/products/product-details/product-details').then(
                (m) => m.ProductDetailsComponent,
              ),
            data: {
              breadcrumb: (_data: Record<string, unknown>, params: Record<string, string>) =>
                `Product ${params['id']}`,
            },
          },
        ],
      },
    ],
  },
];
