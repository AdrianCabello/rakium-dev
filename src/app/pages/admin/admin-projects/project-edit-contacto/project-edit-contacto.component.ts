import { Component, input, output, inject, signal, effect, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../../../core/services/api.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import type { ProjectFull } from '../project-edit.types';

@Component({
  selector: 'app-project-edit-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="form-title">Contacto del proyecto</h2>
    <form (ngSubmit)="save()" class="project-form">
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
    .form-row--3 { grid-template-columns: 1fr 1fr 1fr; }
    @media (max-width: 768px) { .form-row--3 { grid-template-columns: 1fr; } }
    .form-field { display: flex; flex-direction: column; gap: 0.375rem; }
    .form-field label { font-size: 0.8125rem; font-weight: 500; color: var(--p-text-muted-color); }
    .form-field input { width: 100%; }
    .form-actions { display: flex; justify-content: flex-end; padding-top: 1rem; }
  `],
})
export class ProjectEditContactoComponent {
  project = input.required<ProjectFull>();
  saved = output<ProjectFull>();

  private readonly api = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly saving = signal(false);
  form = { contactName: '', contactEmail: '', contactPhone: '' };

  constructor() {
    effect(() => {
      const p = this.project();
      if (p) {
        this.form = {
          contactName: p.contactName ?? '',
          contactEmail: p.contactEmail ?? '',
          contactPhone: p.contactPhone ?? '',
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
        contactName: this.form.contactName || undefined,
        contactEmail: this.form.contactEmail || undefined,
        contactPhone: this.form.contactPhone || undefined,
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
