import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  get<T>(endpoint: string, params?: any): Observable<T> {
    const options = {
      headers: this.getHeaders(),
      params: new HttpParams({ fromObject: params || {} })
    };
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, options);
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    const options = {
      headers: this.getHeaders()
    };
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data, options);
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    const options = {
      headers: this.getHeaders()
    };
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data, options);
  }

  delete<T>(endpoint: string): Observable<T> {
    const options = {
      headers: this.getHeaders()
    };
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, options);
  }

  patch<T>(endpoint: string, data: any): Observable<T> {
    const options = {
      headers: this.getHeaders()
    };
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, data, options);
  }
} 