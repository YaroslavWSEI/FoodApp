import { Component, input,computed, inject } from '@angular/core';
import { Restaurants } from '../../services/restaurants';
@Component({
  imports: [],
  selector: 'app-restaurants-details',
  styleUrl: './restaurants-details.scss',
  templateUrl: './restaurants-details.html',
})
export class RestaurantsDetails {
  private readonly restaurantService  = inject(Restaurants);
  id = input<number>();
  restaurant = computed(()=> this.restaurantService.getById(this.id()));
}
