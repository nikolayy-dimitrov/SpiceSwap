import { Component } from '@angular/core';
import { RecipeInterface } from "../../interfaces/recipe.interface";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { FormsModule, NgForm } from "@angular/forms";
import { NgForOf, NgIf } from "@angular/common";
import { RecipeService } from "../../services/recipe.service";

@Component({
  selector: 'app-create-recipe',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './create-recipe.component.html',
  styleUrl: './create-recipe.component.css'
})
export class CreateRecipeComponent {
  recipe: Partial<RecipeInterface> = {
    title: '',
    ingredients: [],
    steps: [],
    difficulty: 'Easy',
    likes: 0,
    likedBy: []
  };
  ingredient: string = '';
  step: string = '';
  imageFile?: File;

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

  isFormValid(): boolean {
    return !!(
      this.recipe.title &&
      this.recipe.ingredients?.length &&
      this.recipe.steps?.length
    );
  }

  async createRecipe(form: NgForm) {
    if (!form.valid || !this.isFormValid()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const userId = this.authService.getCurrentUserId();
      const userName = this.authService.getCurrentUserName();
      if (!userId) {
        throw new Error('User is not logged in.');
      }

      let imageUrl = '';
      if (this.imageFile) {
        imageUrl = await this.recipeService.uploadImage(this.imageFile);
      } else {
        imageUrl = 'https://firebasestorage.googleapis.com/v0/b/spiceswapapp.firebasestorage.app/o/default-image-recipe.jpg?alt=media&token=4c545371-c9ee-4c6b-8320-6584a1de3306';
      }

      const recipeData: RecipeInterface = {
        ...this.recipe,
        createdBy: userId,
        creatorName: userName || 'Anonymous',
        createdAt: new Date(),
        imageUrl,
        likes: 0
      } as RecipeInterface;

      await this.recipeService.addRecipe(recipeData);
      alert('Recipe created successfully!');
      await this.router.navigate(['/recipes']);
    } catch (error) {
      console.error('Error creating recipe:', error);
      alert('Failed to create recipe');
    }
  }

  onFileChange(event: any) {
    this.imageFile = event.target.files[0];
  }
}
