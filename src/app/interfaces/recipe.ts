import {Timestamp} from "@angular/fire/firestore";

export interface Recipe {
  id?: string;
  title: string;
  ingredients: string[];
  steps: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  imageUrl?: string;
  likes: number;
  likedBy: string[];
  createdBy: string;
  creatorName: string;
  createdAt: Timestamp | Date;
}
