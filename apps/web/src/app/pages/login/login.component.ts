import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-container" data-testid="login-container">
      <h2>Login to Store</h2>
      <button
        data-testid="login-submit-button"
        class="btn-login"
        (click)="handleLogin()"
      >
        Log In
      </button>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 360px;
      margin: 100px auto;
      padding: 30px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      text-align: center;
    }
    .btn-login {
      background: #2563eb;
      color: #fff;
      border: none;
      padding: 10px 20px;
      font-size: 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public handleLogin(): void {
    this.authService.login();
    this.router.navigate(['/home']);
  }
}
