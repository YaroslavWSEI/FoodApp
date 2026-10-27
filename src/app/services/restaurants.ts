import { Injectable, signal } from '@angular/core';
import data from '../../data/restaurants.json';
import { Restaurant } from '../models/restaurant.models';

@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {
  private readonly STORAGE_KEY = 'foodapp_restaurants';
  private data = signal<Restaurant[]>(this.loadFromStorage());

  readonly restaurantsList = this.data.asReadonly();

  private loadFromStorage(): Restaurant[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return data as Restaurant[];
  }

  private saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data()));
  }

  getAll() {
    return this.data();
  }

  getById(id: number) {
    return this.data().find((restaurant) => restaurant.id == id);
  }

  add(restaurant: Omit<Restaurant, 'id' | 'rating'>) {
    this.data.update((currentData) => {
      const newId = currentData.length > 0 ? Math.max(...currentData.map(r => r.id)) + 1 : 1;
      const newRestaurant: Restaurant = {
        ...restaurant,
        id: newId,
        rating: null
      } as Restaurant;
      return [...currentData, newRestaurant];
    });
    this.saveToStorage();
  }

  update(id: number, updatedData: Partial<Restaurant>) {
    this.data.update((currentData) =>
      currentData.map((restaurant) =>
        restaurant.id === id ? { ...restaurant, ...updatedData } : restaurant
      )
    );
    this.saveToStorage(); 
  }

  deactivate(id: number) {
    this.update(id, { isActive: false });
  }
}