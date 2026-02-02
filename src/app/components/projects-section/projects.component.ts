import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Globe, Instagram, ImageOff } from 'lucide-angular';
import { ApiService } from '../../core/services/api.service';

const LAUTAROVULCANO_CLIENT_ID = '8aa1986b-544c-41b2-b999-25256e483261';

interface Project {
  id: string | number;
  name: string;
  type: string;
  description: string;
  technologies: string[];
  images: string[];
  website?: string;
  instagram?: string;
}

interface ApiProject {
  id: string;
  name: string;
  description?: string;
  longDescription?: string;
  type?: string;
  category?: string;
  url?: string;
  technologies?: string[] | string;
  gallery?: { url: string }[];
}

interface PaginatedProjects {
  data: ApiProject[];
  total: number;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './projects.component.html',
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  currentImageIndex: { [key: string]: number } = {};

  globeIcon = Globe;
  instagramIcon = Instagram;
  imageOffIcon = ImageOff;

  private readonly api = inject(ApiService);

  ngOnInit(): void {
    this.api
      .get<PaginatedProjects>(`projects/client/${LAUTAROVULCANO_CLIENT_ID}/public`, { limit: 50 })
      .subscribe({
        next: (res) => {
          this.projects = (res.data || []).map((p) => this.mapApiProjectToProject(p));
          this.projects.forEach((project) => {
            this.currentImageIndex[String(project.id)] = 0;
          });
        },
        error: () => {
          this.projects = [];
        },
      });
  }

  private mapApiProjectToProject(p: ApiProject): Project {
    const tech =
      p.technologies == null
        ? []
        : Array.isArray(p.technologies)
          ? p.technologies
          : String(p.technologies)
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean);
    const images = (p.gallery || []).map((g) => g.url).filter(Boolean);
    return {
      id: p.id,
      name: p.name,
      type: p.type || p.category || '',
      description: p.description || p.longDescription || '',
      technologies: tech,
      images,
      website: p.url,
    };
  }

  prevImage(projectId: string | number): void {
    const project = this.projects.find((p) => p.id === projectId);
    if (!project) return;
    const key = String(projectId);
    const total = project.images.length;
    this.currentImageIndex[key] = (this.currentImageIndex[key] - 1 + total) % total;
  }

  nextImage(projectId: string | number): void {
    const project = this.projects.find((p) => p.id === projectId);
    if (!project) return;
    const key = String(projectId);
    const total = project.images.length;
    this.currentImageIndex[key] = (this.currentImageIndex[key] + 1) % total;
  }

  goToImage(projectId: string | number, index: number): void {
    this.currentImageIndex[String(projectId)] = index;
  }
}
