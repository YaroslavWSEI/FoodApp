import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-list.html'
})
export class OrderListComponent {
  private orderService = inject(OrderService);
  private auth = inject(AuthService);

  isAdmin = this.auth.isAdmin;

  orders = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    if (user.role === 'admin') return this.orderService.allOrders();
    return this.orderService.getOrdersByUser(user.id);
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
