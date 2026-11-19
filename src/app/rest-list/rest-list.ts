import { Component, computed, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { RestCard } from '../rest-card/rest-card';
import { Restaurant } from '../models/restaurant.models';
import { RestaurantsService } from '../services/restaurants';
import { CuisinesService } from '../services/cuisines';
import { AsyncState, idle, loading, success, error } from '../shared/async-state';
import { StateViewComponent } from '../shared/state-view/state-view';
import { Subject, debounceTime, takeUntil } from 'rxjs';

type SortOption = 'rating' | 'deliveryTime' | 'deliveryFee';

@Component({
  selector: 'app-rest-list',
  standalone: true,
  imports: [RestCard, StateViewComponent],
  templateUrl: './rest-list.html',
  styleUrl: './rest-list.scss',
})
export class RestList implements OnInit, OnDestroy {
  restaurantsService = inject(RestaurantsService);
  cuisinesService = inject(CuisinesService);

  state = signal<AsyncState<Restaurant[]>>(idle());
  searchTerm = signal('');
  selectedCuisine = signal<string>('All');
  onlyActive = signal(false);
  selectedSort = signal<SortOption>('rating');

  private searchInput$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  cuisines = computed(() => {
    const activeCuisines = this.cuisinesService.cuisinesList()
      .filter(c => c.isActive)
      .map(c => c.name);
    return ['All', ...activeCuisines];
  });

  filteredRestaurants = computed(() => {
    const s = this.state();
    if (s.status !== 'success') return [];
    let result = s.data;
    const search = this.searchTerm().trim().toLowerCase();
    if (search) result = result.filter(r => r.name.toLowerCase().includes(search));
    const cuisine = this.selectedCuisine();
    if (cuisine !== 'All') result = result.filter(r => r.cuisine === cuisine);
    if (this.onlyActive()) result = result.filter(r => r.isActive);
    switch (this.selectedSort()) {
      case 'rating': return [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      case 'deliveryTime': return [...result].sort((a, b) => (a.deliveryTimeMin ?? Infinity) - (b.deliveryTimeMin ?? Infinity));
      case 'deliveryFee': return [...result].sort((a, b) => (a.deliveryFee ?? Infinity) - (b.deliveryFee ?? Infinity));
    }
    return result;
  });

  ngOnInit() {
    this.searchInput$.pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(term => this.searchTerm.set(term));
    this.load();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load() {
    this.state.set(loading());
    this.restaurantsService.fetchAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => this.state.set(success(data)),
        error: () => this.state.set(error('Unable to load data.'))
      });
  }

  onSearch(event: Event) {
    this.searchInput$.next((event.target as HTMLInputElement).value);
  }

  onCuisineChange(event: Event) {
    this.selectedCuisine.set((event.target as HTMLSelectElement).value);
  }

  onStatusChange(event: Event) {
    this.onlyActive.set((event.target as HTMLInputElement).checked);
  }

  onSortChange(event: Event) {
    this.selectedSort.set((event.target as HTMLSelectElement).value as SortOption);
  }

  resetFilters() {
    this.searchTerm.set('');
    this.selectedCuisine.set('All');
    this.onlyActive.set(false);
    this.selectedSort.set('rating');
  }

  get stateStatus() {
    return this.state().status;
  }
}
