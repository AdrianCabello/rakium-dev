import { Component, inject } from '@angular/core';
import { ProjectEditContextService } from '../project-edit-context.service';
import { ProjectGalleryEditorComponent } from '../project-gallery-editor/project-gallery-editor.component';

@Component({
  selector: 'app-project-edit-galeria-tab',
  standalone: true,
  imports: [ProjectGalleryEditorComponent],
  template: `
    @if (ctx.project()) {
      <section class="section-card">
        <app-project-gallery-editor
          [projectId]="ctx.project()!.id"
          [gallery]="ctx.project()!.gallery ?? []"
          [coverImageId]="ctx.project()!.coverImageId ?? null"
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
export class ProjectEditGaleriaTabComponent {
  readonly ctx = inject(ProjectEditContextService);

  onUpdated(): void {
    this.ctx.reloadProject();
  }
}
