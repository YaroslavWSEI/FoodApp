export type OrderStatus =
  | 'Nowe'
  | 'Przyjęte'
  | 'W przygotowaniu'
  | 'Gotowe'
  | 'W dostawie'
  | 'Dostarczone'
  | 'Anulowane';

export type PaymentMethod = 'Karta' | 'Gotówka' | 'BLIK';

export type CartItem = {
  productId: number;
  restaurantId: number;
  name: string;
  price: number;
  quantity: number;
};

export type DeliveryAddress = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  buildingNumber: string;
  apartmentNumber?: string;
  postalCode: string;
  city: string;
};

export type Order = {
  id: string;
  userId: string;
  restaurantId: number;
  restaurantName: string;
  items: CartItem[];
  deliveryAddress: DeliveryAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
};
