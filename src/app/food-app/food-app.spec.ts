import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FoodApp } from './food-app';

describe('FoodApp', () => {
  let component: FoodApp;
  let fixture: ComponentFixture<FoodApp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodApp],
    }).compileComponents();

    fixture = TestBed.createComponent(FoodApp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
