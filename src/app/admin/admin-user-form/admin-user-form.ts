import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './admin-user-form.html'
})
export class AdminUserFormComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  errorMessage = signal('');
  successMessage = signal('');

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    phone: ['']
  });

  onSubmit() {
    if (this.form.invalid) return;
    const v = this.form.value;
    const result = this.auth.createAdmin({
      name: v.name!,
      email: v.email!,
      password: v.password!,
      phone: v.phone || undefined
    });
    if (result.success) {
      this.successMessage.set('Konto administratora zostało utworzone.');
      setTimeout(() => this.router.navigate(['/admin/users']), 1500);
    } else {
      this.errorMessage.set(result.error || 'Błąd tworzenia konta.');
    }
  }
}
