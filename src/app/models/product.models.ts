export type Product = {
  id: number;
  name: string;
  description: string;
  price: number | null;
  imageUrl: string | null;
  rating: number | null;
  deliveryTime: number | null;
  deliveryFee: number | null;
  minimumOrderValue: number | null;
  isActive: boolean;
};