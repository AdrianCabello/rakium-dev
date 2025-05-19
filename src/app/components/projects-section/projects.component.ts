import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Globe, Instagram } from 'lucide-angular';

interface Project {
  id: number;
  name: string;
  type: string;
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

    {
      id: 1,
      name: 'Eventloop',
      type: 'Sistema de gestión de eventos',
      description: 'Plataforma integral para la gestión y venta de tickets de eventos. Permite a productoras y organizadores administrar entradas, equipos, ventas, roles y estadísticas en tiempo real. Incluye app móvil, escaneo de tickets, pagos instantáneos y múltiples canales de venta. Desarrollada con tecnologías modernas para máxima escalabilidad y seguridad.',
      technologies: ['Angular', 'Golang', 'Tailwind CSS', 'PostgreSQL', 'REST API', 'PWA'],
      images: [
        '/assets/clients/eventloop/1.png',
        '/assets/clients/eventloop/2.png',
        '/assets/clients/eventloop/3.png',
        '/assets/clients/eventloop/4.png',
        '/assets/clients/eventloop/5.jpeg',
      ],
      website: 'https://eventloop.club/',
      instagram: 'instagram.com/eventloop.club',
    },
    {
      id: 2,
      name: 'JC Cosmetology',
      type: 'Landing institucional',
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
      instagram: 'www.instagram.com/jc_cosmetologia',
    },
    {
      id: 3,
      name: 'Lautaro Vulcano',
      type: 'Portafolio profesional',
      description: 'Portafolio profesional para diseñador gráfico. Presenta trabajos destacados, información personal, contacto y enlaces a redes sociales. Diseño visual atractivo, enfocado en la presentación de proyectos y la identidad del cliente.',
      technologies: ['Angular', 'Tailwind CSS', 'TypeScript'],
      images: [
        '/assets/clients/lautaro-vulcano-portfolio/1.png',
        '/assets/clients/lautaro-vulcano-portfolio/2.png',
        '/assets/clients/lautaro-vulcano-portfolio/3.png',
        '/assets/clients/lautaro-vulcano-portfolio/4.png',
        '/assets/clients/lautaro-vulcano-portfolio/6.png',
        '/assets/clients/lautaro-vulcano-portfolio/7.png',
        '/assets/clients/lautaro-vulcano-portfolio/8.png',

      ],
      website: 'https://lautarovulcano.com/',
      instagram: 'www.instagram.com/lautaro_vulcano',
    },
    {
      id: 4,
      name: 'NecoTec',
      type: 'E-commerce Tiendanube',
      description: 'E-commerce mayorista desarrollado en Tiendanube para NecoTec. Se respetó el diseño solicitado por la marca, utilizando su paleta de colores y estilo visual. El proyecto incluyó la carga y organización de más de 1600 productos, diseño de banners, creación de iconos personalizados y categorización avanzada para facilitar la navegación y la experiencia de compra.',
      technologies: ['Tiendanube', 'Diseño personalizado', 'Carga masiva de productos'],
      images: [
        '/assets/clients/necotec/1.png',
        '/assets/clients/necotec/2.png',
        '/assets/clients/necotec/3.png',
      ],
      website: 'https://necotecmayorista.com.ar/',
      instagram: 'www.instagram.com/necotec_',
    },
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
