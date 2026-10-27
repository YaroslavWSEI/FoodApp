import { Injectable, signal } from '@angular/core';

export interface Cuisine {
  id: number;
  name: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CuisinesService {
  private readonly STORAGE_KEY = 'foodapp_cuisines';
  private data = signal<Cuisine[]>(this.loadFromStorage());

  readonly cuisinesList = this.data.asReadonly();

  private loadFromStorage(): Cuisine[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Используем твои кухни из JSON
    return [
      { id: 1, name: 'polish', isActive: true },
      { id: 2, name: 'italian', isActive: true },
      { id: 3, name: 'american', isActive: true },
      { id: 4, name: 'thai', isActive: true },
      { id: 5, name: 'chinese', isActive: true }
    ];
  }
  private saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data()));
  }

  getAll() {
    return this.data();
  }

  getById(id: number) {
    return this.data().find((c) => c.id === id);
  }

  add(cuisine: Omit<Cuisine, 'id'>) {
    this.data.update((currentData) => {
      const newId = currentData.length > 0 ? Math.max(...currentData.map(c => c.id)) + 1 : 1;
      return [...currentData, { ...cuisine, id: newId } as Cuisine];
    });
    this.saveToStorage();
  }

  update(id: number, updatedData: Partial<Cuisine>) {
    this.data.update((currentData) =>
      currentData.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
    );
    this.saveToStorage();
  }

  deactivate(id: number) {
    this.update(id, { isActive: false });
  }
}