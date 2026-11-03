import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.parent?.get('password')?.value;
  return control.value === password ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.html'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  errorMessage = signal('');
  successMessage = signal('');

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, passwordMatchValidator]],
    deliveryAddress: this.fb.group({
      street: ['', Validators.required],
      buildingNumber: ['', Validators.required],
      apartmentNumber: [''],
      postalCode: ['', Validators.required],
      city: ['', Validators.required]
    })
  });

  onSubmit() {
    if (this.form.invalid) return;
    const v = this.form.value;
    const result = this.auth.register({
      name: v.name!,
      email: v.email!,
      password: v.password!,
      phone: v.phone || undefined,
      deliveryAddress: {
        street: v.deliveryAddress!.street!,
        buildingNumber: v.deliveryAddress!.buildingNumber!,
        apartmentNumber: v.deliveryAddress!.apartmentNumber || undefined,
        postalCode: v.deliveryAddress!.postalCode!,
        city: v.deliveryAddress!.city!
      }
    });
    if (result.success) {
      this.successMessage.set('Konto zostało utworzone! Możesz się teraz zalogować.');
      setTimeout(() => this.router.navigate(['/login']), 2000);
    } else {
      this.errorMessage.set(result.error || 'Błąd rejestracji');
    }
  }
}
