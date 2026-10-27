import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminRestaurantFormComponent } from './admin-restaurant-form';

describe('AdminRestaurantFormComponent', () => {
  let component: AdminRestaurantFormComponent;
  let fixture: ComponentFixture<AdminRestaurantFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRestaurantFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminRestaurantFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});