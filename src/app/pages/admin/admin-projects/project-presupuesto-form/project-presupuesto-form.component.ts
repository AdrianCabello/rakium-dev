import { Component, input, output, inject, signal, effect, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../../../core/services/api.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import type { ProjectFull } from '../project-edit.types';

@Component({
  selector: 'app-project-presupuesto-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="form-title">Presupuesto y notas internas</h2>
    <form (ngSubmit)="save()" class="project-form">
      <div class="form-row form-row--2">
        <div class="form-field">
          <label for="budget">Presupuesto</label>
          <input pInputText id="budget" [(ngModel)]="form.budget" name="budget" placeholder="Ej. $50.000 USD" />
        </div>
        <div class="form-field">
          <label for="invoiceStatus">Estado de facturación</label>
          <input pInputText id="invoiceStatus" [(ngModel)]="form.invoiceStatus" name="invoiceStatus" placeholder="Ej. pendiente, facturado" />
        </div>
      </div>
      <div class="form-field">
        <label for="notes">Notas internas</label>
        <textarea pInputText id="notes" [(ngModel)]="form.notes" name="notes" rows="3" placeholder="Comentarios solo para uso interno" class="textarea-resize"></textarea>
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
    .form-row--2 { grid-template-columns: 1fr 1fr; }
    @media (max-width: 768px) { .form-row--2 { grid-template-columns: 1fr; } }
    .form-field { display: flex; flex-direction: column; gap: 0.375rem; }
    .form-field label { font-size: 0.8125rem; font-weight: 500; color: var(--p-text-muted-color); }
    .form-field input, .form-field textarea { width: 100%; }
    .textarea-resize { resize: vertical; min-height: 5rem; }
    .form-actions { display: flex; justify-content: flex-end; padding-top: 1rem; }
  `],
})
export class ProjectPresupuestoFormComponent {
  project = input.required<ProjectFull>();
  saved = output<ProjectFull>();

  private readonly api = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly saving = signal(false);
  form = { budget: '', invoiceStatus: '', notes: '' };

  constructor() {
    effect(() => {
      const p = this.project();
      if (p) {
        this.form = {
          budget: p.budget ?? '',
          invoiceStatus: p.invoiceStatus ?? '',
          notes: p.notes ?? '',
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
        budget: this.form.budget || undefined,
        invoiceStatus: this.form.invoiceStatus || undefined,
        notes: this.form.notes || undefined,
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
