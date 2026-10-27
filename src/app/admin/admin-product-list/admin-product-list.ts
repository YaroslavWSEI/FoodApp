import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/product.service/product.service';
import { RestaurantsService } from '../../services/restaurants';
import { Product } from '../../models/product.models';

@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-product-list.html'
})
export class AdminProductListComponent {
  private productsService = inject(ProductsService);
  private restaurantsService = inject(RestaurantsService);

  searchTerm = signal('');
  showOnlyActive = signal(false);

  filteredProducts = computed(() => {
    return this.productsService.productsList().filter((p: Product) => {
      const matchesSearch = p.name.toLowerCase().includes(this.searchTerm().toLowerCase());
      const matchesActive = this.showOnlyActive() ? p.isActive : true;
      return matchesSearch && matchesActive;
    });
  });

  getRestaurantName(restaurantId: number): string {
    const restaurant = this.restaurantsService.getById(restaurantId);
    return restaurant ? restaurant.name : 'Brak danych';
  }

  onDeactivate(id: number, name: string) {
    if (confirm(`Czy na pewno chcesz dezaktywować produkt ${name}?`)) {
      this.productsService.deactivate(id);
    }
  }
}