import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CuisinesService, Cuisine } from '../../services/cuisines';

@Component({
  selector: 'app-admin-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-category-list.html'
})
export class AdminCategoryListComponent {
  private cuisinesService = inject(CuisinesService);

  searchTerm = signal('');

  filteredCategories = computed(() => {
    return this.cuisinesService.cuisinesList().filter((c: Cuisine) => 
      c.name.toLowerCase().includes(this.searchTerm().toLowerCase())
    );
  });

  onDeactivate(id: number, name: string) {
    if (confirm(`Czy na pewno chcesz dezaktywować kategorię ${name}?`)) {
      this.cuisinesService.deactivate(id);
    }
  }
}