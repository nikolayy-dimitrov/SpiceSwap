import { Component, OnInit } from '@angular/core';
import { collection, Firestore, getDocs } from "@angular/fire/firestore";
import { Recipe } from "../../interfaces/recipe";

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

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    this.fetchRecipes();
  }

  async fetchRecipes() {
    try {
      const recipeCollection = collection(this.firestore, 'recipes');
      const recipeSnapshot = await getDocs(recipeCollection);
      this.recipes = recipeSnapshot.docs.map(doc => doc.data() as Recipe);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  }
}
