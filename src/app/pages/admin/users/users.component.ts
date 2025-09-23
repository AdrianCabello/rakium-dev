import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  // Mock data - TODO: Reemplazar con datos reales de la API
  users: any[] = [
    {
      id: '1',
      email: 'admin@rakium.com',
      role: 'ADMIN',
      clientId: null,
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      email: 'client@example.com',
      role: 'CLIENT',
      clientId: 'client-123',
      createdAt: '2024-02-15'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // TODO: Cargar usuarios desde la API
  }

  createUser() {
    // TODO: Implementar creación de usuario
    console.log('Crear nuevo usuario');
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }

  logout() {
    // TODO: Implementar logout
    this.router.navigate(['/admin/login']);
  }
}
