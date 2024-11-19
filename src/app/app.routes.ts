import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RecipesComponent } from "./pages/recipes/recipes.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { CreateRecipeComponent } from "./pages/create-recipe/create-recipe.component";
import { RecipeDetailsComponent } from "./pages/recipe-details/recipe-details.component";

import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';

import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'create-recipe', component: CreateRecipeComponent },
  { path: 'recipes', component: RecipesComponent },
  { path: 'recipes/:id', component: RecipeDetailsComponent },
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [GuestGuard] },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: '' }
];

export const appRouting = routes;
