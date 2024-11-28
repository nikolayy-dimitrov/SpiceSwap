import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { NgForOf, NgIf } from "@angular/common";
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { RecipeInterface } from "../../interfaces/recipe.interface";
import { RecipeService } from "../../services/recipe.service";
import { AuthService } from "../../services/auth.service";
import { Location } from "@angular/common";

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.css'
})
export class RecipeDetailsComponent implements OnInit {
  recipe: RecipeInterface | null = null;
  isEditMode: boolean = false;
  currentUserId: string | null = null;
  canEdit: boolean = false;
  canDelete: boolean = false;
  canLike: boolean = false;
  recipeForm: FormGroup;

  errorMessages = {
    ingredients: {
      required: 'An ingredient is required',
      maxlength: 'An ingredient cannot exceed 100 characters'
    },
    steps: {
      required: 'A step is required',
      maxlength: 'A step cannot exceed 100 characters'
    }
  };

  defaultImageUrl: string = "https://firebasestorage.googleapis.com/v0/b/spiceswapapp.firebasestorage.app/o/default-image-recipe.jpg?alt=media&token=4c545371-c9ee-4c6b-8320-6584a1de3306";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private authService: AuthService,
    private location: Location,
    private fb: FormBuilder
  ) {
    this.recipeForm = this.fb.group({
      title: [''],
      difficulty: ['', Validators.required],
      ingredients: this.fb.array([], [
        Validators.required,
        Validators.minLength(1)
      ]),
      steps: this.fb.array([], [
        Validators.required,
        Validators.minLength(1)
      ])
    })
  }

  ngOnInit(): void {
    const recipeId = this.route.snapshot.paramMap.get('id');
    this.currentUserId = this.authService.getCurrentUserId();

    if (recipeId) {
      this.fetchRecipe(recipeId);
    }
  }

  fetchRecipe(id: string): void {
    this.recipeService.getRecipeById(id).subscribe(recipe => {
      if (recipe) {
        this.recipe = {
          ...recipe,
          likedBy: recipe.likedBy || []
        };
        this.checkUserPermissions();
        this.initializeForm();
      }
    });
  }

  checkUserPermissions(): void {
    if (this.currentUserId && this.recipe) {
      const likedBy = this.recipe.likedBy || [];

      this.canEdit = this.currentUserId === this.recipe.createdBy;
      this.canDelete = this.currentUserId === this.recipe.createdBy;

      this.canLike = this.currentUserId !== this.recipe.createdBy &&
        !!this.currentUserId &&
        !likedBy.includes(this.currentUserId);
    }
  }

  initializeForm(): void {
    if (this.recipe) {
      const ingredientsArray = this.recipeForm.get('ingredients') as FormArray;
      const stepsArray = this.recipeForm.get('steps') as FormArray;

      ingredientsArray.clear();
      stepsArray.clear();

      this.recipeForm.patchValue({
        title: this.recipe.title,
        difficulty: this.recipe.difficulty
      });

      // Add ingredients to form array
      this.recipe.ingredients?.forEach(ingredient => {
        ingredientsArray.push(this.fb.control(ingredient, [
          Validators.required,
          Validators.maxLength(100)
        ]));
      });

      // Add steps to form array
      this.recipe.steps?.forEach(step => {
        stepsArray.push(this.fb.control(step, [
          Validators.required,
          Validators.maxLength(100)
        ]));
      });
    }
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  // Ingredients methods
  get ingredientsArray() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  addIngredient(ingredient: string) {
    if (!ingredient.trim()) return;

    this.ingredientsArray.push(this.fb.control(ingredient.trim(), [
      Validators.required,
      Validators.maxLength(100)
    ]));
  }

  removeIngredient(index: number) {
    this.ingredientsArray.removeAt(index);
  }

  get isIngredientsInvalid() {
    return this.ingredientsArray.length === 0 ||
      (this.ingredientsArray.invalid &&
        (this.ingredientsArray.dirty || this.ingredientsArray.touched));
  }

  // Steps methods
  get stepsArray() {
    return this.recipeForm.get('steps') as FormArray;
  }

  addStep(step: string) {
    if (!step.trim()) return;

    this.stepsArray.push(this.fb.control(step.trim(), [
      Validators.required,
      Validators.maxLength(100)
    ]));
  }

  removeStep(index: number) {
    this.stepsArray.removeAt(index);
  }

  get isStepsInvalid() {
    return this.stepsArray.length === 0 ||
      (this.stepsArray.invalid &&
        (this.stepsArray.dirty || this.stepsArray.touched));
  }

  // Recipe methods
  updateRecipe(): void {
    this.recipeForm.markAllAsTouched();

    if (this.recipeForm.invalid) {
      console.error('Form is invalid', this.recipeForm.errors);
      return;
    }

    if (this.recipe) {
      const updatedRecipe: RecipeInterface = {
        ...this.recipe,
        difficulty: this.recipeForm.get('difficulty')?.value,
        ingredients: this.recipeForm.get('ingredients')?.value,
        steps: this.recipeForm.get('steps')?.value
      };

      this.recipeService.updateRecipe(this.recipe.id!, updatedRecipe)
        .then(() => {
          this.toggleEditMode();
          alert('Recipe updated successfully!');
        })
        .catch(error => {
          console.error('Error updating recipe:', error);
          alert('Failed to update recipe');
        });
    }
  }

  deleteRecipe(): void {
    if (this.recipe?.id) {
      if (confirm('Are you sure you want to delete this recipe?')) {
        this.recipeService.deleteRecipe(this.recipe.id)
          .then(() => {
            alert('Recipe deleted successfully!');
            this.router.navigate(['/recipes']);
          })
          .catch(error => {
            console.error('Error deleting recipe:', error);
          });
      }
    }
  }

  likeRecipe(): void {
    if (this.recipe && this.canLike) {
      const userId = this.authService.getCurrentUserId();

      if (userId && !this.recipe.likedBy.includes(userId)) {
        const updatedRecipe = {
          ...this.recipe,
          likes: (this.recipe.likes || 0) + 1,
          likedBy: [...this.recipe.likedBy, userId]
        };

        this.recipeService.updateRecipe(this.recipe.id!, updatedRecipe)
          .then(() => {
            if (this.recipe) {
              this.recipe.likes++;
              this.recipe.likedBy.push(userId);
            }
          })
          .catch(error => {
            console.error('Error liking recipe:', error);
          });
      }
    }
  }

  goBack(): void {
    this.location.back();
  }
}
