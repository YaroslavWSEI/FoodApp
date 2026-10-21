import { Routes } from '@angular/router';
import { RestaurantsDetails } from './components/restaurants-details/restaurants-details';
import { RestList } from './rest-list/rest-list';
import { RestaurantMenu } from './components/restaurant-menu/restaurant-menu';

export const routes: Routes = [
    // 1. DODANE: Przekierowanie ze strony głównej na listę restauracji
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
    // 2. POPRAWKA: Zmiana drugiego :id na :productId, aby parametry się nie nadpisywały
    {
        path: 'restaurant/:id/menu/product/:productId',
        component: RestaurantMenu,
    }
];
