import { Injectable, computed, signal } from '@angular/core';
import { Address, AdminAccount, CustomerAccount, UserAccount, UserProfile } from '../models/user.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'foodapp_users';
  private readonly SESSION_KEY = 'foodapp_session';

  private users = signal<UserAccount[]>(this.loadUsers());
  private currentUserId = signal<string | null>(this.loadSession());

  readonly currentUser = computed<UserAccount | null>(() => {
    const id = this.currentUserId();
    if (!id) return null;
    return this.users().find(u => u.id === id) ?? null;
  });

  readonly currentUserProfile = computed<UserProfile | null>(() => {
    const user = this.currentUser();
    if (!user) return null;
    const { passwordHash, ...profile } = user;
    return profile as UserProfile;
  });

  readonly isLoggedIn = computed<boolean>(() => this.currentUser() !== null);
  readonly isAdmin = computed<boolean>(() => this.currentUser()?.role === 'admin');

  private simpleHash(password: string): string {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return 'hash_' + Math.abs(hash).toString(16);
  }

  private loadUsers(): UserAccount[] {
    const stored = localStorage.getItem(this.USERS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as UserAccount[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
      }
    }
    const seedAdmin: AdminAccount = {
      id: 'admin-1',
      name: 'Admin',
      email: 'admin@food.app',
      passwordHash: this.simpleHash('admin123'),
      role: 'admin'
    };
    const initial = [seedAdmin];
    localStorage.setItem(this.USERS_KEY, JSON.stringify(initial));
    return initial;
  }

  private loadSession(): string | null {
    return localStorage.getItem(this.SESSION_KEY);
  }

  private saveUsers(): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(this.users()));
  }

  register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    deliveryAddress: Address;
  }): { success: boolean; error?: string } {
    const existing = this.users().find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return { success: false, error: 'Użytkownik z tym adresem e-mail już istnieje.' };
    }
    const newUser: CustomerAccount = {
      id: 'user-' + Date.now(),
      name: data.name,
      email: data.email,
      passwordHash: this.simpleHash(data.password),
      phone: data.phone,
      role: 'customer',
      deliveryAddress: data.deliveryAddress
    };
    this.users.update(users => [...users, newUser]);
    this.saveUsers();
    return { success: true };
  }

  createAdmin(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): { success: boolean; error?: string } {
    const existing = this.users().find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return { success: false, error: 'Użytkownik z tym adresem e-mail już istnieje.' };
    }
    const newAdmin: AdminAccount = {
      id: 'admin-' + Date.now(),
      name: data.name,
      email: data.email,
      passwordHash: this.simpleHash(data.password),
      phone: data.phone,
      role: 'admin'
    };
    this.users.update(users => [...users, newAdmin]);
    this.saveUsers();
    return { success: true };
  }

  login(email: string, password: string): { success: boolean; error?: string } {
    const hash = this.simpleHash(password);
    const user = this.users().find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === hash
    );
    if (!user) {
      return { success: false, error: 'Nieprawidłowy e-mail lub hasło.' };
    }
    this.currentUserId.set(user.id);
    localStorage.setItem(this.SESSION_KEY, user.id);
    return { success: true };
  }

  logout(): void {
    this.currentUserId.set(null);
    localStorage.removeItem(this.SESSION_KEY);
  }

  updateProfile(
    id: string,
    data: { name?: string; email?: string; phone?: string; deliveryAddress?: Address }
  ): { success: boolean; error?: string } {
    if (data.email) {
      const conflict = this.users().find(
        u => u.email.toLowerCase() === data.email!.toLowerCase() && u.id !== id
      );
      if (conflict) {
        return { success: false, error: 'Ten adres e-mail jest już zajęty.' };
      }
    }
    this.users.update(users =>
      users.map(u => {
        if (u.id !== id) return u;
        const updated = {
          ...u,
          ...(data.name !== undefined ? { name: data.name } : {}),
          ...(data.email !== undefined ? { email: data.email } : {}),
          ...(data.phone !== undefined ? { phone: data.phone } : {}),
        };
        if (u.role === 'customer' && data.deliveryAddress) {
          (updated as CustomerAccount).deliveryAddress = data.deliveryAddress;
        }
        return updated;
      })
    );
    this.saveUsers();
    return { success: true };
  }

  resetPassword(id: string, newPassword: string): void {
    if (id === 'admin-1') return;
    this.users.update(users =>
      users.map(u => u.id === id ? { ...u, passwordHash: this.simpleHash(newPassword) } : u)
    );
    this.saveUsers();
  }

  deleteUser(id: string): void {
    if (id === 'admin-1') return;
    this.users.update(users => users.filter(u => u.id !== id));
    this.saveUsers();
  }

  getAllUsers(): UserProfile[] {
    return this.users().map(u => {
      const { passwordHash, ...profile } = u;
      return profile as UserProfile;
    });
  }
}
