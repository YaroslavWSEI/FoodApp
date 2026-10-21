export type Product = {
  id?: number;
  nazwa: string;
  opis: string;
  cena: number;
  zdjęcie: string;
  dostepnosc: boolean;
};

export type MenuCategory = {
  category: string;
  products: Product[];
};

export type RestaurantMenuData = {
  restaurantId: number;
  categories: MenuCategory[];
};