import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-user-list.html'
})
export class AdminUserListComponent {
  private auth = inject(AuthService);

  searchTerm = signal('');

  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.auth.getAllUsers().filter(u =>
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  });

  onResetPassword(id: string, name: string) {
    if (id === 'admin-1') {
      alert('Nie można zresetować hasła głównego konta administratora.');
      return;
    }
    const newPassword = prompt(`Podaj nowe hasło dla użytkownika ${name}:`);
    if (newPassword && newPassword.length >= 6) {
      this.auth.resetPassword(id, newPassword);
      alert('Hasło zostało zresetowane.');
    } else if (newPassword !== null) {
      alert('Hasło musi mieć co najmniej 6 znaków.');
    }
  }

  onDelete(id: string, name: string) {
    const currentId = this.auth.currentUser()?.id;
    if (id === currentId) {
      alert('Nie możesz usunąć własnego konta.');
      return;
    }
    if (id === 'admin-1') {
      alert('Nie można usunąć głównego konta administratora.');
      return;
    }
    if (confirm(`Czy na pewno chcesz usunąć konto użytkownika ${name}?`)) {
      this.auth.deleteUser(id);
    }
  }
}
