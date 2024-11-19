import { Component, Input } from '@angular/core';
import { Recipe } from "../../interfaces/recipe";
import {DatePipe, NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import { Timestamp } from "@angular/fire/firestore";

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    DatePipe
  ],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css'
})
export class RecipeCardComponent {
  @Input() recipe: Recipe | undefined;

  formatDate(timestamp: Timestamp | Date | undefined): string {
    if (!timestamp) return '';

    const date = timestamp instanceof Date
      ? timestamp
      : timestamp.toDate();

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
