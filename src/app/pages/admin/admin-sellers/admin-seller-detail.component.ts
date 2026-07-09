import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../core/services/api.service';
import { Lead, Paginated } from '../admin-leads/lead-shared';
import {
  MESSAGE_EXAMPLES,
  OBJECTION_GUIDES,
  PROFILE_CHECKLIST_LABELS,
  PROFILE_TEMPLATES,
  SALES_GUIDES,
  SELLER_ACTIVITY_LABELS,
  SELLER_STATUS_LABELS,
  Seller,
  SellerActivity,
  SellerActivityType,
  SellerProfileChecklist,
  SellerStatus,
  TRAINING_DOCS,
} from './seller-shared';

@Component({
  selector: 'app-admin-seller-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <a class="text-sm text-blue-300 hover:text-blue-200" [routerLink]="['/admin/sellers']">Volver a vendedores</a>

      @if (errorMessage()) {
        <div class="rounded border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{{ errorMessage() }}</div>
      }
      @if (successMessage()) {
        <div class="rounded border border-green-500/40 bg-green-500/10 p-3 text-sm text-green-200">{{ successMessage() }}</div>
      }

      @if (seller(); as seller) {
        <section class="rounded-lg border border-zinc-700 bg-zinc-800 p-5">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div class="min-w-0">
              <p class="text-sm uppercase tracking-wide text-blue-300">Ficha de vendedor</p>
              <h1 class="mt-1 text-3xl font-bold">{{ seller.name }}</h1>
              <p class="mt-2 text-sm text-zinc-400">{{ seller.role || 'Vendedor comercial' }} @if (seller.city) { <span>/ {{ seller.city }}</span> }</p>
              <div class="mt-3 flex flex-wrap gap-2">
                <span class="rounded px-2 py-1 text-xs" [ngClass]="statusClass(seller.status)">{{ statusLabel(seller.status) }}</span>
                @if (seller.instagram) { <a class="rounded bg-pink-500/15 px-3 py-1 text-xs text-pink-200" [href]="normalizeSocial(seller.instagram, 'instagram')" target="_blank" rel="noopener">Instagram</a> }
                @if (seller.linkedin) { <a class="rounded bg-blue-500/15 px-3 py-1 text-xs text-blue-200" [href]="normalizeSocial(seller.linkedin, 'linkedin')" target="_blank" rel="noopener">LinkedIn</a> }
                @if (seller.email) { <a class="rounded bg-emerald-500/15 px-3 py-1 text-xs text-emerald-200" [href]="'mailto:' + seller.email">{{ seller.email }}</a> }
              </div>
            </div>

            <div class="grid min-w-72 grid-cols-3 gap-2 text-sm">
              <div class="rounded bg-zinc-900 p-3">
                <p class="text-[11px] uppercase text-zinc-500">Leads</p>
                <p class="font-semibold">{{ seller.leads?.length ?? 0 }}</p>
              </div>
              <div class="rounded bg-zinc-900 p-3">
                <p class="text-[11px] uppercase text-zinc-500">Acciones</p>
                <p class="font-semibold">{{ seller.activities?.length ?? 0 }}</p>
              </div>
              <div class="rounded bg-zinc-900 p-3">
                <p class="text-[11px] uppercase text-zinc-500">Perfil</p>
                <p class="font-semibold">{{ profileScore(seller) }}/{{ profileLabels.length }}</p>
              </div>
            </div>
          </div>
        </section>

        <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <section class="space-y-6">
            <section class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
              <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 class="font-semibold">Leads asignados</h2>
                  <p class="mt-1 text-sm text-zinc-400">Trabajo actual del vendedor y lugares para visitar/contactar.</p>
                </div>
                <div class="flex gap-2">
                  <select class="rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm" [(ngModel)]="leadToAssignId">
                    <option value="">Lead nuevo para asignar</option>
                    @for (lead of leadOptions(); track lead.id) {
                      <option [value]="lead.id">{{ lead.name }} / {{ lead.city }}</option>
                    }
                  </select>
                  <p-button label="Asignar" icon="pi pi-plus" size="small" (onClick)="assignLead()" />
                </div>
              </div>

              <div class="mt-4 overflow-x-auto">
                <table class="w-full min-w-[760px] text-left text-sm">
                  <thead class="bg-zinc-900 text-xs uppercase text-zinc-400">
                    <tr>
                      <th class="px-3 py-2">Lead</th>
                      <th class="px-3 py-2">Rubro</th>
                      <th class="px-3 py-2">Contacto</th>
                      <th class="px-3 py-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (lead of seller.leads ?? []; track lead.id) {
                      <tr class="border-t border-zinc-700 align-top">
                        <td class="px-3 py-3">
                          <a class="font-semibold text-white hover:text-blue-300" [routerLink]="['/admin/leads', lead.id]">{{ lead.name }}</a>
                          <p class="mt-1 text-xs text-zinc-400">{{ lead.city }} @if (lead.address) { <span>/ {{ lead.address }}</span> }</p>
                        </td>
                        <td class="px-3 py-3 text-zinc-300">{{ lead.category || '-' }}</td>
                        <td class="px-3 py-3 text-xs">
                          @if (lead.phone) { <a class="block text-green-300" [href]="phoneHref(lead.phone)">{{ lead.phone }}</a> }
                          @if (lead.email) { <a class="block text-blue-300" [href]="'mailto:' + lead.email">{{ lead.email }}</a> }
                          @if (lead.instagram) { <a class="block text-pink-300" [href]="normalizeInstagram(lead.instagram)" target="_blank" rel="noopener">{{ lead.instagram }}</a> }
                          @if (!lead.phone && !lead.email && !lead.instagram) { <span class="text-zinc-500">Sin contacto directo</span> }
                        </td>
                        <td class="px-3 py-3">
                          <button class="rounded bg-blue-600 px-3 py-1 text-xs hover:bg-blue-700" type="button" (click)="prepareActivity(lead, 'INSTAGRAM_SENT')">Mensaje</button>
                          <button class="ml-2 rounded bg-purple-600 px-3 py-1 text-xs hover:bg-purple-700" type="button" (click)="prepareActivity(lead, 'VISITED')">Visita</button>
                        </td>
                      </tr>
                    } @empty {
                      <tr><td class="px-3 py-8 text-center text-zinc-400" colspan="4">Todavia no tiene leads asignados.</td></tr>
                    }
                  </tbody>
                </table>
              </div>
            </section>

            <section class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
              <h2 class="font-semibold">Historial comercial</h2>
              <div class="mt-4 space-y-3">
                @for (activity of seller.activities ?? []; track activity.id) {
                  <div class="rounded border border-zinc-700 bg-zinc-900 p-3 text-sm">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                      <p class="font-semibold">{{ activityLabel(activity.type) }}</p>
                      <span class="text-xs text-zinc-500">{{ activity.occurredAt | date:'short' }}</span>
                    </div>
                    <p class="mt-1 text-zinc-400">{{ activity.lead?.name || 'Sin lead' }} @if (activity.lead?.city) { <span>/ {{ activity.lead?.city }}</span> }</p>
                    @if (activity.address) { <p class="mt-1 text-xs text-purple-200">Lugar: {{ activity.address }}</p> }
                    @if (activity.note) { <p class="mt-2 text-zinc-300">{{ activity.note }}</p> }
                    @if (activity.outcome) { <p class="mt-2 text-xs text-green-200">Resultado: {{ activity.outcome }}</p> }
                  </div>
                } @empty {
                  <p class="text-sm text-zinc-400">Todavia no hay actividad registrada.</p>
                }
              </div>
            </section>

            <section class="grid gap-4 lg:grid-cols-2">
              @for (guide of salesGuides; track guide.title) {
                <article class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
                  <h2 class="font-semibold text-blue-200">{{ guide.title }}</h2>
                  <ul class="mt-3 space-y-2 text-sm text-zinc-300">
                    @for (item of guide.items; track item) {
                      <li class="rounded bg-zinc-900 p-2">{{ item }}</li>
                    }
                  </ul>
                </article>
              }
            </section>

            <section class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
              <h2 class="font-semibold">Scripts listos para usar</h2>
              <div class="mt-4 grid gap-3 lg:grid-cols-2">
                @for (example of messageExamples; track example.title) {
                  <article class="rounded border border-zinc-700 bg-zinc-900 p-3">
                    <div class="flex items-center justify-between gap-2">
                      <h3 class="font-semibold">{{ example.title }}</h3>
                      <span class="rounded bg-blue-500/15 px-2 py-1 text-xs text-blue-200">{{ example.channel }}</span>
                    </div>
                    <p class="mt-3 whitespace-pre-line text-sm text-zinc-300">{{ example.text }}</p>
                    <button class="mt-3 rounded bg-zinc-700 px-3 py-1 text-xs hover:bg-zinc-600" type="button" (click)="copyText(example.text)">Copiar</button>
                  </article>
                }
              </div>
            </section>

            <section class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
              <h2 class="font-semibold">Objeciones y respuestas</h2>
              <div class="mt-4 grid gap-3 lg:grid-cols-2">
                @for (item of objectionGuides; track item.objection) {
                  <article class="rounded border border-zinc-700 bg-zinc-900 p-3">
                    <h3 class="font-semibold text-orange-200">{{ item.objection }}</h3>
                    <p class="mt-2 text-sm text-zinc-300">{{ item.answer }}</p>
                  </article>
                }
              </div>
            </section>
          </section>

          <aside class="space-y-6">
            <section class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
              <h2 class="font-semibold">Registrar accion</h2>
              <div class="mt-4 space-y-3">
                <select class="w-full rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm" [(ngModel)]="selectedLeadId">
                  <option value="">Sin lead asociado</option>
                  @for (lead of allSellerLeadOptions(seller); track lead.id) {
                    <option [value]="lead.id">{{ lead.name }} / {{ lead.city }}</option>
                  }
                </select>
                <select class="w-full rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm" [(ngModel)]="activityType">
                  @for (item of activityTypes; track item) {
                    <option [value]="item">{{ activityLabel(item) }}</option>
                  }
                </select>
                <input class="w-full rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm" placeholder="Canal" [(ngModel)]="activityChannel" />
                <input class="w-full rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm" placeholder="Direccion visitada" [(ngModel)]="activityAddress" />
                <textarea class="h-24 w-full rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm" placeholder="Nota, objecion, resultado o proximo paso" [(ngModel)]="activityNote"></textarea>
                <p-button label="Guardar accion" icon="pi pi-send" size="small" (onClick)="recordActivity()" />
              </div>
            </section>

            <section class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
              <div class="flex items-center justify-between gap-3">
                <h2 class="font-semibold">Estado y metas</h2>
                <select class="rounded border border-zinc-600 bg-zinc-900 px-2 py-1 text-xs" [ngModel]="seller.status" (ngModelChange)="updateSeller({ status: $event })">
                  @for (item of sellerStatuses; track item) {
                    <option [value]="item">{{ statusLabel(item) }}</option>
                  }
                </select>
              </div>
              <div class="mt-4 grid gap-3">
                <label class="text-sm text-zinc-300">
                  Meta diaria de mensajes
                  <input class="mt-1 w-full rounded border border-zinc-600 bg-zinc-900 px-3 py-2" type="number" [ngModel]="seller.dailyTarget" (ngModelChange)="updateSeller({ dailyTarget: toNumber($event) })" />
                </label>
                <label class="text-sm text-zinc-300">
                  Meta semanal de visitas
                  <input class="mt-1 w-full rounded border border-zinc-600 bg-zinc-900 px-3 py-2" type="number" [ngModel]="seller.weeklyVisitTarget" (ngModelChange)="updateSeller({ weeklyVisitTarget: toNumber($event) })" />
                </label>
              </div>
            </section>

            <section class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
              <h2 class="font-semibold">Checklist de perfil</h2>
              <div class="mt-4 space-y-2">
                @for (item of profileLabels; track item.key) {
                  <label class="flex gap-3 rounded border border-zinc-700 bg-zinc-900 p-3 text-sm">
                    <input type="checkbox" [ngModel]="seller.profileChecklist?.[item.key] ?? false" (ngModelChange)="toggleProfile(item.key)" />
                    <span>{{ item.label }}</span>
                  </label>
                }
              </div>
            </section>

            <section class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
              <h2 class="font-semibold">Plantillas de perfil</h2>
              <div class="mt-4 space-y-3">
                @for (template of profileTemplates; track template.title) {
                  <article class="rounded border border-zinc-700 bg-zinc-900 p-3">
                    <h3 class="font-semibold text-blue-200">{{ template.title }}</h3>
                    <p class="mt-2 text-sm text-zinc-300">{{ template.text }}</p>
                    <button class="mt-3 rounded bg-zinc-700 px-3 py-1 text-xs hover:bg-zinc-600" type="button" (click)="copyText(template.text)">Copiar</button>
                  </article>
                }
              </div>
            </section>

            <section class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
              <h2 class="font-semibold">Documentacion operativa</h2>
              <div class="mt-4 space-y-3">
                @for (doc of trainingDocs; track doc.title) {
                  <article class="rounded border border-zinc-700 bg-zinc-900 p-3">
                    <h3 class="font-semibold">{{ doc.title }}</h3>
                    <p class="mt-2 text-sm text-zinc-300">{{ doc.body }}</p>
                  </article>
                }
              </div>
            </section>
          </aside>
        </div>
      } @else {
        <div class="rounded-lg border border-zinc-700 bg-zinc-800 p-8 text-center text-zinc-400">Cargando vendedor...</div>
      }
    </div>
  `,
  styles: [`:host { display: block; } input, select, textarea { color-scheme: dark; }`],
})
export class AdminSellerDetailComponent {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly sellerId = this.route.snapshot.paramMap.get('id') ?? '';

  readonly seller = signal<Seller | null>(null);
  readonly leads = signal<Lead[]>([]);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly leadOptions = computed(() => this.leads().filter((lead) => !['WON', 'LOST', 'ARCHIVED'].includes(lead.status)).slice(0, 100));

  readonly sellerStatuses: SellerStatus[] = ['TRAINING', 'ACTIVE', 'PAUSED', 'INACTIVE'];
  readonly activityTypes: SellerActivityType[] = ['INSTAGRAM_SENT', 'LINKEDIN_SENT', 'WHATSAPP_SENT', 'EMAIL_SENT', 'CALLED', 'VISITED', 'MEETING', 'REPLIED', 'FOLLOW_UP', 'NOTE'];
  readonly profileLabels = PROFILE_CHECKLIST_LABELS;
  readonly salesGuides = SALES_GUIDES;
  readonly messageExamples = MESSAGE_EXAMPLES;
  readonly objectionGuides = OBJECTION_GUIDES;
  readonly profileTemplates = PROFILE_TEMPLATES;
  readonly trainingDocs = TRAINING_DOCS;

  leadToAssignId = '';
  selectedLeadId = '';
  activityType: SellerActivityType = 'INSTAGRAM_SENT';
  activityChannel = 'instagram';
  activityAddress = '';
  activityNote = '';

  constructor() {
    this.refresh();
    this.fetchLeadOptions();
  }

  refresh(): void {
    this.api.get<Seller>(`sellers/${this.sellerId}`).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (seller) => this.seller.set(seller),
      error: (err) => this.errorMessage.set(err?.error?.message || 'No se pudo cargar el vendedor'),
    });
  }

  fetchLeadOptions(): void {
    this.api.get<Paginated<Lead>>('leads', { limit: 100, status: 'NEW' }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => this.leads.set(res.data ?? []),
      error: (err) => this.errorMessage.set(err?.error?.message || 'No se pudieron cargar leads'),
    });
  }

  assignLead(): void {
    if (!this.leadToAssignId) return;
    this.api.post<{ assigned: number }>(`sellers/${this.sellerId}/assign-leads`, { leadIds: [this.leadToAssignId] }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.leadToAssignId = '';
        this.addSystemMessage(`Leads asignados: ${res.assigned}`);
        this.refresh();
      },
      error: (err) => this.errorMessage.set(err?.error?.message || 'No se pudo asignar el lead'),
    });
  }

  prepareActivity(lead: Lead, type: SellerActivityType): void {
    this.selectedLeadId = lead.id;
    this.activityType = type;
    this.activityChannel = type === 'VISITED' ? 'local' : 'instagram';
    this.activityAddress = lead.address || '';
    this.activityNote = type === 'VISITED' ? `Visita fisica a ${lead.name}.` : `Mensaje inicial enviado a ${lead.name}.`;
  }

  recordActivity(): void {
    this.api
      .post<SellerActivity>(`sellers/${this.sellerId}/activities`, {
        leadId: this.selectedLeadId || undefined,
        type: this.activityType,
        channel: this.activityChannel || undefined,
        address: this.activityAddress || undefined,
        note: this.activityNote || undefined,
        outcome: this.activityType === 'VISITED' ? 'Visita registrada' : undefined,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.activityNote = '';
          this.activityAddress = '';
          this.addSystemMessage('Accion registrada.');
          this.refresh();
        },
        error: (err) => this.errorMessage.set(err?.error?.message || 'No se pudo registrar la accion'),
      });
  }

  updateSeller(patch: Partial<Seller>): void {
    this.api.patch<Seller>(`sellers/${this.sellerId}`, patch).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (seller) => {
        this.seller.set({ ...this.seller(), ...seller } as Seller);
        this.addSystemMessage('Vendedor actualizado.');
      },
      error: (err) => this.errorMessage.set(err?.error?.message || 'No se pudo actualizar el vendedor'),
    });
  }

  toggleProfile(key: keyof SellerProfileChecklist): void {
    const current = this.seller();
    if (!current) return;
    const profileChecklist = { ...(current.profileChecklist ?? {}), [key]: !current.profileChecklist?.[key] };
    this.updateSeller({ profileChecklist });
  }

  profileScore(seller: Seller): number {
    return Object.values(seller.profileChecklist ?? {}).filter(Boolean).length;
  }

  allSellerLeadOptions(seller: Seller): Lead[] {
    const assigned = seller.leads ?? [];
    const extras = this.leadOptions().filter((lead) => !assigned.some((item) => item.id === lead.id));
    return [...assigned, ...extras];
  }

  statusLabel(status: SellerStatus): string {
    return SELLER_STATUS_LABELS[status] ?? status;
  }

  activityLabel(type: SellerActivityType): string {
    return SELLER_ACTIVITY_LABELS[type] ?? type;
  }

  statusClass(status: SellerStatus): string {
    if (status === 'ACTIVE') return 'bg-green-500/20 text-green-200';
    if (status === 'TRAINING') return 'bg-blue-500/20 text-blue-200';
    if (status === 'PAUSED') return 'bg-orange-500/20 text-orange-200';
    return 'bg-zinc-700 text-zinc-300';
  }

  normalizeSocial(value: string, network: 'instagram' | 'linkedin'): string {
    if (/^https?:\/\//i.test(value)) return value;
    const clean = value.replace(/^@/, '');
    return network === 'instagram' ? `https://www.instagram.com/${clean}` : `https://www.linkedin.com/in/${clean}`;
  }

  normalizeInstagram(value: string): string {
    if (/^https?:\/\//i.test(value)) return value;
    return `https://www.instagram.com/${value.replace(/^@/, '')}`;
  }

  phoneHref(phone: string): string {
    return `tel:${phone.replace(/[^\d+]/g, '')}`;
  }

  toNumber(value: string | number | null): number | undefined {
    if (value === null || value === '') return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  copyText(text: string): void {
    navigator.clipboard?.writeText(text)
      .then(() => this.addSystemMessage('Texto copiado.'))
      .catch(() => this.errorMessage.set('No se pudo copiar el texto'));
  }

  private addSystemMessage(message: string): void {
    this.successMessage.set(message);
    setTimeout(() => {
      if (this.successMessage() === message) this.successMessage.set('');
    }, 3500);
  }
}
