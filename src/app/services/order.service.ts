import { Injectable, signal } from '@angular/core';
import { Order, OrderStatus } from '../models/order.models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly STORAGE_KEY = 'foodapp_orders';

  private orders = signal<Order[]>(this.load());

  readonly allOrders = this.orders.asReadonly();

  private load(): Order[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.orders()));
  }

  placeOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Order {
    const newOrder: Order = {
      ...order,
      id: 'ord-' + Date.now(),
      status: 'Nowe',
      createdAt: new Date().toISOString()
    };
    this.orders.update(o => [newOrder, ...o]);
    this.save();
    return newOrder;
  }

  getOrdersByUser(userId: string): Order[] {
    return this.orders().filter(o => o.userId === userId);
  }

  getById(id: string): Order | undefined {
    return this.orders().find(o => o.id === id);
  }

  placeOrderFromApi(apiOrder: any): Order {
    this.orders.update(o => [apiOrder as Order, ...o]);
    this.save();
    return apiOrder as Order;
  }

  updateStatus(id: string, status: OrderStatus) {
    this.orders.update(orders =>
      orders.map(o => o.id === id ? { ...o, status } : o)
    );
    this.save();
  }
}
