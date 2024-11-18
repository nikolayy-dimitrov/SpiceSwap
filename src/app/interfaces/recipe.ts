export interface Recipe {
  id?: string;
  title: string;
  ingredients: string;
  steps: string;
  imageUrl: string;
  createdBy: string;
  likes: number;
}
