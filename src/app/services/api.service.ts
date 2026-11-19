import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restaurant } from '../models/restaurant.models';
import { Product } from '../models/product.models';

export type ApiMenu = { id: number; restaurantId: number; name: string };
export type ApiCategory = { id: number; menuId: number; name: string };

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000';

  getRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${this.base}/restaurants`);
  }

  getRestaurant(id: number): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${this.base}/restaurants/${id}`);
  }

  getMenus(restaurantId: number): Observable<ApiMenu[]> {
    return this.http.get<ApiMenu[]>(`${this.base}/restaurants/${restaurantId}/menus`);
  }

  getCategories(menuId: number): Observable<ApiCategory[]> {
    return this.http.get<ApiCategory[]>(`${this.base}/menus/${menuId}/categories`);
  }

  getCategoryProducts(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/categories/${categoryId}/products`);
  }

  getRestaurantProducts(restaurantId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/restaurants/${restaurantId}/products`);
  }

  postOrder(order: any): Observable<any> {
    return this.http.post(`${this.base}/orders`, order);
  }
}
