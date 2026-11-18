import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { OrderStatus } from '../../models/order.models';

@Component({
  selector: 'app-admin-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-order-list.html'
})
export class AdminOrderListComponent {
  private orderService = inject(OrderService);

  statusFilter = signal<string>('');

  statuses: OrderStatus[] = [
    'Nowe', 'Przyjęte', 'W przygotowaniu', 'Gotowe', 'W dostawie', 'Dostarczone', 'Anulowane'
  ];

  filtered = computed(() => {
    const f = this.statusFilter();
    const all = this.orderService.allOrders();
    return f ? all.filter(o => o.status === f) : all;
  });

  statusClass(status: string): string {
    const map: Record<string, string> = {
      'Nowe': 'bg-secondary',
      'Przyjęte': 'bg-info text-dark',
      'W przygotowaniu': 'bg-warning text-dark',
      'Gotowe': 'bg-primary',
      'W dostawie': 'bg-info',
      'Dostarczone': 'bg-success',
      'Anulowane': 'bg-danger'
    };
    return map[status] ?? 'bg-secondary';
  }
}
