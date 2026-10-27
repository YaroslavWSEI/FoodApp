import { Injectable, signal } from '@angular/core';
import { Product } from '../../models/product.models';
import productsData from '../../../data/Menu.json'; 

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly STORAGE_KEY = 'foodapp_products';
  private data = signal<Product[]>(this.loadFromStorage());

  readonly productsList = this.data.asReadonly();

  private loadFromStorage(): Product[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return this.mapJsonToProducts(productsData);
  }

  private saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data()));
  }

  private mapJsonToProducts(jsonStringOrObject: any): Product[] {
    const flatProducts: Product[] = [];
    jsonStringOrObject.forEach((restaurantItem: any) => {
      restaurantItem.categories.forEach((categoryItem: any) => {
        categoryItem.products.forEach((prod: any) => {
          flatProducts.push({
            id: prod.id,
            restaurantId: restaurantItem.restaurantId,
            name: prod.nazwa,
            description: prod.opis,
            price: prod.cena,
            imageUrl: prod.zdjęcie,
            isActive: prod.dostepnosc,
            rating: null,
            deliveryTime: null,
            deliveryFee: null,
            minimumOrderValue: null
          });
        });
      });
    });
    return flatProducts;
  }

  getAll() {
    return this.data();
  }

  getById(id: number) {
    return this.data().find((product) => product.id === id);
  }

  add(product: Omit<Product, 'id' | 'rating'>) {
    this.data.update((currentData) => {
      const newId = currentData.length > 0 ? Math.max(...currentData.map(p => p.id)) + 1 : 1;
      const newProduct: Product = {
        ...product,
        id: newId,
        rating: null
      } as Product;
      return [...currentData, newProduct];
    });
    this.saveToStorage();
  }

  update(id: number, updatedData: Partial<Product>) {
    this.data.update((currentData) =>
      currentData.map((product) =>
        product.id === id ? { ...product, ...updatedData } : product
      )
    );
    this.saveToStorage();
  }

  deactivate(id: number) {
    this.update(id, { isActive: false });
  }
}