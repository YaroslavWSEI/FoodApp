import { Injectable, computed, signal } from '@angular/core';
import { CartItem } from '../models/order.models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly STORAGE_KEY = 'foodapp_cart';

  private items = signal<CartItem[]>(this.load());
  private restaurantId = signal<number | null>(this.loadRestaurantId());
  private restaurantName = signal<string>('');

  readonly cartItems = this.items.asReadonly();
  readonly currentRestaurantId = this.restaurantId.asReadonly();
  readonly currentRestaurantName = this.restaurantName.asReadonly();

  readonly itemCount = computed(() => this.items().reduce((s, i) => s + i.quantity, 0));

  readonly subtotal = computed(() =>
    this.items().reduce((s, i) => s + i.price * i.quantity, 0)
  );

  private load(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private loadRestaurantId(): number | null {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY + '_rid');
      return raw ? Number(raw) : null;
    } catch {
      return null;
    }
  }

  private save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items()));
    const rid = this.restaurantId();
    if (rid !== null) {
      localStorage.setItem(this.STORAGE_KEY + '_rid', String(rid));
    } else {
      localStorage.removeItem(this.STORAGE_KEY + '_rid');
    }
  }

  addItem(item: CartItem, restName: string): 'added' | 'conflict' {
    if (this.restaurantId() !== null && this.restaurantId() !== item.restaurantId) {
      return 'conflict';
    }
    this.restaurantId.set(item.restaurantId);
    this.restaurantName.set(restName);
    this.items.update(curr => {
      const existing = curr.find(i => i.productId === item.productId);
      if (existing) {
        return curr.map(i =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...curr, { ...item, quantity: 1 }];
    });
    this.save();
    return 'added';
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    this.items.update(curr =>
      curr.map(i => i.productId === productId ? { ...i, quantity } : i)
    );
    this.save();
  }

  removeItem(productId: number) {
    this.items.update(curr => curr.filter(i => i.productId !== productId));
    if (this.items().length === 0) this.clear();
    else this.save();
  }

  clear() {
    this.items.set([]);
    this.restaurantId.set(null);
    this.restaurantName.set('');
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.STORAGE_KEY + '_rid');
  }

  initRestaurantName(name: string) {
    if (this.restaurantId() !== null) {
      this.restaurantName.set(name);
    }
  }
}
