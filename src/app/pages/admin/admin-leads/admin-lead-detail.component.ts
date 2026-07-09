import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../../core/services/api.service';
import { LeadDetailPanelComponent } from './lead-detail-panel.component';
import { Lead, LeadActivity, LeadChecklist, messageForLead as buildLeadMessage } from './lead-shared';

@Component({
  selector: 'app-admin-lead-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LeadDetailPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <a class="text-sm text-blue-300 hover:text-blue-200" routerLink="/admin/leads">Volver a prospectos</a>
          <h1 class="mt-2 text-3xl font-bold">Ficha del prospecto</h1>
          <p class="mt-2 text-sm text-zinc-400">Detalle completo, diagnostico comercial, mensaje sugerido e historial de contacto.</p>
        </div>
        <button class="rounded bg-zinc-700 px-4 py-2 text-sm hover:bg-zinc-600" type="button" (click)="fetchLead()">Actualizar</button>
      </div>

      @if (errorMessage()) {
        <div class="rounded border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{{ errorMessage() }}</div>
      }
      @if (successMessage()) {
        <div class="rounded border border-green-500/40 bg-green-500/10 p-3 text-sm text-green-200">{{ successMessage() }}</div>
      }

      <section class="rounded-lg border border-zinc-700 bg-zinc-800 p-4 md:p-6">
        @if (loading()) {
          <p class="text-sm text-zinc-400">Cargando prospecto...</p>
        } @else {
          @if (lead(); as current) {
            <app-lead-detail-panel
              [lead]="current"
              (fieldChange)="updateLeadField($event.field, $event.value)"
              (checklistChange)="toggleChecklist($event.lead, $event.key)"
              (noteAdd)="addNote($event.lead, $event.note)"
              (instagramSent)="markInstagramSent($event)"
              (copy)="copySuggestedMessage($event)"
              (convert)="convertLead($event)"
            />
          } @else {
            <p class="text-sm text-zinc-400">No se encontro el prospecto.</p>
          }
        }
      </section>
    </div>
  `,
})
export class AdminLeadDetailComponent {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly lead = signal<Lead | null>(null);
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  private leadId = '';
  private updateTimers = new Map<string, ReturnType<typeof setTimeout>>();

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.leadId = params.get('id') || '';
      this.fetchLead();
    });
  }

  fetchLead(): void {
    if (!this.leadId) return;
    this.loading.set(true);
    this.api.get<Lead>(`leads/${this.leadId}`).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (lead) => {
        this.lead.set(lead);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'No se pudo cargar el prospecto');
        this.loading.set(false);
      },
    });
  }

  updateLeadField(field: keyof Lead, value: Lead[keyof Lead]): void {
    const current = this.lead();
    if (!current) return;
    this.patchLocalLead({ [field]: value } as Partial<Lead>);
    const previous = this.updateTimers.get(String(field));
    if (previous) clearTimeout(previous);
    const timer = setTimeout(() => {
      this.api.patch<Lead>(`leads/${current.id}`, { [field]: value }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (updated) => this.lead.set(updated),
        error: (err) => this.errorMessage.set(err?.error?.message || 'No se pudo actualizar el prospecto'),
      });
      this.updateTimers.delete(String(field));
    }, 450);
    this.updateTimers.set(String(field), timer);
  }

  toggleChecklist(lead: Lead, key: keyof LeadChecklist): void {
    const checklist = { ...(lead.checklist ?? {}), [key]: !lead.checklist?.[key] };
    this.updateLeadField('checklist', checklist);
  }

  markInstagramSent(lead: Lead): void {
    this.api
      .post<LeadActivity>(`leads/${lead.id}/activities`, {
        type: 'INSTAGRAM_SENT',
        channel: 'instagram',
        note: 'Mensaje inicial enviado desde Instagram.',
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.addSystemMessage('Mensaje de Instagram registrado.');
          this.fetchLead();
        },
        error: (err) => this.errorMessage.set(err?.error?.message || 'No se pudo registrar el mensaje'),
      });
  }

  addNote(lead: Lead, note: string): void {
    this.api
      .post<LeadActivity>(`leads/${lead.id}/activities`, { type: 'NOTE', note })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.addSystemMessage('Nota guardada.');
          this.fetchLead();
        },
        error: (err) => this.errorMessage.set(err?.error?.message || 'No se pudo guardar la nota'),
      });
  }

  copySuggestedMessage(lead: Lead): void {
    navigator.clipboard?.writeText(buildLeadMessage(lead))
      .then(() => this.addSystemMessage('Mensaje copiado. Listo para enviar por Instagram.'))
      .catch(() => {
        this.errorMessage.set('No se pudo copiar el mensaje');
      });
  }

  convertLead(lead: Lead): void {
    this.api
      .post<{ lead: Lead; client: { id: string; name: string; email: string } }>(`leads/${lead.id}/convert`, {
        name: lead.name,
        email: lead.email || undefined,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.lead.set(res.lead);
          this.fetchLead();
          this.addSystemMessage(`Convertido a cliente: ${res.client.name}`);
        },
        error: (err) => this.errorMessage.set(err?.error?.message || 'No se pudo convertir a cliente'),
      });
  }

  private patchLocalLead(patch: Partial<Lead>): void {
    this.lead.update((lead) => (lead ? { ...lead, ...patch } : lead));
  }

  private addSystemMessage(message: string): void {
    this.successMessage.set(message);
    setTimeout(() => {
      if (this.successMessage() === message) this.successMessage.set('');
    }, 3500);
  }
}
