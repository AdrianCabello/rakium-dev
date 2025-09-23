import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Eye, EyeOff, Loader2 } from 'lucide-angular';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { environment } from '../../../../../environments/environment';

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
    clientId: string;
  };
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, CardModule, InputTextModule, ButtonModule, MessageModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = 'admin@rakium.com';
  password = '';
  isLoading = false;
  error = '';
  showPassword = false;

  // Lucide icons
  eyeIcon = Eye;
  eyeOffIcon = EyeOff;
  loaderIcon = Loader2;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  async onSubmit() {
    this.isLoading = true;
    this.error = '';

    try {
      const response = await this.http.post<LoginResponse>(
        `${environment.apiUrl}/auth/login`,
        { email: this.email, password: this.password }
      ).toPromise();

      if (response) {
        // Store token and user data
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));

        this.router.navigate(['/admin/dashboard']);
      }
    } catch (err: any) {
      this.error = err.error?.message || 'Credenciales inválidas';
    } finally {
      this.isLoading = false;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
