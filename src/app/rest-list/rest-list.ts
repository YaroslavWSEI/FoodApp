import { Component, signal } from '@angular/core';
import { RestCard } from '../rest-card/rest-card';
import data from '../../data/restaurants.json';
@Component({
  selector: 'app-rest-list',
  imports: [RestCard],
  templateUrl: './rest-list.html',
  styleUrl: './rest-list.scss',
})
export class RestList {
restaraunts = signal(data);
searchTerm = signal('');
onSearch(event: Event) {
  const input = event.target as HTMLInputElement;
  this.searchTerm.set(input.value);
}
}
