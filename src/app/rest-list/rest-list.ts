import { Component, computed, signal } from '@angular/core';
import { RestCard } from '../rest-card/rest-card';
import data from '../../data/restaurants.json';
import { Cuisine } from '../models/cuisines.models';

type SortOption = 'rating' | 'deliveryTime' | 'deliveryFee';

@Component({
  selector: 'app-rest-list',
  imports: [RestCard],
  templateUrl: './rest-list.html',
  styleUrl: './rest-list.scss',
})
export class RestList {
  restaurants = signal(data);

  searchTerm = signal('');
  selectedCuisine = signal<Cuisine>('All');
  onlyActive = signal(false);
  selectedSort = signal<SortOption>('rating');
  cuisines = ['All',...new Set(data.map(restaurant => restaurant.cuisine).filter(
    (cuisine): cuisine is NonNullable<typeof cuisine> => cuisine !== null))
  ];

  filteredRestaurants = computed(() => {
    let result = this.restaurants();

    const search = this.searchTerm().trim().toLowerCase();

    if (search) {result = result.filter(restaurant => restaurant.name.toLowerCase().includes(search));
    }

    const cuisine = this.selectedCuisine();

    if (cuisine !== 'All') {result = result.filter(restaurant =>restaurant.cuisine === cuisine);
    }

    if (this.onlyActive()) {
      result = result.filter(restaurant => restaurant.isActive);
    }

    switch (this.selectedSort()) {
      case 'rating':
        result = [...result].sort(
          (a, b) => (b.rating ?? 0) - (a.rating ?? 0)
        );
        break;

      case 'deliveryTime':
        result = [...result].sort(
          (a, b) => (a.deliveryTimeMin ?? Infinity) - (b.deliveryTimeMin ?? Infinity)
        );
        break;

      case 'deliveryFee':
        result = [...result].sort(
          (a, b) => (a.deliveryFee ?? Infinity) - (b.deliveryFee ?? Infinity)
        );
        break;
    }

    return result;
  });

  onSearch(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  onCuisineChange(event: Event) {
    this.selectedCuisine.set(
      (event.target as HTMLSelectElement).value as Cuisine
    );
  }

  onStatusChange(event: Event) {
    this.onlyActive.set((event.target as HTMLInputElement).checked);
  }

  onSortChange(event: Event) {
    this.selectedSort.set(
      (event.target as HTMLSelectElement).value as SortOption
    );
  }

  resetFilters() {
    this.searchTerm.set('');
    this.selectedCuisine.set('All');
    this.onlyActive.set(false);
    this.selectedSort.set('rating');
  }
}