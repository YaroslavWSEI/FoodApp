import { Component, input, computed } from '@angular/core';
import { RestaurantMenuProduct } from '../restaurant-menu-product/restaurant-menu-product';
import { MenuCategory, RestaurantMenuData } from '../../models/menu.models';
import menuData from '../../../data/Menu.json'; 

@Component({
  selector: 'app-restaurant-menu',
  standalone: true,
  imports: [RestaurantMenuProduct],
  templateUrl: './restaurant-menu.html',
  styleUrl: './restaurant-menu.scss'
})
export class RestaurantMenu {
  id = input.required<number>(); 
  private typedMenuData = menuData as unknown as RestaurantMenuData[];
  
  menuCategories = computed<MenuCategory[]>(() => {
    const menu = this.typedMenuData.find(m => m.restaurantId === Number(this.id()));
    return menu ? menu.categories : (this.typedMenuData[0]?.categories || []);
  });
}