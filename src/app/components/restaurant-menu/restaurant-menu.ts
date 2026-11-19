import { Component, input, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { RestaurantMenuProduct } from '../restaurant-menu-product/restaurant-menu-product';
import { Product } from '../../models/product.models';
import { ProductsService } from '../../services/product.service/product.service';
import { AsyncState, idle, loading, success, error } from '../../shared/async-state';
import { StateViewComponent } from '../../shared/state-view/state-view';
import { Subject, takeUntil } from 'rxjs';

interface MenuCategory {
  category: string;
  products: Product[];
}

@Component({
  selector: 'app-restaurant-menu',
  standalone: true,
  imports: [RestaurantMenuProduct, StateViewComponent],
  templateUrl: './restaurant-menu.html',
  styleUrl: './restaurant-menu.scss'
})
export class RestaurantMenu implements OnInit, OnDestroy {
  private productsService = inject(ProductsService);
  id = input.required<number>();

  state = signal<AsyncState<Product[]>>(idle());
  private destroy$ = new Subject<void>();

  menuCategories = (): MenuCategory[] => {
    const s = this.state();
    if (s.status !== 'success') return [];
    const products = s.data.filter(p => p.isActive);
    if (products.length === 0) return [];
    return [{ category: 'Menu', products }];
  };

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load() {
    this.state.set(loading());
    this.productsService.fetchByRestaurant(Number(this.id()))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => this.state.set(success(data)),
        error: () => this.state.set(error('Unable to load data.'))
      });
  }

  get stateStatus() { return this.state().status; }
  get isEmpty() {
    const s = this.state();
    return s.status === 'success' && this.menuCategories().length === 0;
  }
}
