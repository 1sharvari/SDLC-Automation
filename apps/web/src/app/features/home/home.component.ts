import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-wrapper">
      <header>
        <h2>SDLC App Dashboard</h2>
        <div class="user-box">
          <span data-testid="welcome-message">Hello, {{ authService.currentUser()?.username || 'Admin' }}</span>
          <button data-testid="logout-button" (click)="authService.logout()">Sign Out</button>
        </div>
      </header>
      <main>
        <h3>Welcome to Home</h3>
      </main>
    </div>
  `,
  styles: [`
    header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: white; border-bottom: 1px solid #e2e8f0; }
    .user-box { display: flex; gap: 1rem; align-items: center; }
    button { background: #ef4444; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }
    main { padding: 2rem; }
  `]
})
export class HomeComponent {
  public authService = inject(AuthService);
}
