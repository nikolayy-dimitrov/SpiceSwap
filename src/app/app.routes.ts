import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RecipesComponent } from "./pages/recipes/recipes.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { CreateRecipeComponent } from "./pages/create-recipe/create-recipe.component";
import { RecipeDetailsComponent } from "./pages/recipe-details/recipe-details.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";

import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';

import { authGuard } from "./guards/auth.guard";
import { guestGuard } from "./guards/guest.guard";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'create-recipe', component: CreateRecipeComponent, canActivate: [authGuard] },
  { path: 'recipes', component: RecipesComponent },
  { path: 'recipes/:id', component: RecipeDetailsComponent },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: '**', component: NotFoundComponent },
];

export const appRouting = routes;
