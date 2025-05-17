import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Globe, Instagram } from 'lucide-angular';

interface Project {
  id: number;
  name: string;
  description: string;
  technologies: string[];
  images: string[];
  website?: string;
  instagram?: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './projects.component.html',
})
export class ProjectsComponent {
  // Mock de proyectos (reemplazar por llamada a API en el futuro)
  projects: Project[] = [
/*     {
      id: 1,
      name: 'EcoStore',
      description: 'Tienda online para productos ecológicos y sostenibles. Incluye catálogo de productos, carrito de compras, pasarela de pagos y panel de administración personalizado.',
      technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
      images: [
        '/assets/projects/ecostore-1.png',
        '/assets/projects/ecostore-2.png',
        '/assets/projects/ecostore-3.png',
      ],
      website: 'https://ecostore-example.com',
      instagram: 'instagram.com/ecostore',
    },
    {
      id: 2,
      name: 'LegalPro',
      description: 'Plataforma para gestión de estudios jurídicos. Permite administrar clientes, expedientes, agenda y facturación.',
      technologies: ['Angular', 'NestJS', 'PostgreSQL', 'Docker'],
      images: [
        '/assets/projects/legalpro-1.png',
        '/assets/projects/legalpro-2.png',
      ],
      website: 'https://legalpro.com',
      instagram: 'instagram.com/legalpro',
    }, */
    {
      id: 3,
      name: 'JC Cosmetology',
      description: 'Landing page profesional para cosmetóloga y centro de estética. Presenta servicios, galería de resultados, contacto directo y testimonios de clientes. Diseño moderno, optimizado para dispositivos móviles y SEO.',
      technologies: ['Angular', 'Tailwind CSS', 'TypeScript'],
      images: [
        '/assets/clients/jc-cosmetology/1.png',
        '/assets/clients/jc-cosmetology/2.png',
        '/assets/clients/jc-cosmetology/3.png',
        '/assets/clients/jc-cosmetology/4.png',
        '/assets/clients/jc-cosmetology/5.png',
        '/assets/clients/jc-cosmetology/6.png',
      ],
      website: 'https://jc-cosmetology.com/',
      instagram: '',
    },
    {
      id: 4,
      name: 'EventLoop',
      description: 'Plataforma integral para la gestión y venta de tickets de eventos. Permite a productoras y organizadores administrar entradas, equipos, ventas, roles y estadísticas en tiempo real. Incluye app móvil, escaneo de tickets, pagos instantáneos y múltiples canales de venta. Desarrollada con tecnologías modernas para máxima escalabilidad y seguridad.',
      technologies: ['Angular', 'Golang', 'Tailwind CSS', 'PostgreSQL', 'REST API', 'PWA'],
      images: [
        '/assets/clients/eventloop/1.png',
        '/assets/clients/eventloop/2.png',
        '/assets/clients/eventloop/3.png',
        '/assets/clients/eventloop/4.png',
      ],
      website: 'https://eventloop.club/',
      instagram: 'instagram.com/eventloop.club',
    },
    // Agrega más proyectos aquí...
  ];

  // Estado del slider para cada proyecto
  currentImageIndex: { [projectId: number]: number } = {};

  globeIcon = Globe;
  instagramIcon = Instagram;

  constructor() {
    // Inicializar el índice de imagen para cada proyecto
    this.projects.forEach(project => {
      this.currentImageIndex[project.id] = 0;
    });
  }

  prevImage(projectId: number) {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return;
    const total = project.images.length;
    this.currentImageIndex[projectId] = (this.currentImageIndex[projectId] - 1 + total) % total;
  }

  nextImage(projectId: number) {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return;
    const total = project.images.length;
    this.currentImageIndex[projectId] = (this.currentImageIndex[projectId] + 1) % total;
  }

  goToImage(projectId: number, index: number) {
    this.currentImageIndex[projectId] = index;
  }
}
