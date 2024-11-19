import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RecipesComponent } from "./pages/recipes/recipes.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { CreateRecipeComponent } from "./pages/create-recipe/create-recipe.component";

import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';

import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'recipes', component: RecipesComponent },
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [GuestGuard] },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'create-recipe', component: CreateRecipeComponent },
  { path: '**', redirectTo: '' }
];

export const appRouting = routes;
