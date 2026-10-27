import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminRestaurantListComponent } from './admin-restaurant-list';

describe('AdminRestaurantListComponent', () => {
  let component: AdminRestaurantListComponent;
  let fixture: ComponentFixture<AdminRestaurantListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRestaurantListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminRestaurantListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});