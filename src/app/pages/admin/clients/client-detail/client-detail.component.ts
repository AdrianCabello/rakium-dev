import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.scss'
})
export class ClientDetailComponent implements OnInit {
  clientId: string = '';
  activeTab = 'informacion';

  // Mock data - TODO: Reemplazar con datos reales de la API
  client = {
    id: '1f0139c9',
    name: 'Candela',
    fullName: 'Candela',
    email: 'landicandela01@gmail.com',
    phone: '+1 234 567 8900',
    company: 'Nombre de la empresa',
    address: 'Dirección completa',
    website: 'https://www.ejemplo.com',
    notes: 'Notas adicionales sobre el cliente...',
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.clientId = params['id'];
      // TODO: Cargar datos del cliente desde la API
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  goBack() {
    this.router.navigate(['/admin/clients']);
  }
}
