import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';
import { RestaurantsService } from '../services/restaurants';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CurrencyPipe, RouterModule],
  templateUrl: './checkout.html'
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private cart = inject(CartService);
  private orderService = inject(OrderService);
  private auth = inject(AuthService);
  private restaurantsService = inject(RestaurantsService);
  private apiService = inject(ApiService);
  private router = inject(Router);

  DELIVERY_FEE = 5.99;
  submitting = signal(false);
  submitError = signal('');

  total = computed(() => this.cart.subtotal() + this.DELIVERY_FEE);

  restaurantName = computed(() => {
    const rid = this.cart.currentRestaurantId();
    if (!rid) return '';
    return this.restaurantsService.getById(rid)?.name ?? '';
  });

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    street: ['', Validators.required],
    buildingNumber: ['', Validators.required],
    apartmentNumber: [''],
    postalCode: ['', Validators.required],
    city: ['', Validators.required],
    paymentMethod: ['', Validators.required]
  });

  ngOnInit() {
    if (this.cart.itemCount() === 0) {
      this.router.navigate(['/cart']);
      return;
    }
    const user = this.auth.currentUser();
    if (user) {
      const nameParts = user.name.split(' ');
      this.form.patchValue({
        email: user.email,
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(' ') || ''
      });
      if (user.role === 'customer') {
        this.form.patchValue({
          street: user.deliveryAddress.street,
          buildingNumber: user.deliveryAddress.buildingNumber,
          apartmentNumber: user.deliveryAddress.apartmentNumber ?? '',
          postalCode: user.deliveryAddress.postalCode,
          city: user.deliveryAddress.city
        });
      }
    }
  }

  onSubmit() {
    if (this.form.invalid || this.cart.itemCount() === 0) return;
    const v = this.form.value;
    const user = this.auth.currentUser();
    const rid = this.cart.currentRestaurantId()!;

    const payload = {
      userId: user?.id ?? 'guest',
      restaurantId: rid,
      restaurantName: this.restaurantName(),
      items: this.cart.cartItems(),
      deliveryAddress: {
        firstName: v.firstName!,
        lastName: v.lastName!,
        email: v.email!,
        phone: v.phone!,
        street: v.street!,
        buildingNumber: v.buildingNumber!,
        apartmentNumber: v.apartmentNumber || undefined,
        postalCode: v.postalCode!,
        city: v.city!
      },
      paymentMethod: v.paymentMethod as any,
      subtotal: this.cart.subtotal(),
      deliveryFee: this.DELIVERY_FEE,
      total: this.total()
    };

    this.submitting.set(true);
    this.submitError.set('');

    this.apiService.postOrder(payload).subscribe({
      next: (apiOrder: any) => {
        const localOrder = this.orderService.placeOrderFromApi(apiOrder);
        this.cart.clear();
        this.submitting.set(false);
        this.router.navigate(['/orders', localOrder.id]);
      },
      error: () => {
        const localOrder = this.orderService.placeOrder(payload);
        this.cart.clear();
        this.submitting.set(false);
        this.router.navigate(['/orders', localOrder.id]);
      }
    });
  }
}
