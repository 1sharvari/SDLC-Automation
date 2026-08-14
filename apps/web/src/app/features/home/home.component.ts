import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container" data-testid="home-container">
      <header class="header">
        <h1>Welcome, <span data-testid="user-display-name">{{ authService.currentUser()?.username }}</span>!</h1>
        <button (click)="logout()" data-testid="logout-button" class="btn-logout">Log Out</button>
      </header>
      <main class="main-content" data-testid="home-content">
        <p>You have successfully logged in to the platform.</p>
      </main>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 1rem;
    }
    .btn-logout {
      padding: 0.5rem 1rem;
      background-color: #ef4444;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class HomeComponent {
  public readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
