import { Component, inject } from '@angular/core';
import { ProjectEditContextService } from '../project-edit-context.service';
import { ProjectPresupuestoFormComponent } from '../project-presupuesto-form/project-presupuesto-form.component';

@Component({
  selector: 'app-project-edit-presupuesto-tab',
  standalone: true,
  imports: [ProjectPresupuestoFormComponent],
  template: `
    @if (ctx.project()) {
      <section class="section-card">
        <app-project-presupuesto-form
          [project]="ctx.project()!"
          (saved)="onSaved($event)"
        />
      </section>
    }
  `,
  styles: [`
    .section-card {
      background: rgb(39 39 42);
      border-radius: 8px;
      padding: 1.5rem;
      border: 1px solid rgb(63 63 70);
    }
  `],
})
export class ProjectEditPresupuestoTabComponent {
  readonly ctx = inject(ProjectEditContextService);

  onSaved(updated: import('../project-edit.types').ProjectFull): void {
    this.ctx.setProject(updated);
    this.ctx.onProjectUpdated?.();
  }
}
