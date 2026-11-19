import { Injectable, inject, signal } from '@angular/core';
import { Product } from '../../models/product.models';
import { ApiService } from '../api.service';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private api = inject(ApiService);
  private cache = signal<Product[]>([]);

  readonly productsList = this.cache.asReadonly();

  fetchByRestaurant(restaurantId: number) {
    return this.api.getRestaurantProducts(restaurantId).pipe(
      tap(data => this.cache.set(data))
    );
  }

  getById(id: number): Product | undefined {
    return this.cache().find(p => p.id === id);
  }

  add(product: any) {}
  update(id: number, data: Partial<Product>) {}
  deactivate(id: number) {}
}
