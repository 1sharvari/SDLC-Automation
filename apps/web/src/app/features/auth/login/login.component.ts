import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service.js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <h2>Welcome Back</h2>
        <p>Sign in to your account</p>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          @if (errorMessage) {
            <div class="alert-error" data-testid="error-message">{{ errorMessage }}</div>
          }
          <div class="form-group">
            <label for="username">Username</label>
            <input id="username" type="text" formControlName="username" data-testid="username" placeholder="Username" />
            @if (loginForm.get('username')?.invalid && loginForm.get('username')?.touched) {
              <span class="field-error" data-testid="username-error">Username is required</span>
            }
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" type="password" formControlName="password" data-testid="password" placeholder="Password" />
            @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
              <span class="field-error" data-testid="password-error">Password is required</span>
            }
          </div>
          <button type="submit" data-testid="login-button" class="btn-primary">Sign In</button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8fafc; font-family: sans-serif; }
    .login-card { width: 100%; max-width: 400px; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .alert-error { background: #fee2e2; color: #b91c1c; padding: 0.75rem; border-radius: 4px; margin-bottom: 1rem; }
    .form-group { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.5rem; color: #334155; font-size: 0.875rem; }
    input { width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 4px; box-sizing: border-box; }
    .field-error { color: #dc2626; font-size: 0.75rem; margin-top: 0.25rem; display: block; }
    .btn-primary { width: 100%; padding: 0.75rem; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; margin-top: 1rem; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  public errorMessage: string | null = null;
  public loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  public onSubmit(): void {
    this.errorMessage = null;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { username, password } = this.loginForm.value;
    this.authService.login(username!, password!).subscribe((res) => {
      if (res.success) {
        this.router.navigate(['/home']);
      } else {
        this.errorMessage = res.message || 'Invalid username or password';
      }
    });
  }
}
