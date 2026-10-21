// restaurants-details.ts
import { Component, input, computed, inject } from '@angular/core';
import { Restaurants } from '../../services/restaurants';
import { RestaurantMenu } from '../restaurant-menu/restaurant-menu';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-restaurants-details',
  standalone: true,
  imports: [RestaurantMenu, CurrencyPipe, RouterLink],
  templateUrl: './restaurants-details.html',
  styleUrl: './restaurants-details.scss'
})
export class RestaurantsDetails {
  private readonly restaurantService = inject(Restaurants);
  id = input.required<number>();
  restaurant = computed(() => this.restaurantService.getById(Number(this.id())));
}