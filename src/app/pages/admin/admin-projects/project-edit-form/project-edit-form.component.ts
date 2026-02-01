import { Component, input, output, inject, signal, computed, effect, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../../../core/services/api.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import type { ProjectFull } from '../project-edit.types';

const PROJECT_CATEGORIES = [
  { label: 'Estaciones', value: 'ESTACIONES' },
  { label: 'Tiendas', value: 'TIENDAS' },
  { label: 'Comerciales', value: 'COMERCIALES' },
  { label: 'Sitio web', value: 'SITIO_WEB' },
];

const PROJECT_TYPES = [
  { label: 'Landing', value: 'LANDING' },
  { label: 'E-commerce', value: 'ECOMMERCE' },
  { label: 'Inmobiliaria', value: 'INMOBILIARIA' },
  { label: 'Custom', value: 'CUSTOM' },
];

const PROJECT_TYPES_SITIO_WEB = [
  { label: 'Landing', value: 'LANDING' },
  { label: 'Portfolio', value: 'PORTFOLIO' },
  { label: 'Blog', value: 'BLOG' },
  { label: 'Corporativo', value: 'CORPORATIVO' },
  { label: 'One Page', value: 'ONE_PAGE' },
];

const PROJECT_STATUSES = [
  { label: 'Borrador', value: 'DRAFT' },
  { label: 'Publicado', value: 'PUBLISHED' },
  { label: 'Pendiente', value: 'PENDING' },
];

@Component({
  selector: 'app-project-edit-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, DropdownModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="form-title">Datos del proyecto</h2>
    <form (ngSubmit)="save()" class="project-form">
      <div class="form-row form-row--2">
        <div class="form-field">
          <label for="name">Nombre del proyecto</label>
          <input pInputText id="name" [(ngModel)]="form.name" name="name" required placeholder="Ej. Remodelación Estación Norte" />
        </div>
        <div class="form-field">
          <label for="clientId">Cliente</label>
          <p-dropdown
            id="clientId"
            [options]="clients()"
            [(ngModel)]="form.clientId"
            name="clientId"
            optionLabel="name"
            optionValue="id"
            placeholder="Seleccionar cliente"
            styleClass="w-full"
            [disabled]="!canChangeClient()"
            required
          />
        </div>
      </div>

      <div class="form-row form-row--3">
        <div class="form-field">
          <label for="category">Categoría</label>
          <p-dropdown id="category" [options]="PROJECT_CATEGORIES" [(ngModel)]="form.category" (ngModelChange)="onCategoryChange($event)" name="category" optionLabel="label" optionValue="value" styleClass="w-full" [showClear]="true" placeholder="Seleccionar" />
        </div>
        <div class="form-field">
          <label for="type">Tipo</label>
          <p-dropdown id="type" [options]="typeOptions()" [(ngModel)]="form.type" name="type" optionLabel="label" optionValue="value" styleClass="w-full" [showClear]="true" placeholder="Seleccionar" />
        </div>
        <div class="form-field">
          <label for="status">Estado</label>
          <p-dropdown id="status" [options]="PROJECT_STATUSES" [(ngModel)]="form.status" name="status" optionLabel="label" optionValue="value" styleClass="w-full" placeholder="Estado" />
        </div>
      </div>

      <div class="form-field">
        <label for="description">Resumen breve</label>
        <input pInputText id="description" [(ngModel)]="form.description" name="description" placeholder="Una línea para listados y tarjetas" />
      </div>
      <div class="form-field">
        <label for="longDescription">Descripción extendida</label>
        <textarea pInputText id="longDescription" [(ngModel)]="form.longDescription" name="longDescription" rows="5" placeholder="Texto completo del proyecto para la ficha pública" class="textarea-resize"></textarea>
      </div>

      <h3 class="form-subtitle">Desafío y solución</h3>
      <div class="form-field">
        <label for="challenge">Desafío</label>
        <textarea pInputText id="challenge" [(ngModel)]="form.challenge" name="challenge" rows="2" placeholder="Qué reto o problema abordaba el proyecto" class="textarea-resize"></textarea>
      </div>
      <div class="form-field">
        <label for="solution">Solución</label>
        <textarea pInputText id="solution" [(ngModel)]="form.solution" name="solution" rows="2" placeholder="Cómo se resolvió" class="textarea-resize"></textarea>
      </div>

      <h3 class="form-subtitle">Ubicación</h3>
      <div class="form-row form-row--4">
        <div class="form-field">
          <label for="country">País</label>
          <input pInputText id="country" [(ngModel)]="form.country" name="country" placeholder="Ej. Argentina" />
        </div>
        <div class="form-field">
          <label for="state">Provincia / Estado</label>
          <input pInputText id="state" [(ngModel)]="form.state" name="state" placeholder="Ej. Buenos Aires" />
        </div>
        <div class="form-field">
          <label for="city">Ciudad</label>
          <input pInputText id="city" [(ngModel)]="form.city" name="city" placeholder="Ej. CABA" />
        </div>
        <div class="form-field">
          <label for="area">Área / Superficie</label>
          <input pInputText id="area" [(ngModel)]="form.area" name="area" placeholder="Ej. 500 m²" />
        </div>
      </div>

      <h3 class="form-subtitle">Fechas y duración</h3>
      <div class="form-row form-row--4">
        <div class="form-field">
          <label for="duration">Duración</label>
          <input pInputText id="duration" [(ngModel)]="form.duration" name="duration" placeholder="Ej. 3 meses" />
        </div>
        <div class="form-field">
          <label for="date">Fecha (texto)</label>
          <input pInputText id="date" [(ngModel)]="form.date" name="date" placeholder="Ej. 2024-03-15" />
        </div>
        <div class="form-field">
          <label for="startDate">Fecha inicio</label>
          <input type="date" id="startDate" [(ngModel)]="form.startDate" name="startDate" class="p-inputtext p-component w-full" />
        </div>
        <div class="form-field">
          <label for="endDate">Fecha fin</label>
          <input type="date" id="endDate" [(ngModel)]="form.endDate" name="endDate" class="p-inputtext p-component w-full" />
        </div>
      </div>

      <h3 class="form-subtitle">Enlaces</h3>
      <div class="form-row form-row--3">
        <div class="form-field">
          <label for="url">URL del proyecto</label>
          <input pInputText id="url" [(ngModel)]="form.url" name="url" placeholder="https://..." />
        </div>
        <div class="form-field">
          <label for="githubUrl">GitHub</label>
          <input pInputText id="githubUrl" [(ngModel)]="form.githubUrl" name="githubUrl" placeholder="https://github.com/..." />
        </div>
        <div class="form-field">
          <label for="demoUrl">Demo / Preview</label>
          <input pInputText id="demoUrl" [(ngModel)]="form.demoUrl" name="demoUrl" placeholder="https://..." />
        </div>
      </div>

      <h3 class="form-subtitle">Contacto del proyecto</h3>
      <div class="form-row form-row--3">
        <div class="form-field">
          <label for="contactName">Nombre de contacto</label>
          <input pInputText id="contactName" [(ngModel)]="form.contactName" name="contactName" placeholder="Persona de referencia" />
        </div>
        <div class="form-field">
          <label for="contactEmail">Email de contacto</label>
          <input pInputText id="contactEmail" [(ngModel)]="form.contactEmail" name="contactEmail" type="email" placeholder="contacto@..." />
        </div>
        <div class="form-field">
          <label for="contactPhone">Teléfono</label>
          <input pInputText id="contactPhone" [(ngModel)]="form.contactPhone" name="contactPhone" placeholder="+54 11 ..." />
        </div>
      </div>

      <h3 class="form-subtitle">Tecnologías</h3>
      <div class="form-field">
        <label for="technologies">Tecnologías (separadas por comas)</label>
        <input pInputText id="technologies" [(ngModel)]="form.technologies" name="technologies" placeholder="Angular, TypeScript, Firebase" />
      </div>

      <div class="form-actions">
        <p-button type="submit" [label]="isNew() ? 'Crear proyecto' : 'Guardar cambios'" icon="pi pi-check" [loading]="saving()" [disabled]="saving()" />
      </div>
    </form>
  `,
  styles: [`
    :host { display: block; }
    .form-title {
      margin: 0 0 1.25rem 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--p-text-color);
    }
    .project-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .form-row {
      display: grid;
      gap: 1rem;
    }
    .form-row--2 { grid-template-columns: 1fr 1fr; }
    .form-row--3 { grid-template-columns: 1fr 1fr 1fr; }
    .form-row--4 { grid-template-columns: repeat(4, 1fr); }
    .form-subtitle {
      margin: 1.5rem 0 0.75rem 0;
      font-size: 1rem;
      font-weight: 600;
      color: var(--p-text-muted-color);
    }
    .form-subtitle:first-of-type { margin-top: 0; }
    @media (max-width: 768px) {
      .form-row--2,
      .form-row--3,
      .form-row--4 { grid-template-columns: 1fr; }
    }
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }
    .form-field label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--p-text-muted-color);
    }
    .form-field input,
    .form-field textarea,
    .form-field ::ng-deep .p-dropdown { width: 100%; }
    .textarea-resize {
      resize: vertical;
      min-height: 6rem;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-top: 1rem;
      margin-top: 0.25rem;
    }
  `],
})
export class ProjectEditFormComponent {
  project = input.required<ProjectFull>();
  clients = input.required<{ id: string; name: string; email: string }[]>();
  canChangeClient = input<boolean>(true);
  saved = output<ProjectFull>();
  loadClients = output<void>();

  protected readonly PROJECT_CATEGORIES = PROJECT_CATEGORIES;
  protected readonly PROJECT_TYPES = PROJECT_TYPES;
  protected readonly PROJECT_TYPES_SITIO_WEB = PROJECT_TYPES_SITIO_WEB;
  protected readonly PROJECT_STATUSES = PROJECT_STATUSES;

  /** Categoría actual para decidir opciones de tipo (actualizado al cambiar el dropdown). */
  private readonly categoryForTypes = signal<string | undefined>(undefined);

  /** Opciones de tipo según categoría: si es Sitio web se muestran tipos de web, sino los estándar. */
  readonly typeOptions = computed(() =>
    this.categoryForTypes() === 'SITIO_WEB' ? PROJECT_TYPES_SITIO_WEB : PROJECT_TYPES
  );

  onCategoryChange(value: string | undefined): void {
    this.categoryForTypes.set(value);
    if (value === 'SITIO_WEB') {
      const webValues = PROJECT_TYPES_SITIO_WEB.map((o) => o.value);
      if (this.form.type && !webValues.includes(this.form.type)) this.form.type = undefined;
    }
  }

  private readonly api = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isNew = computed(() => {
    const p = this.project();
    return !p?.id || p.id === 'new';
  });
  readonly saving = signal(false);
  form: {
    name: string;
    clientId: string;
    category?: string;
    type?: string;
    status: string;
    description?: string;
    longDescription?: string;
    challenge?: string;
    solution?: string;
    country?: string;
    state?: string;
    city?: string;
    area?: string;
    duration?: string;
    date?: string;
    url?: string;
    startDate?: string;
    endDate?: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    githubUrl?: string;
    demoUrl?: string;
    technologies?: string;
  } = { name: '', clientId: '', status: 'DRAFT' };

  private formatDateForInput(iso?: string | null): string {
    if (!iso) return '';
    const d = iso.slice(0, 10);
    return d.length === 10 ? d : '';
  }

  private formatTechnologies(value: string | string[] | undefined): string {
    if (value == null) return '';
    if (Array.isArray(value)) return value.join(', ');
    return String(value);
  }

  constructor() {
    effect(() => {
      const p = this.project();
      if (p) {
        this.form = {
          name: p.name ?? '',
          clientId: p.clientId ?? '',
          category: p.category,
          type: p.type,
          status: p.status ?? 'DRAFT',
          description: p.description ?? '',
          longDescription: p.longDescription ?? '',
          challenge: p.challenge ?? '',
          solution: p.solution ?? '',
          country: p.country ?? '',
          state: p.state ?? '',
          city: p.city ?? '',
          area: p.area ?? '',
          duration: p.duration ?? '',
          date: p.date ?? '',
          url: p.url ?? '',
          startDate: this.formatDateForInput(p.startDate),
          endDate: this.formatDateForInput(p.endDate),
          contactName: p.contactName ?? '',
          contactEmail: p.contactEmail ?? '',
          contactPhone: p.contactPhone ?? '',
          githubUrl: p.githubUrl ?? '',
          demoUrl: p.demoUrl ?? '',
          technologies: this.formatTechnologies(p.technologies),
        };
        this.categoryForTypes.set(this.form.category);
      }
    });
  }

  save(): void {
    const p = this.project();
    const creating = this.isNew();
    this.saving.set(true);
    const payload = {
      name: this.form.name,
      clientId: this.form.clientId,
      category: this.form.category,
      type: this.form.type,
      status: this.form.status,
      description: this.form.description || undefined,
      longDescription: this.form.longDescription || undefined,
      challenge: this.form.challenge || undefined,
      solution: this.form.solution || undefined,
      country: this.form.country || undefined,
      state: this.form.state || undefined,
      city: this.form.city || undefined,
      area: this.form.area || undefined,
      duration: this.form.duration || undefined,
      date: this.form.date || undefined,
      url: this.form.url || undefined,
      startDate: this.form.startDate ? `${this.form.startDate}T00:00:00.000Z` : undefined,
      endDate: this.form.endDate ? `${this.form.endDate}T23:59:59.999Z` : undefined,
      contactName: this.form.contactName || undefined,
      contactEmail: this.form.contactEmail || undefined,
      contactPhone: this.form.contactPhone || undefined,
      githubUrl: this.form.githubUrl || undefined,
      demoUrl: this.form.demoUrl || undefined,
      technologies: this.form.technologies?.trim() || undefined,
    };
    const request = creating
      ? this.api.post<ProjectFull>('projects', payload)
      : this.api.patch<ProjectFull>(`projects/${p!.id}`, payload);
    request
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.saving.set(false);
          this.saved.emit(updated);
        },
        error: (err) => {
          this.saving.set(false);
          // parent can show toast via message service if needed
        },
      });
  }
}
