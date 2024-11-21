import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { NgForOf, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RecipeInterface } from "../../interfaces/recipe.interface";
import { RecipeService } from "../../services/recipe.service";
import { AuthService } from "../../services/auth.service";
import { Location } from "@angular/common";

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf
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

  newIngredient: string = '';
  newStep: string = '';

  defaultImageUrl: string = "https://firebasestorage.googleapis.com/v0/b/spiceswapapp.firebasestorage.app/o/default-image-recipe.jpg?alt=media&token=4c545371-c9ee-4c6b-8320-6584a1de3306";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private authService: AuthService,
    private location: Location
  ) {}

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

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  addIngredient() {
    if (this.newIngredient.trim()) {
      if (!this.recipe!.ingredients) {
        this.recipe!.ingredients = [];
      }
      this.recipe!.ingredients.push(this.newIngredient.trim());
      this.newIngredient = '';
    }
  }

  removeIngredient(index: number) {
    this.recipe!.ingredients.splice(index, 1);
  }

  addStep() {
    if (this.newStep.trim()) {
      if (!this.recipe!.steps) {
        this.recipe!.steps = [];
      }
      this.recipe!.steps.push(this.newStep.trim());
      this.newStep = '';
    }
  }

  removeStep(index: number) {
    this.recipe!.steps.splice(index, 1);
  }

  updateRecipe(): void {
    if (this.recipe) {
      this.recipe.ingredients = this.recipe.ingredients || [];
      this.recipe.steps = this.recipe.steps || [];

      this.recipeService.updateRecipe(this.recipe.id!, this.recipe).then(() => {
        this.toggleEditMode();
        alert('Recipe updated successfully!');
      }).catch(error => {
        console.error('Error updating recipe:', error);
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
