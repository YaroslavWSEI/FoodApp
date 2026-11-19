import { Component, input, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { RestaurantsService } from '../../services/restaurants';
import { RestaurantMenu } from '../restaurant-menu/restaurant-menu';
import { CurrencyPipe } from '@angular/common';
import { Restaurant } from '../../models/restaurant.models';
import { AsyncState, idle, loading, success, error } from '../../shared/async-state';
import { StateViewComponent } from '../../shared/state-view/state-view';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-restaurants-details',
  standalone: true,
  imports: [RestaurantMenu, CurrencyPipe, StateViewComponent],
  templateUrl: './restaurants-details.html',
  styleUrl: './restaurants-details.scss'
})
export class RestaurantsDetails implements OnInit, OnDestroy {
  private restaurantService = inject(RestaurantsService);
  id = input.required<number>();

  state = signal<AsyncState<Restaurant>>(idle());
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load() {
    this.state.set(loading());
    this.restaurantService.fetchById(Number(this.id()))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => this.state.set(success(data)),
        error: () => this.state.set(error('Unable to load data.'))
      });
  }

  get stateStatus() { return this.state().status; }
  get restaurant() {
    const s = this.state();
    return s.status === 'success' ? s.data : null;
  }
}
