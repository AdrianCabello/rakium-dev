import { Component, input, output, inject, signal, effect, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../../../core/services/api.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import type { ProjectFull } from '../project-edit.types';

@Component({
  selector: 'app-project-edit-ubicacion',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="form-title">Ubicación</h2>
    <form (ngSubmit)="save()" class="project-form">
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
      <div class="form-actions">
        <p-button type="submit" label="Guardar" icon="pi pi-check" [loading]="saving()" [disabled]="saving()" />
      </div>
    </form>
  `,
  styles: [`
    :host { display: block; }
    .form-title { margin: 0 0 1.25rem 0; font-size: 1.125rem; font-weight: 600; color: var(--p-text-color); }
    .project-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-row { display: grid; gap: 1rem; }
    .form-row--4 { grid-template-columns: repeat(4, 1fr); }
    @media (max-width: 768px) { .form-row--4 { grid-template-columns: 1fr; } }
    .form-field { display: flex; flex-direction: column; gap: 0.375rem; }
    .form-field label { font-size: 0.8125rem; font-weight: 500; color: var(--p-text-muted-color); }
    .form-field input { width: 100%; }
    .form-actions { display: flex; justify-content: flex-end; padding-top: 1rem; }
  `],
})
export class ProjectEditUbicacionComponent {
  project = input.required<ProjectFull>();
  saved = output<ProjectFull>();

  private readonly api = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly saving = signal(false);
  form = { country: '', state: '', city: '', area: '' };

  constructor() {
    effect(() => {
      const p = this.project();
      if (p) {
        this.form = {
          country: p.country ?? '',
          state: p.state ?? '',
          city: p.city ?? '',
          area: p.area ?? '',
        };
      }
    });
  }

  save(): void {
    const p = this.project();
    if (!p?.id || p.id === 'new') return;
    this.saving.set(true);
    this.api
      .patch<ProjectFull>(`projects/${p.id}`, {
        country: this.form.country || undefined,
        state: this.form.state || undefined,
        city: this.form.city || undefined,
        area: this.form.area || undefined,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.saving.set(false);
          this.saved.emit(updated);
        },
        error: () => this.saving.set(false),
      });
  }
}
