import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-state-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './state-view.html'
})
export class StateViewComponent {
  status = input.required<'idle' | 'loading' | 'success' | 'error'>();
  isEmpty = input(false);
  emptyMessage = input('Brak danych.');
  retry = output<void>();
}
