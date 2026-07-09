import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Lead, LeadActivity, LeadChecklist, LeadStats, LeadStatus, PIPELINE, Paginated, STATUS_LABELS, messageForLead as buildLeadMessage, normalizeInstagram, normalizeUrl } from './lead-shared';

@Component({
  selector: 'app-admin-leads',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-sm uppercase tracking-wide text-blue-300">Captacion comercial</p>
          <h1 class="text-3xl font-bold">Prospectos comerciales</h1>
          <p class="mt-2 text-sm text-zinc-400">Seguimiento de oportunidades en Argentina primero, listo para escalar a otros mercados.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button class="rounded bg-zinc-700 px-4 py-2 text-sm hover:bg-zinc-600" type="button" (click)="refresh()">Actualizar</button>
          <button class="rounded bg-blue-600 px-4 py-2 text-sm hover:bg-blue-700" type="button" (click)="showImport.set(!showImport())">Importar JSON</button>
        </div>
      </div>

      @if (errorMessage()) {
        <div class="rounded border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{{ errorMessage() }}</div>
      }
      @if (successMessage()) {
        <div class="rounded border border-green-500/40 bg-green-500/10 p-3 text-sm text-green-200">{{ successMessage() }}</div>
      }

      <section class="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3">
        <div class="flex items-center gap-5 overflow-x-auto pb-1">
          <div class="flex shrink-0 items-center gap-4 border-r border-zinc-700 pr-5">
            <div>
              <p class="text-[11px] uppercase text-zinc-500">Total</p>
              <p class="text-xl font-semibold text-white">{{ stats()?.total ?? 0 }}</p>
            </div>
            <div>
              <p class="text-[11px] uppercase text-zinc-500">Sin web</p>
              <p class="text-xl font-semibold text-orange-300">{{ stats()?.needsWebsite ?? 0 }}</p>
            </div>
            <div>
              <p class="text-[11px] uppercase text-zinc-500">Contactados</p>
              <p class="text-xl font-semibold text-blue-300">{{ statusTotal('CONTACTED') }}</p>
            </div>
            <div>
              <p class="text-[11px] uppercase text-zinc-500">Respondieron</p>
              <p class="text-xl font-semibold text-green-300">{{ statusTotal('REPLIED') }}</p>
            </div>
          </div>
          @for (stage of pipeline; track stage) {
            <button
              class="flex shrink-0 items-center gap-2 rounded border px-3 py-2 text-left transition hover:border-blue-400"
              [ngClass]="status === stage ? 'border-blue-400 bg-blue-500/10' : 'border-zinc-700 bg-zinc-900'"
              type="button"
              (click)="setStatusFilter(stage)"
            >
              <span class="text-xs text-zinc-400">{{ statusLabel(stage) }}</span>
              <span class="text-sm font-semibold text-white">{{ statusTotal(stage) }}</span>
            </button>
          }
        </div>
      </section>

      @if (showImport()) {
        <div class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
          <label class="mb-2 block text-sm font-medium text-zinc-300">Pegar leads en JSON con una propiedad leads de tipo array.</label>
          <textarea class="h-40 w-full rounded border border-zinc-600 bg-zinc-900 p-3 font-mono text-sm text-zinc-100" [(ngModel)]="importJson"></textarea>
          <div class="mt-3 flex items-center gap-3">
            <button class="rounded bg-blue-600 px-4 py-2 text-sm hover:bg-blue-700" type="button" (click)="importLeads()">Importar</button>
            <span class="text-sm text-zinc-400">{{ importResult() }}</span>
          </div>
        </div>
      }

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section class="rounded-lg border border-zinc-700 bg-zinc-800">
          <div class="grid gap-3 border-b border-zinc-700 p-4 md:grid-cols-4">
            <input class="rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm" placeholder="Buscar local, rubro, Instagram..." [(ngModel)]="search" (ngModelChange)="onFilterChange()" />
            <select class="rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm" [(ngModel)]="city" (ngModelChange)="onFilterChange()">
              <option value="">Todas las ciudades</option>
              @for (row of stats()?.byCity ?? []; track row.city) {
                <option [value]="row.city">{{ row.city }} ({{ row.total }})</option>
              }
            </select>
            <select class="rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm" [(ngModel)]="status" (ngModelChange)="onFilterChange()">
              <option value="">Todos los estados</option>
              @for (option of statuses; track option) {
                <option [value]="option">{{ statusLabel(option) }}</option>
              }
            </select>
            <select class="rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm" [(ngModel)]="category" (ngModelChange)="onFilterChange()">
              <option value="">Todos los rubros</option>
              @for (row of stats()?.byCategory ?? []; track row.category) {
                <option [value]="row.category">{{ row.category }} ({{ row.total }})</option>
              }
            </select>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full min-w-[980px] text-left text-sm">
              <thead class="bg-zinc-900 text-xs uppercase text-zinc-400">
                <tr>
                  <th class="px-4 py-3">Local</th>
                  <th class="px-4 py-3">Rubro</th>
                  <th class="px-4 py-3">Digital</th>
                  <th class="px-4 py-3">Estado</th>
                  <th class="px-4 py-3">Seguimiento</th>
                  <th class="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (lead of leads(); track lead.id) {
                  <tr class="border-t border-zinc-700 align-top hover:bg-zinc-700/40">
                    <td class="px-4 py-3">
                      <button class="text-left font-semibold text-white hover:text-blue-300" type="button" (click)="openLeadPage(lead)">{{ lead.name }}</button>
                      <div class="mt-1 text-xs text-zinc-400">{{ lead.city }} @if (lead.address) { <span> / {{ lead.address }}</span> }</div>
                      <div class="mt-2 flex flex-wrap gap-2">
                        @if (lead.googleMapsUrl) { <a class="text-xs text-blue-300 hover:text-blue-200" [href]="lead.googleMapsUrl" target="_blank" rel="noopener">Maps</a> }
                        @if (lead.website) { <a class="text-xs text-blue-300 hover:text-blue-200" [href]="normalizeUrl(lead.website)" target="_blank" rel="noopener">Web</a> }
                        @if (lead.instagram) { <a class="text-xs text-pink-300 hover:text-pink-200" [href]="normalizeInstagram(lead.instagram)" target="_blank" rel="noopener">Instagram</a> }
                      </div>
                    </td>
                    <td class="px-4 py-3 text-zinc-300">{{ lead.category || '-' }}</td>
                    <td class="px-4 py-3">
                      <div class="h-2 w-28 rounded bg-zinc-700">
                        <div class="h-2 rounded bg-orange-400" [style.width.%]="lead.digitalPresenceScore"></div>
                      </div>
                      <div class="mt-1 text-xs text-zinc-400">Oportunidad {{ lead.digitalPresenceScore }}/100</div>
                      @if (lead.needsWebsite) {
                        <span class="mt-2 inline-block rounded bg-orange-500/20 px-2 py-1 text-xs text-orange-200">Sin web</span>
                      }
                    </td>
                    <td class="px-4 py-3">
                      <select class="rounded border border-zinc-600 bg-zinc-900 px-2 py-1 text-xs" [ngModel]="lead.status" (ngModelChange)="updateStatus(lead, $event)">
                        @for (option of statuses; track option) {
                          <option [value]="option">{{ statusLabel(option) }}</option>
                        }
                      </select>
                    </td>
                    <td class="px-4 py-3 text-xs text-zinc-400">
                      <div>Ultimo contacto: {{ lead.lastContactedAt ? (lead.lastContactedAt | date:'short') : '-' }}</div>
                      <div>Proximo: {{ lead.nextFollowUpAt ? (lead.nextFollowUpAt | date:'shortDate') : '-' }}</div>
                    </td>
                    <td class="px-4 py-3">
                      <div class="flex flex-wrap gap-2">
                        <button class="rounded bg-blue-600 px-3 py-1 text-xs hover:bg-blue-700" type="button" (click)="markInstagramSent(lead)">IG enviado</button>
                        <button class="rounded bg-zinc-600 px-3 py-1 text-xs hover:bg-zinc-500" type="button" (click)="openLeadPage(lead)">Ver detalle</button>
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr><td class="px-4 py-8 text-center text-zinc-400" colspan="6">Todavia no hay leads cargados.</td></tr>
                }
              </tbody>
            </table>
          </div>
        </section>

        <aside class="space-y-6">
          <section class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
            <div class="mb-3 flex items-center justify-between">
              <h2 class="font-semibold">Mejores oportunidades</h2>
              <span class="text-xs text-zinc-400">Top {{ topLeads().length }}</span>
            </div>
            <div class="space-y-2">
              @for (lead of topLeads(); track lead.id) {
                <button
                  class="w-full rounded border border-zinc-700 bg-zinc-900 p-3 text-left hover:border-orange-300"
                  type="button"
                  (click)="openLeadPage(lead)"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="truncate text-sm font-semibold text-white">{{ lead.name }}</p>
                      <p class="truncate text-xs text-zinc-400">{{ lead.city }} / {{ lead.category || 'Sin rubro' }}</p>
                    </div>
                    <span class="rounded bg-orange-500/20 px-2 py-1 text-xs text-orange-200">{{ lead.digitalPresenceScore }}</span>
                  </div>
                  <div class="mt-2 flex flex-wrap gap-1 text-[10px]">
                    @if (lead.needsWebsite) { <span class="rounded bg-orange-500/20 px-2 py-1 text-orange-200">Sin web</span> }
                    @if (lead.instagram) { <span class="rounded bg-pink-500/20 px-2 py-1 text-pink-200">Instagram</span> }
                    @if (lead.phone) { <span class="rounded bg-green-500/20 px-2 py-1 text-green-200">Telefono</span> }
                  </div>
                </button>
              } @empty {
                <p class="text-sm text-zinc-400">Todavia no hay oportunidades priorizadas.</p>
              }
            </div>
          </section>

          <section class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
            <div class="mb-3 flex items-center justify-between">
              <h2 class="font-semibold">Mapa de captacion</h2>
              <span class="text-xs text-zinc-400">{{ stats()?.mapLeads?.length ?? 0 }} puntos</span>
            </div>
            <div class="relative h-80 overflow-hidden rounded border border-zinc-700 bg-zinc-950">
              <div class="absolute inset-0 opacity-40" style="background-image: linear-gradient(#3f3f46 1px, transparent 1px), linear-gradient(90deg, #3f3f46 1px, transparent 1px); background-size: 32px 32px;"></div>
              <div class="absolute left-3 top-3 rounded bg-zinc-900/90 px-2 py-1 text-[11px] text-zinc-300">Click en un marcador abre el detalle</div>
              @for (lead of stats()?.mapLeads ?? []; track lead.id) {
                <button
                  class="absolute min-w-32 max-w-44 -translate-x-1/2 -translate-y-1/2 rounded border px-2 py-1 text-left shadow-lg transition hover:z-20 hover:scale-105"
                  [ngClass]="mapMarkerClass(lead)"
                  [ngStyle]="pointStyle(lead)"
                  [title]="lead.name"
                  type="button"
                  (click)="openLeadPage(lead)"
                >
                  <span class="block truncate text-xs font-semibold">{{ lead.name }}</span>
                  <span class="block truncate text-[10px] opacity-80">{{ lead.city }} / {{ lead.category || 'Sin rubro' }}</span>
                </button>
              }
              @if ((stats()?.mapLeads?.length ?? 0) === 0) {
                <div class="absolute inset-0 flex items-center justify-center text-sm text-zinc-500">Los puntos aparecen cuando los leads tienen latitud y longitud.</div>
              }
            </div>
            @if ((stats()?.mapLeads?.length ?? 0) > 0) {
              <div class="mt-3 grid gap-2">
                @for (lead of stats()?.mapLeads ?? []; track lead.id) {
                  <button
                    class="flex items-center justify-between rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-left text-xs hover:border-blue-400"
                    type="button"
                    (click)="openLeadPage(lead)"
                  >
                    <span class="truncate">
                      <span class="font-semibold text-white">{{ lead.name }}</span>
                      <span class="text-zinc-400"> / {{ lead.city }}</span>
                    </span>
                    <span class="ml-2 rounded px-2 py-1" [ngClass]="mapBadgeClass(lead)">{{ statusLabel(lead.status) }}</span>
                  </button>
                }
              </div>
            }
            <div class="mt-4 space-y-2">
              @for (row of stats()?.byCity ?? []; track row.city) {
                <div>
                  <div class="mb-1 flex justify-between text-xs text-zinc-400"><span>{{ row.city }}</span><span>{{ row.total }}</span></div>
                  <div class="h-2 rounded bg-zinc-700"><div class="h-2 rounded bg-blue-400" [style.width.%]="cityWidth(row.total)"></div></div>
                </div>
              }
            </div>
          </section>
          <section class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
            <h2 class="font-semibold">Ficha individual</h2>
            <p class="mt-2 text-sm text-zinc-400">Cada prospecto ahora tiene su propia pagina con historial, diagnostico, mensaje sugerido y acciones comerciales.</p>
          </section>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    input, select, textarea { color-scheme: dark; }
  `],
})
export class AdminLeadsComponent {
  private readonly api = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  readonly leads = signal<Lead[]>([]);
  readonly stats = signal<LeadStats | null>(null);
  readonly selectedLead = signal<Lead | null>(null);
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly importResult = signal('');
  readonly showImport = signal(false);

  readonly statuses: LeadStatus[] = ['NEW', 'QUALIFIED', 'CONTACTED', 'REPLIED', 'MEETING', 'WON', 'LOST', 'ARCHIVED'];
  readonly pipeline = PIPELINE;
  readonly maxCityTotal = computed(() => Math.max(1, ...(this.stats()?.byCity ?? []).map((row) => row.total)));
  readonly topLeads = computed(() =>
    [...this.leads()]
      .filter((lead) => !['WON', 'LOST', 'ARCHIVED'].includes(lead.status))
      .sort((a, b) => b.digitalPresenceScore - a.digitalPresenceScore || b.priority - a.priority)
      .slice(0, 5)
  );

  search = '';
  city = '';
  category = '';
  status = '';
  importJson = '';
  draftNote = '';
  private updateTimers = new Map<string, ReturnType<typeof setTimeout>>();

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this.fetchStats();
    this.fetchLeads();
  }

  onFilterChange(): void {
    this.fetchLeads();
  }

  setStatusFilter(status: LeadStatus): void {
    this.status = this.status === status ? '' : status;
    this.onFilterChange();
  }

  fetchStats(): void {
    this.api.get<LeadStats>('leads/stats').pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (stats) => this.stats.set(stats),
      error: (err) => this.errorMessage.set(err?.error?.message || 'No se pudieron cargar estadisticas'),
    });
  }

  fetchLeads(): void {
    this.loading.set(true);
    this.api
      .get<Paginated<Lead>>('leads', {
        limit: 100,
        search: this.search || undefined,
        city: this.city || undefined,
        category: this.category || undefined,
        status: this.status || undefined,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const data = res.data ?? [];
          this.leads.set(data);
          const selectedId = this.selectedLead()?.id;
          if (selectedId) {
            this.selectedLead.set(data.find((lead) => lead.id === selectedId) ?? null);
          }
          this.loading.set(false);
        },
        error: (err) => {
          this.errorMessage.set(err?.error?.message || 'No se pudieron cargar leads');
          this.loading.set(false);
        },
      });
  }

  selectLead(lead: Lead): void {
    const current = this.leads().find((item) => item.id === lead.id) ?? lead;
    this.selectedLead.set(current);
  }

  openLeadPage(lead: Lead): void {
    this.router.navigate(['/admin/leads', lead.id]);
  }

  openNotes(lead: Lead): void {
    this.openLeadPage(lead);
  }

  openMapLead(lead: Lead): void {
    this.openLeadPage(lead);
  }

  updateLeadField<K extends keyof Lead>(lead: Lead, field: K, value: Lead[K]): void {
    this.patchLocalLead(lead.id, { [field]: value } as Partial<Lead>);
    const key = `${lead.id}:${String(field)}`;
    const previous = this.updateTimers.get(key);
    if (previous) clearTimeout(previous);
    const timer = setTimeout(() => {
      this.api.patch<Lead>(`leads/${lead.id}`, { [field]: value }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (updated) => this.replaceLead(updated),
        error: (err) => this.errorMessage.set(err?.error?.message || 'No se pudo actualizar el lead'),
      });
      this.updateTimers.delete(key);
    }, 450);
    this.updateTimers.set(key, timer);
  }

  toggleChecklist(lead: Lead, key: keyof LeadChecklist): void {
    const checklist = { ...(lead.checklist ?? {}), [key]: !lead.checklist?.[key] };
    this.updateLeadField(lead, 'checklist', checklist);
  }

  checklistScore(lead: Lead): number {
    return Object.values(lead.checklist ?? {}).filter(Boolean).length;
  }

  messageForLead(lead: Lead): string {
    return buildLeadMessage(lead);
  }

  copySuggestedMessage(lead: Lead): void {
    navigator.clipboard?.writeText(this.messageForLead(lead))
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
          this.replaceLead(res.lead);
          this.fetchStats();
          this.addSystemMessage(`Convertido a cliente: ${res.client.name}`);
        },
        error: (err) => this.errorMessage.set(err?.error?.message || 'No se pudo convertir a cliente'),
      });
  }

  updateStatus(lead: Lead, status: LeadStatus): void {
    this.api.patch<Lead>(`leads/${lead.id}`, { status }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (updated) => this.replaceLead(updated),
      error: (err) => this.errorMessage.set(err?.error?.message || 'No se pudo actualizar el estado'),
    });
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
          this.refresh();
        },
        error: (err) => this.errorMessage.set(err?.error?.message || 'No se pudo registrar el mensaje'),
      });
  }

  addNote(lead: Lead): void {
    const note = this.draftNote.trim();
    if (!note) return;
    this.api
      .post<LeadActivity>(`leads/${lead.id}/activities`, { type: 'NOTE', note })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.draftNote = '';
          this.addSystemMessage('Nota guardada.');
          this.refresh();
        },
        error: (err) => this.errorMessage.set(err?.error?.message || 'No se pudo guardar la nota'),
      });
  }

  importLeads(): void {
    try {
      const parsed = JSON.parse(this.importJson) as { leads?: unknown[] };
      if (!Array.isArray(parsed.leads)) {
        this.importResult.set('El JSON debe tener una propiedad leads con array.');
        return;
      }
      this.api.post<{ created: number; updated: number; skipped: number }>('leads/bulk', parsed).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          this.importResult.set(`Creados ${res.created}, actualizados ${res.updated}, omitidos ${res.skipped}`);
          this.importJson = '';
          this.refresh();
        },
        error: (err) => this.importResult.set(err?.error?.message || 'Error al importar'),
      });
    } catch {
      this.importResult.set('JSON invalido.');
    }
  }

  statusLabel(status: LeadStatus): string {
    return STATUS_LABELS[status] ?? status;
  }

  statusTotal(status: LeadStatus): number {
    return this.stats()?.byStatus.find((row) => row.status === status)?.total ?? 0;
  }

  cityWidth(total: number): number {
    return Math.round((total / this.maxCityTotal()) * 100);
  }

  pointStyle(lead: Lead): Record<string, string> {
    const bounds = this.mapBounds();
    if (!lead.latitude || !lead.longitude || !bounds) return {};
    const x = ((lead.longitude - bounds.minLng) / (bounds.maxLng - bounds.minLng || 1)) * 72 + 14;
    const y = (1 - (lead.latitude - bounds.minLat) / (bounds.maxLat - bounds.minLat || 1)) * 72 + 14;
    return { left: `${x}%`, top: `${y}%` };
  }

  mapMarkerClass(lead: Lead): string {
    const selected = this.selectedLead()?.id === lead.id ? ' ring-2 ring-white z-10' : '';
    if (lead.status === 'REPLIED' || lead.status === 'MEETING' || lead.status === 'WON') return `border-green-300 bg-green-500 text-zinc-950${selected}`;
    if (lead.status === 'CONTACTED') return `border-blue-300 bg-blue-500 text-white${selected}`;
    if (lead.needsWebsite) return `border-orange-300 bg-orange-500 text-zinc-950${selected}`;
    return `border-zinc-300 bg-zinc-200 text-zinc-950${selected}`;
  }

  mapBadgeClass(lead: Lead): string {
    if (lead.status === 'REPLIED' || lead.status === 'MEETING' || lead.status === 'WON') return 'bg-green-500/20 text-green-200';
    if (lead.status === 'CONTACTED') return 'bg-blue-500/20 text-blue-200';
    if (lead.needsWebsite) return 'bg-orange-500/20 text-orange-200';
    return 'bg-zinc-700 text-zinc-200';
  }

  normalizeUrl(url: string): string {
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  }

  normalizeInstagram(value: string): string {
    if (/^https?:\/\//i.test(value)) return value;
    const handle = value.replace(/^@/, '');
    return `https://www.instagram.com/${handle}`;
  }

  dateInputValue(value?: string): string {
    return value ? value.slice(0, 10) : '';
  }

  dateToIso(value: string): string | undefined {
    return value ? new Date(`${value}T12:00:00`).toISOString() : undefined;
  }

  toNumber(value: string | number | null): number | undefined {
    if (value === null || value === '') return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  private replaceLead(updated: Lead): void {
    this.leads.update((items) => items.map((item) => (item.id === updated.id ? updated : item)));
    if (this.selectedLead()?.id === updated.id) {
      this.selectedLead.set(updated);
    }
    this.fetchStats();
  }

  private patchLocalLead(id: string, patch: Partial<Lead>): void {
    this.leads.update((items) => items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    if (this.selectedLead()?.id === id) {
      this.selectedLead.update((lead) => (lead ? { ...lead, ...patch } : lead));
    }
  }

  private addSystemMessage(message: string): void {
    this.successMessage.set(message);
    setTimeout(() => {
      if (this.successMessage() === message) this.successMessage.set('');
    }, 3500);
  }

  private mapBounds() {
    const points = (this.stats()?.mapLeads ?? []).filter((lead) => lead.latitude && lead.longitude);
    if (!points.length) return null;
    return {
      minLat: Math.min(...points.map((lead) => lead.latitude as number)),
      maxLat: Math.max(...points.map((lead) => lead.latitude as number)),
      minLng: Math.min(...points.map((lead) => lead.longitude as number)),
      maxLng: Math.max(...points.map((lead) => lead.longitude as number)),
    };
  }
}
