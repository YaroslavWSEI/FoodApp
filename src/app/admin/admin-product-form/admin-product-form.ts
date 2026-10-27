import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductsService } from '../../services/product.service/product.service';
import { RestaurantsService } from '../../services/restaurants';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-product-form.html',
})
export class AdminProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productsService = inject(ProductsService);
  private restaurantsService = inject(RestaurantsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  productForm!: FormGroup;
  isEditMode = false;
  productId: number | null = null;

  availableRestaurants = this.restaurantsService.restaurantsList;

  ngOnInit() {
    this.productForm = this.fb.group({
      restaurantId: [null, Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      imageUrl: [null],
      deliveryTime: [null, Validators.min(0)],
      deliveryFee: [null, Validators.min(0)],
      minimumOrderValue: [null, Validators.min(0)],
      isActive: [true]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.productId = Number(idParam);
      const productToEdit = this.productsService.getById(this.productId);
      
      if (productToEdit) {
        this.productForm.patchValue(productToEdit);
      }
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formValue = {
        ...this.productForm.value,
        restaurantId: Number(this.productForm.value.restaurantId)
      };

      if (this.isEditMode && this.productId !== null) {
        this.productsService.update(this.productId, formValue);
      } else {
        this.productsService.add(formValue);
      }
      this.router.navigate(['/admin/products']);
    } else {
      this.productForm.markAllAsTouched();
    }
  }
}