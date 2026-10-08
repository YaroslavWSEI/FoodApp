export type Restaurant = {
    id: number;
    name: string;
    description: string;
    cuisine: string | null;
    imageUrl: string | null;
    rating: number | null;
    deliveryTimeMin: number | null;
    deliveryTimeMax: number | null;
    deliveryFee: number | null;
    minimumOrderValue: number | null;
    isActive: boolean;
    
}; 