import { Routes } from '@angular/router';
import { RestaurantsDetails } from './components/restaurants-details/restaurants-details';
import { RestList } from './rest-list/rest-list';
import { RestaurantMenu } from './components/restaurant-menu/restaurant-menu';

export const routes: Routes = [
    {
        path:'restaurants',
        component : RestList,
    },
    {
        path :'restaurant/:id',
        component: RestaurantsDetails
    },
    {
        path:'restaurant/:id/menu',
        component : RestaurantMenu,
    },
    {
        path:'restaurant/:id/menu/product/:id',
        component : RestaurantMenu,
    }
];
