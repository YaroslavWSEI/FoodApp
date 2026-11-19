import { Injectable, inject, signal } from '@angular/core';
import { Restaurant } from '../models/restaurant.models';
import { ApiService } from './api.service';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RestaurantsService {
  private api = inject(ApiService);
  private cache = signal<Restaurant[]>([]);

  readonly restaurantsList = this.cache.asReadonly();

  fetchAll() {
    return this.api.getRestaurants().pipe(
      tap(data => this.cache.set(data))
    );
  }

  fetchById(id: number) {
    return this.api.getRestaurant(id);
  }

  getById(id: number): Restaurant | undefined {
    return this.cache().find(r => r.id === id);
  }

  add(restaurant: Omit<Restaurant, 'id' | 'rating'>) {}
  update(id: number, data: Partial<Restaurant>) {}
  deactivate(id: number) {}
}
