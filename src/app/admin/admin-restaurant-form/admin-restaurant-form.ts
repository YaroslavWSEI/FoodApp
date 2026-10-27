import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RestaurantsService } from '../../services/restaurants'; 
import { CuisinesService } from '../../services/cuisines';

@Component({
  selector: 'app-admin-restaurant-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-restaurant-form.html',
})
export class AdminRestaurantFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private restaurantsService = inject(RestaurantsService);
  private cuisinesService = inject(CuisinesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  restaurantForm!: FormGroup;
  isEditMode = false;
  restaurantId: number | null = null;
  availableCuisines = this.cuisinesService.cuisinesList;

  ngOnInit() {
    this.restaurantForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      cuisine: [null, Validators.required],
      imageUrl: [null],
      deliveryTimeMin: [null, [Validators.required, Validators.min(0)]],
      deliveryTimeMax: [null, [Validators.required, Validators.min(0)]],
      deliveryFee: [null, [Validators.required, Validators.min(0)]],
      minimumOrderValue: [null, [Validators.required, Validators.min(0)]],
      isActive: [true]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.restaurantId = Number(idParam);
      const restaurantToEdit = this.restaurantsService.getById(this.restaurantId);
      
      if (restaurantToEdit) {
        this.restaurantForm.patchValue(restaurantToEdit);
      }
    }
  }

  onSubmit() {
    if (this.restaurantForm.valid) {
      if (this.isEditMode && this.restaurantId !== null) {
        this.restaurantsService.update(this.restaurantId, this.restaurantForm.value);
      } else {
        this.restaurantsService.add(this.restaurantForm.value);
      }
      this.router.navigate(['/admin/restaurants']);
    } else {
      this.restaurantForm.markAllAsTouched();
    }
  }
}