import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CuisinesService } from '../../services/cuisines';

@Component({
  selector: 'app-admin-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-category-form.html',
})
export class AdminCategoryFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private cuisinesService = inject(CuisinesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  categoryForm!: FormGroup;
  isEditMode = false;
  categoryId: number | null = null;

  ngOnInit() {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      isActive: [true]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.categoryId = Number(idParam);
      const categoryToEdit = this.cuisinesService.getById(this.categoryId);
      
      if (categoryToEdit) {
        this.categoryForm.patchValue(categoryToEdit);
      }
    }
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      if (this.isEditMode && this.categoryId !== null) {
        this.cuisinesService.update(this.categoryId, this.categoryForm.value);
      } else {
        this.cuisinesService.add(this.categoryForm.value);
      }
      this.router.navigate(['/admin/categories']);
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }
}