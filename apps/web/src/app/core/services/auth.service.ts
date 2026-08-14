import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginResponse, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'shop_auth_session';
  private readonly currentUserSignal = signal<User | null>(this.getStoredUser());

  public readonly currentUser = this.currentUserSignal.asReadonly();
  public readonly isAuthenticated = computed(() => !!this.currentUserSignal());

  constructor(private readonly http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/v1/auth/login', credentials).pipe(
      tap((response) => {
        this.setSession(response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentUserSignal.set(null);
  }

  private setSession(authResult: LoginResponse): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authResult));
    this.currentUserSignal.set(authResult.user);
  }

  private getStoredUser(): User | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;
      const parsed: LoginResponse = JSON.parse(stored);
      return parsed.user || null;
    } catch {
      return null;
    }
  }
}
