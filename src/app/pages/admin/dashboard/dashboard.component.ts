import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  // Mock data - TODO: Reemplazar con datos reales de la API
  stats = {
    activeProjects: 26,
    activeClients: 6,
    drafts: 3,
    publishedSites: 26
  };

  currentUser = {
    email: 'admin@rakium.com'
  };

  constructor(private router: Router) {}

  ngOnInit() {
    // TODO: Cargar datos reales del dashboard
  }

  navigateToProjects() {
    this.router.navigate(['/admin/projects']);
  }

  navigateToClients() {
    this.router.navigate(['/admin/clients']);
  }

  logout() {
    // TODO: Implementar logout
    this.router.navigate(['/admin/login']);
  }
}
