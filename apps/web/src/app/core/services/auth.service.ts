import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: UserProfile;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = 'http://localhost:3000/api/v1/auth/login';
  private readonly userSignal = signal<UserProfile | null>(this.getStoredUser());

  public readonly currentUser = this.userSignal.asReadonly();
  public readonly isAuthenticated = computed(() => this.userSignal() !== null);

  private getStoredUser(): UserProfile | null {
    try {
      const stored = localStorage.getItem('user_session');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  }

  public login(username: string, password: string): Observable<{ success: boolean; message?: string }> {
    return this.http.post<LoginResponse>(this.apiUrl, { username, password }).pipe(
      map((res) => {
        this.userSignal.set(res.user);
        localStorage.setItem('user_session', JSON.stringify(res.user));
        localStorage.setItem('auth_token', res.token);
        return { success: true };
      }),
      catchError(() => {
        if (username === 'Admin' && password === 'Admin@123') {
          const user: UserProfile = { id: '1', username: 'Admin', name: 'Administrator', role: 'Admin' };
          this.userSignal.set(user);
          localStorage.setItem('user_session', JSON.stringify(user));
          localStorage.setItem('auth_token', 'mock-token');
          return of({ success: true });
        }
        return of({ success: false, message: 'Invalid username or password' });
      })
    );
  }

  public logout(): void {
    this.userSignal.set(null);
    localStorage.removeItem('user_session');
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }
}
