import { Injectable, signal } from '@angular/core';
import type { ProjectFull } from './project-edit.types';

@Injectable()
export class ProjectEditContextService {
  private readonly projectSignal = signal<ProjectFull | null>(null);
  private readonly clientsSignal = signal<{ id: string; name: string; email: string }[]>([]);
  private readonly canChangeClientSignal = signal(true);

  readonly project = this.projectSignal.asReadonly();
  readonly clients = this.clientsSignal.asReadonly();
  readonly canChangeClient = this.canChangeClientSignal.asReadonly();

  /** Callback set by parent to reload project (e.g. after gallery/videos update). */
  onReloadProject: (() => void) | null = null;

  /** Callback when a new project is created (to navigate and show toast). */
  onProjectCreated: ((updated: ProjectFull) => void) | null = null;

  /** Callback when an existing project is updated (to show toast). */
  onProjectUpdated: (() => void) | null = null;

  setProject(p: ProjectFull | null): void {
    this.projectSignal.set(p);
  }

  setClients(c: { id: string; name: string; email: string }[]): void {
    this.clientsSignal.set(c);
  }

  setCanChangeClient(v: boolean): void {
    this.canChangeClientSignal.set(v);
  }

  reloadProject(): void {
    this.onReloadProject?.();
  }
}
