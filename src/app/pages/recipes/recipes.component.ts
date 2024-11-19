import { Component, OnInit } from '@angular/core';
import { Recipe } from "../../interfaces/recipe";

import { RecipeService } from "../../services/recipe.service";
import { RecipeCardComponent } from "../../components/recipe-card/recipe-card.component";
import { NgForOf } from "@angular/common";

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [
    RecipeCardComponent,
    NgForOf
  ],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css'
})
export class RecipesComponent implements OnInit {
  recipes: Recipe[] = [];

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService.getRecipes().subscribe(recipes => {
      this.recipes = recipes;
    });
  }
}
