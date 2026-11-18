import { Component, computed, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { RestaurantsService } from '../services/restaurants';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterModule, FormsModule],
  templateUrl: './cart.html'
})
export class CartComponent {
  cart = inject(CartService);
  private restaurantsService = inject(RestaurantsService);

  DELIVERY_FEE = 5.99;

  total = computed(() => this.cart.subtotal() + (this.cart.itemCount() > 0 ? this.DELIVERY_FEE : 0));

  restaurantName = computed(() => {
    const rid = this.cart.currentRestaurantId();
    if (!rid) return '';
    const r = this.restaurantsService.getById(rid);
    return r?.name ?? this.cart.currentRestaurantName();
  });

  updateQty(productId: number, event: Event) {
    const val = Number((event.target as HTMLInputElement).value);
    this.cart.updateQuantity(productId, val);
  }

  increment(productId: number, current: number) {
    this.cart.updateQuantity(productId, current + 1);
  }

  decrement(productId: number, current: number) {
    this.cart.updateQuantity(productId, current - 1);
  }

  clearCart() {
    if (confirm('Czy na pewno chcesz wyczyścić koszyk?')) {
      this.cart.clear();
    }
  }
}
