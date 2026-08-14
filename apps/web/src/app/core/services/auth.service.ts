import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'auth_token';
  public readonly isAuthenticated = signal<boolean>(this.checkToken());

  private checkToken(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem(this.tokenKey);
  }

  public login(token = 'dummy-jwt-token'): void {
    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticated.set(true);
  }

  public logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticated.set(false);
  }

  public isUserLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}
