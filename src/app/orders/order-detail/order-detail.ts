import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Order, OrderStatus } from '../../models/order.models';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, RouterModule, FormsModule],
  templateUrl: './order-detail.html'
})
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private auth = inject(AuthService);

  order = signal<Order | undefined>(undefined);
  isAdmin = this.auth.isAdmin;

  statuses: OrderStatus[] = [
    'Nowe', 'Przyjęte', 'W przygotowaniu', 'Gotowe', 'W dostawie', 'Dostarczone', 'Anulowane'
  ];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.order.set(this.orderService.getById(id));
  }

  changeStatus(status: string) {
    const o = this.order();
    if (!o) return;
    this.orderService.updateStatus(o.id, status as OrderStatus);
    this.order.set(this.orderService.getById(o.id));
  }

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
