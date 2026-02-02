import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/$/, '');

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  private url(endpoint: string): string {
    const path = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${this.baseUrl}/${path}`;
  }

  get<T>(endpoint: string, params?: Record<string, unknown>): Observable<T> {
    const clean =
      params &&
      Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
      );
    const options = {
      headers: this.getHeaders(),
      params: new HttpParams({ fromObject: (clean || {}) as Record<string, string | number | boolean> })
    };
    return this.http.get<T>(this.url(endpoint), options);
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    const options = {
      headers: this.getHeaders()
    };
    return this.http.post<T>(this.url(endpoint), data, options);
  }

  /** Upload file(s) via FormData. No Content-Type so browser sets multipart boundary. */
  upload<T>(endpoint: string, formData: FormData): Observable<T> {
    return this.http.post<T>(this.url(endpoint), formData);
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    const options = {
      headers: this.getHeaders()
    };
    return this.http.put<T>(this.url(endpoint), data, options);
  }

  delete<T>(endpoint: string): Observable<T> {
    const options = {
      headers: this.getHeaders()
    };
    return this.http.delete<T>(this.url(endpoint), options);
  }

  patch<T>(endpoint: string, data: any): Observable<T> {
    const options = {
      headers: this.getHeaders()
    };
    return this.http.patch<T>(this.url(endpoint), data, options);
  }
} 