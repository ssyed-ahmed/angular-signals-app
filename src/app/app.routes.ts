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
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard]
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'users',
        children: [
          {
            path: '',
            component: UsersComponent
          },
          {
            path: ':id',
            loadComponent: () => import('../app/users/user-details/user-details').then(m => m.UserDetailsComponent)
          }
        ]
      },
      {
        path: 'products',
        children: [
          {
            path: '',
            component: ProductsComponent
          },
          {
            path: ':id',
            loadComponent: () => import('../app/products/product-details/product-details').then(m => m.ProductDetailsComponent)
          }
        ]
      }
    ]
  }
];
