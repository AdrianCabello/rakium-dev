import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'rakium_token';
const USER_KEY = 'rakium_user';

export interface LoginResponse {
  access_token: string;
  user: { id: string; email: string; role: string; clientId?: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly baseUrl = environment.apiUrl;

  private readonly token = signal<string | null>(this.getStoredToken());
  private readonly user = signal<LoginResponse['user'] | null>(this.getStoredUser());

  readonly isLoggedIn = computed(() => !!this.token());
  readonly currentUser = this.user.asReadonly();

  private getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private getStoredUser(): LoginResponse['user'] | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as LoginResponse['user'];
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return this.token();
  }

  getAuthHeaders(): { [key: string]: string } {
    const t = this.token();
    if (!t) return {};
    return { Authorization: `Bearer ${t}` };
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/auth/login`, { email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem(TOKEN_KEY, res.access_token);
          localStorage.setItem(USER_KEY, JSON.stringify(res.user));
          this.token.set(res.access_token);
          this.user.set(res.user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.token.set(null);
    this.user.set(null);
    this.router.navigate(['/login']);
  }

  validateSession(): Observable<LoginResponse['user'] | null> {
    const t = this.token();
    if (!t) return of(null);
    return this.http
      .get<LoginResponse['user']>(`${this.baseUrl}/auth/me`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((user) => this.user.set(user)),
        catchError(() => {
          this.logout();
          return of(null);
        })
      );
  }
}
