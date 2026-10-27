import { Component, input, computed, inject } from '@angular/core';
import { RestaurantMenuProduct } from '../restaurant-menu-product/restaurant-menu-product';
import { Product } from '../../models/product.models';
import { ProductsService } from '../../services/product.service/product.service';

interface MenuCategory {
  category: string;
  products: Product[];
}

@Component({
  selector: 'app-restaurant-menu',
  standalone: true,
  imports: [RestaurantMenuProduct],
  templateUrl: './restaurant-menu.html',
  styleUrl: './restaurant-menu.scss'
})
export class RestaurantMenu {
  private productsService = inject(ProductsService);
  id = input.required<number>(); 
  
  menuCategories = computed<MenuCategory[]>(() => {
    const allProducts = this.productsService.productsList();
    
    const restaurantProducts = allProducts.filter(p => 
      p.restaurantId === Number(this.id()) && p.isActive
    );
    
    if (restaurantProducts.length > 0) {
      return [
        {
          category: 'Menu',
          products: restaurantProducts 
        }
      ];
    }
    return [];
  });
}