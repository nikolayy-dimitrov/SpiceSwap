import { Component, Input } from '@angular/core';
import { RecipeInterface } from "../../interfaces/recipe.interface";
import { DatePipe, NgForOf, NgIf, SlicePipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { Timestamp } from "@angular/fire/firestore";

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    DatePipe,
    SlicePipe,
    NgIf
  ],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css'
})
export class RecipeCardComponent {
  @Input() recipe: RecipeInterface | undefined;
  defaultImageUrl: string = "https://firebasestorage.googleapis.com/v0/b/spiceswapapp.firebasestorage.app/o/default-image-recipe.jpg?alt=media&token=4c545371-c9ee-4c6b-8320-6584a1de3306";

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
