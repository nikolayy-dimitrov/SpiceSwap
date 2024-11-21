import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { RecipeInterface } from "../../interfaces/recipe.interface";
import { RecipeService } from "../../services/recipe.service";
import { FormsModule } from "@angular/forms";
import { NgForOf, NgIf } from "@angular/common";
import { RouterLink } from "@angular/router";
import { RecipeCardComponent } from "../../components/recipe-card/recipe-card.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    RouterLink,
    RecipeCardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  userRecipes: RecipeInterface[] = [];
  currentUserName: string | null = '';
  editMode: boolean = false;
  newDisplayName: string = '';

  constructor(
    private authService: AuthService,
    private recipeService: RecipeService
    ) {}

  ngOnInit(): void {
    this.currentUserName = this.authService.getCurrentUserName();
    this.newDisplayName = this.currentUserName || '';
    this.loadUserRecipes();
  }

  loadUserRecipes(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.recipeService.getRecipes().subscribe((recipes) => {
        this.userRecipes = recipes.filter((recipe) => recipe.createdBy === userId);
      });
    }
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  updateProfile(): void {
    const currentUser = this.authService.getCurrentUserName();
    if (this.newDisplayName && currentUser) {
      this.authService.updateDisplayName(this.newDisplayName).then(() => {
        alert('Profile updated successfully!');
        this.currentUserName = this.newDisplayName;
        this.editMode = false;
      }).catch((error) => {
        console.error('Error updating profile:', error);
      });
    }
  }

  deleteRecipe(recipeId: string): void {
    if (confirm('Are you sure you want to delete this recipe?')) {
      this.recipeService.deleteRecipe(recipeId).then(() => {
        alert('RecipeInterface deleted successfully!');
        this.loadUserRecipes();
      }).catch(error => {
        console.error('Error deleting recipe:', error);
      });
    }
  }

}
