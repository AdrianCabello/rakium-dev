import { Component, inject } from '@angular/core';
import { ProjectEditContextService } from '../project-edit-context.service';
import { ProjectEditFormComponent } from '../project-edit-form/project-edit-form.component';

@Component({
  selector: 'app-project-edit-informacion-tab',
  standalone: true,
  imports: [ProjectEditFormComponent],
  template: `
    @if (ctx.project()) {
      <section class="section-card">
        <app-project-edit-form
          [project]="ctx.project()!"
          [clients]="ctx.clients()"
          [canChangeClient]="ctx.canChangeClient()"
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
export class ProjectEditInformacionTabComponent {
  readonly ctx = inject(ProjectEditContextService);

  onSaved(updated: import('../project-edit.types').ProjectFull): void {
    const wasNew = this.ctx.project()?.id === 'new';
    this.ctx.setProject(updated);
    if (wasNew && updated.id && updated.id !== 'new') {
      this.ctx.onProjectCreated?.(updated);
    } else {
      this.ctx.onProjectUpdated?.();
    }
  }
}
