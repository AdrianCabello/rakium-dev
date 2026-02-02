import { Component, inject } from '@angular/core';
import { ProjectEditContextService } from '../project-edit-context.service';
import { ProjectVideosEditorComponent } from '../project-videos-editor/project-videos-editor.component';

@Component({
  selector: 'app-project-edit-videos-tab',
  standalone: true,
  imports: [ProjectVideosEditorComponent],
  template: `
    @if (ctx.project()) {
      <section class="section-card">
        <app-project-videos-editor
          [projectId]="ctx.project()!.id"
          [videos]="ctx.project()!.videos ?? []"
          (updated)="onUpdated()"
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
export class ProjectEditVideosTabComponent {
  readonly ctx = inject(ProjectEditContextService);

  onUpdated(): void {
    this.ctx.reloadProject();
  }
}
