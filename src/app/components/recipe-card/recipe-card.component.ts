import { Component, Input } from '@angular/core';
import { Recipe } from "../../interfaces/recipe";
import { NgForOf } from "@angular/common";

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css'
})
export class RecipeCardComponent {
  @Input() recipe: Recipe | undefined;
}
