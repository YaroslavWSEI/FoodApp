import { Component, input } from '@angular/core';
import { Product } from '../../models/product.models';
import { CurrencyPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-restaurant-menu-product',
  standalone: true,
  imports: [CurrencyPipe, NgClass],
  templateUrl: './restaurant-menu-product.html',
  styleUrl: './restaurant-menu-product.scss'
})
export class RestaurantMenuProduct {
  product = input.required<Product>();
  
  addToCart() {
    if (this.product().isActive) {
      console.log('Dodano do koszyka:', this.product().name);
    }
  }
}