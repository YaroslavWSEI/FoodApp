import { Routes } from '@angular/router';
import { RestaurantsDetails } from './components/restaurants-details/restaurants-details';
import { RestList } from './rest-list/rest-list';
import { RestaurantMenu } from './components/restaurant-menu/restaurant-menu';
import { AdminProductListComponent } from './admin/admin-product-list/admin-product-list';
import { AdminProductFormComponent } from './admin/admin-product-form/admin-product-form';
import { AdminRestaurantFormComponent } from './admin/admin-restaurant-form/admin-restaurant-form';
import { AdminRestaurantListComponent } from './admin/admin-restaurant-list/admin-restaurant-list';
import { AdminCategoryListComponent } from './admin/admin-category-list/admin-category-list';
import { AdminCategoryFormComponent } from './admin/admin-category-form/admin-category-form';


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
    { path: 'admin/products', component: AdminProductListComponent },
    { path: 'admin/products/new', component: AdminProductFormComponent },
    { path: 'admin/products/edit/:id', component: AdminProductFormComponent },
    { path: 'admin/restaurants', component: AdminRestaurantListComponent },
    { path: 'admin/restaurants/new', component: AdminRestaurantFormComponent },
    { path: 'admin/restaurants/edit/:id', component: AdminRestaurantFormComponent },
    { path: 'admin/categories', component: AdminCategoryListComponent },
    { path: 'admin/categories/new', component: AdminCategoryFormComponent },
    { path: 'admin/categories/edit/:id', component: AdminCategoryFormComponent }
    
];
