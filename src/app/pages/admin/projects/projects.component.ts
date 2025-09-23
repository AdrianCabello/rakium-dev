import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  // Mock data - TODO: Reemplazar con datos reales de la API
  projects: any[] = [
    {
      id: '1',
      name: 'Kamak Desarrollos',
      client: 'Candela Landi',
      status: 'DRAFT',
      type: 'CUSTOM',
      description: 'Sitio institucional desarrollado para una empresa de construcción...'
    },
    {
      id: '2',
      name: 'ONG Valores para la familia',
      client: 'Candela Landi',
      status: 'DRAFT',
      type: 'CUSTOM',
      description: 'Sitio web desarrollado para una organización no gubernamental...'
    },
    {
      id: '3',
      name: 'JC Cosmetology',
      client: 'Candela Landi',
      status: 'DRAFT',
      type: 'LANDING',
      description: 'Landing page para un profesional de la estética...'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // TODO: Cargar proyectos desde la API
  }

  viewProject(projectId: string) {
    this.router.navigate(['/admin/projects', projectId]);
  }

  createProject() {
    // TODO: Implementar creación de proyecto
    console.log('Crear nuevo proyecto');
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }

  logout() {
    // TODO: Implementar logout
    this.router.navigate(['/admin/login']);
  }
}
