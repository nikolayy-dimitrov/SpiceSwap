import { Component, OnInit } from '@angular/core';
import { RecipeInterface } from "../../interfaces/recipe.interface";
import { RecipeService } from "../../services/recipe.service";
import { RecipeCardComponent } from "../../components/recipe-card/recipe-card.component";
import { NgForOf, DatePipe, NgClass } from "@angular/common";

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [
    RecipeCardComponent,
    NgForOf,
    DatePipe,
    NgClass
  ],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css'
})
export class RecipesComponent implements OnInit {
  recipes: RecipeInterface[] = [];
  filteredRecipes: RecipeInterface[] = [];
  selectedDifficulty: string = 'All';
  sortOrder: 'asc' | 'desc' = 'desc';
  difficulties: string[] = ['All', 'Easy', 'Medium', 'Hard'];

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService.getRecipes().subscribe(recipes => {
      this.recipes = recipes;
      this.applyFiltersAndSort();
    });
  }

  applyFiltersAndSort(): void {
    this.filteredRecipes = this.recipes.filter(recipe => {
      if (this.selectedDifficulty === 'All') return true;
      return recipe.difficulty === this.selectedDifficulty;
    });

    this.filteredRecipes.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : a.createdAt.toDate();
      const dateB = b.createdAt instanceof Date ? b.createdAt : b.createdAt.toDate();
      return this.sortOrder === 'desc'
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });
  }

  onDifficultyChange(difficulty: string): void {
    this.selectedDifficulty = difficulty;
    this.applyFiltersAndSort();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
    this.applyFiltersAndSort();
  }
}
