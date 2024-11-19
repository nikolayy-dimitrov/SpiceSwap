export interface Recipe {
  id?: string;
  title: string;
  ingredients: string[];
  steps: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  imageUrl?: string;
  likes: number;
  createdBy: string;
  createdAt: Date;
}
