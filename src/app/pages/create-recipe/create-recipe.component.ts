import { Component } from '@angular/core';
import { Recipe } from "../../interfaces/recipe";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { NgForOf } from "@angular/common";
import { RecipeService } from "../../services/recipe.service";

@Component({
  selector: 'app-create-recipe',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './create-recipe.component.html',
  styleUrl: './create-recipe.component.css'
})
export class CreateRecipeComponent {
  recipe: Partial<Recipe> = {
    title: '',
    ingredients: [],
    steps: [],
    difficulty: 'Easy',
    likes: 0,
    likedBy: []
  };
  ingredient: string = '';
  step: string = ''

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService,
    private router: Router
  ) {}

  addIngredient() {
    if (this.ingredient.trim()) {
      this.recipe.ingredients?.push(this.ingredient);
      this.ingredient = '';
    }
  }

  removeIngredient(index: number) {
    this.recipe.ingredients?.splice(index, 1);
  }

  addStep() {
    if (this.step.trim()) {
      this.recipe.steps?.push(this.step);
      this.step = '';
    }
  }

  removeStep(index: number) {
    this.recipe.steps?.splice(index, 1);
  }

  async createRecipe() {
    try {
      const userId = this.authService.getCurrentUserId();
      const userName = this.authService.getCurrentUserName();
      if (!userId) {
        throw new Error('User is not logged in.');
      }

      const recipeData: Recipe = {
        ...this.recipe,
        createdBy: userId,
        creatorName: userName || 'Anonymous',
        createdAt: new Date(),
        likes: 0
      } as Recipe;

      await this.recipeService.addRecipe(recipeData);
      alert('Recipe created successfully!');
      await this.router.navigate(['/recipes']);
    } catch (error) {
      console.error('Error creating recipe:', error);
      alert('Failed to create recipe');
    }
  }
}
