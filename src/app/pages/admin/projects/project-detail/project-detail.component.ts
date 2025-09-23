import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnInit {
  projectId: string = '';
  activeTab = 'basico';

  // Mock data - TODO: Reemplazar con datos reales de la API
  project = {
    id: 'e8621808...',
    name: 'Kamak Desarrollos',
    client: 'Candela Landi',
    category: 'Categoría',
    type: 'Personalizado',
    status: 'Borrador',
    description: 'Sitio institucional desarrollado para una empresa de construcción. El sistema incluye una plataforma de gestión interna con autenticación JWT, operaciones CRUD para proyectos, filtros, búsqueda, gestión de información interna, imágenes, videos e integración con APIs de Google Maps.',
    longDescription: 'Descripción completa del proyecto...'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params['id'];
      // TODO: Cargar datos del proyecto desde la API
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  goBack() {
    this.router.navigate(['/admin/projects']);
  }

  saveChanges() {
    // TODO: Implementar guardado de cambios
    console.log('Guardando cambios del proyecto');
  }
}
