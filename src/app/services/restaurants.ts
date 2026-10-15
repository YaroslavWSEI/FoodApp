import { Service,signal } from '@angular/core';
import data from '../../data/restaurants.json';
import { Restaurant } from '../models/restaurant.models';
@Service()
export class Restaurants {
    private data = signal(data as Restaurant[])
    getAll(){
        return this.data();
    }
    getById(id : number){
     return this.data().find((restaurant) => restaurant.id ==id);
    }
}
