import { Component, input, output, inject, signal, effect, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../../../core/services/api.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import type { ProjectFull } from '../project-edit.types';

@Component({
  selector: 'app-project-edit-desafio-solucion',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="form-title">Desafío y solución</h2>
    <form (ngSubmit)="save()" class="project-form">
      <div class="form-field">
        <label for="challenge">Desafío</label>
        <textarea pInputText id="challenge" [(ngModel)]="form.challenge" name="challenge" rows="4" placeholder="Qué reto o problema abordaba el proyecto" class="textarea-resize"></textarea>
      </div>
      <div class="form-field">
        <label for="solution">Solución</label>
        <textarea pInputText id="solution" [(ngModel)]="form.solution" name="solution" rows="4" placeholder="Cómo se resolvió" class="textarea-resize"></textarea>
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
    .form-field { display: flex; flex-direction: column; gap: 0.375rem; }
    .form-field label { font-size: 0.8125rem; font-weight: 500; color: var(--p-text-muted-color); }
    .form-field textarea { width: 100%; }
    .textarea-resize { resize: vertical; min-height: 6rem; }
    .form-actions { display: flex; justify-content: flex-end; padding-top: 1rem; }
  `],
})
export class ProjectEditDesafioSolucionComponent {
  project = input.required<ProjectFull>();
  saved = output<ProjectFull>();

  private readonly api = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly saving = signal(false);
  form = { challenge: '', solution: '' };

  constructor() {
    effect(() => {
      const p = this.project();
      if (p) {
        this.form = {
          challenge: p.challenge ?? '',
          solution: p.solution ?? '',
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
        challenge: this.form.challenge || undefined,
        solution: this.form.solution || undefined,
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
