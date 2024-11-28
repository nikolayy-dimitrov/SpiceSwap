import { Component } from '@angular/core';
import { RecipeInterface } from "../../interfaces/recipe.interface";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgForOf, NgIf } from "@angular/common";
import { RecipeService } from "../../services/recipe.service";

@Component({
  selector: 'app-create-recipe',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './create-recipe.component.html',
  styleUrl: './create-recipe.component.css'
})
export class CreateRecipeComponent {
  recipeForm: FormGroup;
  imageFile?: File;
  maxImageSizeInBytes = 5 * 1024 * 1024;
  allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

  errorMessages = {
    title: {
      required: 'Title is required',
      minlength: 'Title must be at least 3 characters long',
      maxlength: 'Title cannot exceed 100 characters'
    },
    image: {
      type: 'Invalid file type. Only JPEG, PNG, and GIF are allowed',
      size: 'Image size must be less than 5MB'
    }
  };

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private authService: AuthService,
    private router: Router
  ) {
    this.recipeForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      difficulty: ['Easy', Validators.required],
      ingredients: this.fb.array([], [
        Validators.required,
        Validators.minLength(1)
      ]),
      steps: this.fb.array([], [
        Validators.required,
        Validators.minLength(1)
      ])
    });
  }

  // Ingredients methods
  addIngredient(ingredient: string) {
    if (!ingredient.trim()) return;

    const ingredientsArray = this.recipeForm.get('ingredients') as FormArray;
    ingredientsArray.push(this.fb.control(ingredient.trim(), [
      Validators.required,
      Validators.maxLength(100)
    ]));
  }

  removeIngredient(index: number) {
    const ingredientsArray = this.recipeForm.get('ingredients') as FormArray;
    ingredientsArray.removeAt(index);
  }

  // Steps/Instructions methods
  addStep(step: string) {
    if (!step.trim()) return;

    const stepsArray = this.recipeForm.get('steps') as FormArray;
    stepsArray.push(this.fb.control(step.trim(), [
      Validators.required,
      Validators.maxLength(100)
    ]));
  }

  removeStep(index: number) {
    const stepsArray = this.recipeForm.get('steps') as FormArray;
    stepsArray.removeAt(index);
  }

  // Image upload validation
  validateImageFile(file: File): boolean {
    if (!this.allowedImageTypes.includes(file.type)) {
      alert(this.errorMessages.image.type);
      return false;
    }

    if (file.size > this.maxImageSizeInBytes) {
      alert(this.errorMessages.image.size);
      return false;
    }

    return true;
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (this.validateImageFile(file)) {
        this.imageFile = file;
      } else {
        input.value = '';
        this.imageFile = undefined;
      }
    }
  }

  async createRecipe() {
    // Mark all fields as touched to trigger validation display
    this.recipeForm.markAllAsTouched();

    if (this.recipeForm.invalid) {
      console.error('Form is invalid', this.recipeForm.errors);
      return;
    }

    try {
      const userId = this.authService.getCurrentUserId();
      const userName = this.authService.getCurrentUserName();

      if (!userId) {
        throw new Error('User is not logged in.');
      }

      const formValue = this.recipeForm.value;

      let imageUrl = '';
      if (this.imageFile) {
        imageUrl = await this.recipeService.uploadImage(this.imageFile);
      } else {
        imageUrl = 'https://firebasestorage.googleapis.com/v0/b/spiceswapapp.firebasestorage.app/o/default-image-recipe.jpg?alt=media&token=4c545371-c9ee-4c6b-8320-6584a1de3306';
      }

      const recipeData: RecipeInterface = {
        ...formValue,
        createdBy: userId,
        creatorName: userName || 'Anonymous',
        createdAt: new Date(),
        imageUrl,
        likes: 0,
        likedBy: []
      };

      // Add recipe
      await this.recipeService.addRecipe(recipeData);

      alert('Recipe created successfully!');
      await this.router.navigate(['/recipes']);

    } catch (error) {
      console.error('Error creating recipe:', error);

      // Error handling
      if (error instanceof Error) {
        alert(`Failed to create recipe: ${error.message}`);
      } else {
        alert('An unexpected error occurred while creating the recipe');
      }
    }
  }

  // Getter methods for form
  get titleErrors() {
    const titleControl = this.recipeForm.get('title');
    return titleControl?.errors && (titleControl.dirty || titleControl.touched);
  }

  get ingredientsArray() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get stepsArray() {
    return this.recipeForm.get('steps') as FormArray;
  }
}
