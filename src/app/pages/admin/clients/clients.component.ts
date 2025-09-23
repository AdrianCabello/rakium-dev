import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit {
  // Mock data - TODO: Reemplazar con datos reales de la API
  clients: any[] = [
    {
      id: '1',
      name: 'Rakium',
      email: 'rakium.root@gmail.com',
      status: 'Cliente Activo',
      clientSince: '22/09/2025',
      totalProjects: 0,
      activeProjects: 0
    },
    {
      id: '2',
      name: 'Candela',
      email: 'candela@example.com',
      status: 'Cliente Activo',
      clientSince: '15/08/2025',
      totalProjects: 3,
      activeProjects: 2
    },
    {
      id: '3',
      name: 'Candela Landi',
      email: 'candela.landi@example.com',
      status: 'Cliente Activo',
      clientSince: '10/07/2025',
      totalProjects: 5,
      activeProjects: 3
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // TODO: Cargar clientes desde la API
  }

  viewClient(clientId: string) {
    this.router.navigate(['/admin/clients', clientId]);
  }

  createClient() {
    // TODO: Implementar creación de cliente
    console.log('Crear nuevo cliente');
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }

  logout() {
    // TODO: Implementar logout
    this.router.navigate(['/admin/login']);
  }
}
