import { Component, input, inject } from '@angular/core';
import { Product } from '../../models/product.models';
import { CurrencyPipe, NgClass } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { RestaurantsService } from '../../services/restaurants';

@Component({
  selector: 'app-restaurant-menu-product',
  standalone: true,
  imports: [CurrencyPipe, NgClass],
  templateUrl: './restaurant-menu-product.html',
  styleUrl: './restaurant-menu-product.scss'
})
export class RestaurantMenuProduct {
  product = input.required<Product>();

  private cart = inject(CartService);
  private restaurantsService = inject(RestaurantsService);

  addToCart() {
    if (!this.product().isActive) return;
    const p = this.product();
    const restaurant = this.restaurantsService.getById(p.restaurantId);
    const restName = restaurant?.name ?? '';

    const result = this.cart.addItem(
      {
        productId: p.id,
        restaurantId: p.restaurantId,
        name: p.name,
        price: p.price ?? 0,
        quantity: 1
      },
      restName
    );

    if (result === 'conflict') {
      const confirmed = confirm(
        `Koszyk zawiera produkty z innej restauracji.\n\nAnuluj — zostaw obecne zamówienie\nOK — wyczyść koszyk i dodaj nowy produkt`
      );
      if (confirmed) {
        this.cart.clear();
        this.cart.addItem(
          { productId: p.id, restaurantId: p.restaurantId, name: p.name, price: p.price ?? 0, quantity: 1 },
          restName
        );
      }
    }
  }
}
