import { Routes } from '@angular/router';
import { RestaurantsDetails } from './components/restaurants-details/restaurants-details';
import { RestList } from './rest-list/rest-list';
import { RestaurantMenu } from './components/restaurant-menu/restaurant-menu';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'restaurants',
    pathMatch: 'full'
  },
  {
    path: 'restaurants',
    component: RestList,
  },
  {
    path: 'restaurant/:id',
    component: RestaurantsDetails
  },
  {
    path: 'restaurant/:id/menu',
    component: RestaurantMenu,
  },
  {
    path: 'restaurant/:id/menu/product/:productId',
    component: RestaurantMenu,
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./auth/profile/profile').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      { path: 'products', loadComponent: () => import('./admin/admin-product-list/admin-product-list').then(m => m.AdminProductListComponent) },
      { path: 'products/new', loadComponent: () => import('./admin/admin-product-form/admin-product-form').then(m => m.AdminProductFormComponent) },
      { path: 'products/edit/:id', loadComponent: () => import('./admin/admin-product-form/admin-product-form').then(m => m.AdminProductFormComponent) },
      { path: 'restaurants', loadComponent: () => import('./admin/admin-restaurant-list/admin-restaurant-list').then(m => m.AdminRestaurantListComponent) },
      { path: 'restaurants/new', loadComponent: () => import('./admin/admin-restaurant-form/admin-restaurant-form').then(m => m.AdminRestaurantFormComponent) },
      { path: 'restaurants/edit/:id', loadComponent: () => import('./admin/admin-restaurant-form/admin-restaurant-form').then(m => m.AdminRestaurantFormComponent) },
      { path: 'categories', loadComponent: () => import('./admin/admin-category-list/admin-category-list').then(m => m.AdminCategoryListComponent) },
      { path: 'categories/new', loadComponent: () => import('./admin/admin-category-form/admin-category-form').then(m => m.AdminCategoryFormComponent) },
      { path: 'categories/edit/:id', loadComponent: () => import('./admin/admin-category-form/admin-category-form').then(m => m.AdminCategoryFormComponent) },
      { path: 'users', loadComponent: () => import('./admin/admin-user-list/admin-user-list').then(m => m.AdminUserListComponent) },
      { path: 'users/new', loadComponent: () => import('./admin/admin-user-form/admin-user-form').then(m => m.AdminUserFormComponent) },
    ]
  }
];
