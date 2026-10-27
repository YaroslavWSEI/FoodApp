import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RestaurantsService } from '../../services/restaurants';
import { Restaurant } from '../../models/restaurant.models'; 

@Component({
  selector: 'app-admin-restaurant-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-restaurant-list.html',
  styles: [`
    th { cursor: pointer; user-select: none; }
    th:hover { background-color: #f0f0f0; }
  `]
})
export class AdminRestaurantListComponent {
  private restaurantsService = inject(RestaurantsService);

  searchTerm = signal('');
  showOnlyActive = signal(false);
  
  sortColumn = signal<keyof Restaurant | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');

  filteredRestaurants = computed(() => {
    let result = this.restaurantsService.restaurantsList().filter((r: Restaurant) => {
      const matchesSearch = r.name.toLowerCase().includes(this.searchTerm().toLowerCase());
      const matchesActive = this.showOnlyActive() ? r.isActive : true;
      return matchesSearch && matchesActive;
    });

    const col = this.sortColumn();
    if (col) {
      const dir = this.sortDirection() === 'asc' ? 1 : -1;
      result = [...result].sort((a, b) => {
        let valA = a[col] !== null && a[col] !== undefined ? a[col] : '';
        let valB = b[col] !== null && b[col] !== undefined ? b[col] : '';
        
        if (valA < valB) return -1 * dir;
        if (valA > valB) return 1 * dir;
        return 0;
      });
    }

    return result;
  });

  toggleSort(column: keyof Restaurant) {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  onDeactivate(id: number, name: string) {
    if (confirm(`Czy na pewno chcesz dezaktywować restaurację ${name}?`)) {
      this.restaurantsService.deactivate(id);
    }
  }
}