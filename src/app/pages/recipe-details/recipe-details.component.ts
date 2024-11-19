import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { NgForOf, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Recipe } from "../../interfaces/recipe";
import { RecipeService } from "../../services/recipe.service";
import { AuthService } from "../../services/auth.service";

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
  recipe: Recipe | null = null;
  isEditMode: boolean = false;
  currentUserId: string | null = null;
  canEdit: boolean = false;
  canLike: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private authService: AuthService
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

      this.canLike = this.currentUserId !== this.recipe.createdBy &&
        !!this.currentUserId &&
        !likedBy.includes(this.currentUserId);
    }
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  updateRecipe(): void {
    if (this.recipe) {
      this.recipeService.updateRecipe(this.recipe.id!, this.recipe).then(() => {
        this.toggleEditMode();
        alert('Recipe updated successfully!');
      }).catch(error => {
        console.error('Error updating recipe:', error);
      });
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
    this.router.navigate(['/recipes']);
  }
}
