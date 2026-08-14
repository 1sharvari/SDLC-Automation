import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard.js';
import { LoginComponent } from './features/auth/login/login.component.js';
import { HomeComponent } from './features/home/home.component.js';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
