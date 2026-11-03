import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './profile.html'
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  auth = inject(AuthService);

  errorMessage = signal('');
  successMessage = signal('');
  isCustomer = computed(() => this.auth.currentUser()?.role === 'customer');

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    street: [''],
    buildingNumber: [''],
    apartmentNumber: [''],
    postalCode: [''],
    city: ['']
  });

  ngOnInit() {
    const user = this.auth.currentUser();
    if (!user) return;
    this.form.patchValue({
      name: user.name,
      email: user.email,
      phone: user.phone || ''
    });
    if (user.role === 'customer') {
      this.form.patchValue({
        street: user.deliveryAddress.street,
        buildingNumber: user.deliveryAddress.buildingNumber,
        apartmentNumber: user.deliveryAddress.apartmentNumber || '',
        postalCode: user.deliveryAddress.postalCode,
        city: user.deliveryAddress.city
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    const user = this.auth.currentUser();
    if (!user) return;
    const v = this.form.value;
    const updateData: any = {
      name: v.name!,
      email: v.email!,
      phone: v.phone || undefined
    };
    if (user.role === 'customer') {
      updateData.deliveryAddress = {
        street: v.street!,
        buildingNumber: v.buildingNumber!,
        apartmentNumber: v.apartmentNumber || undefined,
        postalCode: v.postalCode!,
        city: v.city!
      };
    }
    const result = this.auth.updateProfile(user.id, updateData);
    if (result.success) {
      this.successMessage.set('Profil został zaktualizowany.');
      this.errorMessage.set('');
    } else {
      this.errorMessage.set(result.error || 'Błąd aktualizacji.');
      this.successMessage.set('');
    }
  }
}
