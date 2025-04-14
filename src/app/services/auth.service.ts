import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Administrateur' | 'Gestionnaire' | 'Reception' | 'Formateur';
  status: 'Actif' | 'Inactif';
}

export interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private tokenKey = 'auth_token';
  private userSubject = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.fetchUser().subscribe({
        next: (user) => {
          this.userSubject.next(user);
        },
        error: () => {
          // Ne pas déconnecter automatiquement ici
          this.userSubject.next(null);
        },
      });
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        if (response.token && response.user) {
          localStorage.setItem(this.tokenKey, response.token);
          this.userSubject.next(response.user);
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.http
      .post(`${this.apiUrl}/logout`, {}, { headers: { Authorization: `Bearer ${this.getToken()}` } })
      .subscribe({
        next: () => {
          this.clearAuth();
          this.router.navigate(['/login']);
        },
        error: () => {
          this.clearAuth();
          this.router.navigate(['/login']);
        },
      });
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUser(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  private fetchUser(): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/user`, { headers: { Authorization: `Bearer ${this.getToken()}` } })
      .pipe(
        tap((user) => this.userSubject.next(user)),
        catchError((error) => {
          // Ne pas appeler clearAuth ici pour éviter une déconnexion intempestive
          return throwError(() => error);
        })
      );
  }

  private clearAuth(): void {
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    if (error.status === 401) {
      errorMessage = 'Email ou mot de passe incorrect';
    } else if (error.status === 422) {
      errorMessage = 'Données invalides';
    } else if (error.status === 404) {
      errorMessage = 'Route non trouvée';
    }
    return throwError(() => new Error(errorMessage));
  }
}