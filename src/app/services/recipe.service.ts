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
import { RecipeInterface } from '../interfaces/recipe.interface';
import { getDownloadURL, getStorage, ref, uploadBytes } from "@angular/fire/storage";

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private storage = getStorage();

  constructor(private firestore: Firestore) {}

  getRecipes(): Observable<RecipeInterface[]> {
    const recipesRef = collection(this.firestore, 'recipes');
    return collectionData(recipesRef, { idField: 'id' }) as Observable<RecipeInterface[]>;
  }

  getRecipeById(id: string): Observable<RecipeInterface | undefined> {
    const recipeRef = doc(this.firestore, `recipes/${id}`);
    return docData(recipeRef, { idField: 'id' }) as Observable<RecipeInterface | undefined>;
  }

  addRecipe(recipe: RecipeInterface) {
    const recipesRef = collection(this.firestore, 'recipes');
    return addDoc(recipesRef, recipe);
  }

  async uploadImage(file: File): Promise<string> {
    const filePath = `recipe-images/${Date.now()}_${file.name}`;
    const storageRef = ref(this.storage, filePath);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  }

  updateRecipe(id: string, recipe: Partial<RecipeInterface>) {
    const recipeDoc = doc(this.firestore, `recipes/${id}`);
    return updateDoc(recipeDoc, recipe);
  }

  deleteRecipe(id: string) {
    const recipeDoc = doc(this.firestore, `recipes/${id}`);
    return deleteDoc(recipeDoc);
  }
}
