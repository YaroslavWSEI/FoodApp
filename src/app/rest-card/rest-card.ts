import { Component, model, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import data from '../../data/restaurants.json';

type Restaurant = {
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

@Component({
  selector: 'app-rest-card',
  standalone: true,
  imports: [FormField],
  templateUrl: './rest-card.html',
  styleUrl: './rest-card.scss',
})
export class RestCard {
  private description = signal('123');
  private CanUpdate = signal(true);
  restaurant = model<Restaurant>({
  id: 0,
  name: '',
  description: '',
  cuisine: '',
  imageUrl: '',
  rating: 0,
  deliveryTimeMin: 0,
  deliveryTimeMax: 0,
  deliveryFee: 0,
  minimumOrderValue: 0,
  isActive: false,
  });
   private form=form(this.restaurant);
  private updateRestaurantData() {
    console.log('Updating restaurant data:', this.restaurant());
  }
  private onDescriptionChange(val :string) {
    console.log('Description changed:',val);
  }
}