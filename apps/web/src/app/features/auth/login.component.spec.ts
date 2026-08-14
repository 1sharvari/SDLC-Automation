import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { describe, it, expect, beforeEach, vi } from 'vitest';

class MockAuthService {
  login = vi.fn();
}

class MockRouter {
  navigate = vi.fn();
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: MockAuthService;
  let router: MockRouter;

  beforeEach(async () => {
    authService = new MockAuthService();
    router = new MockRouter();

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize with empty form and invalid state', () => {
    expect(component.loginForm.valid).toBeFalsy();
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should show validation errors when submitted empty', () => {
    component.onSubmit();
    expect(component.loginForm.get('username')?.touched).toBeTruthy();
    expect(component.loginForm.get('password')?.touched).toBeTruthy();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should authenticate and navigate to /home on successful login', () => {
    authService.login.mockReturnValue(
      of({ token: 'test-token', user: { id: '1', username: 'Admin', role: 'ADMIN' } })
    );

    component.loginForm.setValue({ username: 'Admin', password: 'Admin@123' });
    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith({ username: 'Admin', password: 'Admin@123' });
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should display error message on login failure', () => {
    authService.login.mockReturnValue(
      throwError(() => ({ error: { error: 'Invalid username or password' } }))
    );

    component.loginForm.setValue({ username: 'Admin', password: 'wrong' });
    component.onSubmit();

    expect(component.errorMessage()).toBe('Invalid username or password');
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
