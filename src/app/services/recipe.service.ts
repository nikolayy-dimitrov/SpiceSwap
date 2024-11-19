import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  collectionData,
  docData
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Recipe } from '../interfaces/recipe';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  constructor(private firestore: Firestore) {}

  getRecipes(): Observable<Recipe[]> {
    const recipesRef = collection(this.firestore, 'recipes');
    return collectionData(recipesRef, { idField: 'id' }) as Observable<Recipe[]>;
  }

  getRecipeById(id: string): Observable<Recipe | undefined> {
    const recipeRef = doc(this.firestore, `recipes/${id}`);
    return docData(recipeRef, { idField: 'id' }) as Observable<Recipe | undefined>;
  }

  addRecipe(recipe: Recipe) {
    const recipesRef = collection(this.firestore, 'recipes');
    return addDoc(recipesRef, recipe);
  }

  updateRecipe(id: string, recipe: Partial<Recipe>) {
    const recipeDoc = doc(this.firestore, `recipes/${id}`);
    return updateDoc(recipeDoc, recipe);
  }

  deleteRecipe(id: string) {
    const recipeDoc = doc(this.firestore, `recipes/${id}`);
    return deleteDoc(recipeDoc);
  }
}
