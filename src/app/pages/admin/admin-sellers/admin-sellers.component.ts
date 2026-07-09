import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../core/services/api.service';
import { Lead, Paginated } from '../admin-leads/lead-shared';
import {
  PROFILE_CHECKLIST_LABELS,
  SALES_GUIDES,
  SELLER_ACTIVITY_LABELS,
  SELLER_STATUS_LABELS,
  Seller,
  SellerActivity,
  SellerActivityType,
  SellerProfileChecklist,
  SellerStats,
  SellerStatus,
} from './seller-shared';

@Component({
  selector: 'app-admin-sellers',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-sm uppercase tracking-wide text-blue-300">Operacion comercial</p>
          <h1 class="text-3xl font-bold">Vendedores</h1>
          <p class="mt-2 text-sm text-zinc-400">Asignacion de leads, mensajes enviados, visitas fisicas y entrenamiento comercial.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <p-button label="Actualizar" icon="pi pi-refresh" severity="secondary" size="small" (onClick)="refresh()" />
          <p-button label="Nuevo vendedor" icon="pi pi-user-plus" size="small" (onClick)="showCreate.set(!showCreate())" />
        </div>
      </div>

      @if (errorMessage()) {
        <div class="rounded border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{{ errorMessage() }}</div>
      }
      @if (successMessage()) {
        <div class="rounded border border-green-500/40 bg-green-500/10 p-3 text-sm text-green-200">{{ successMessage() }}</div>
      }

      <section class="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3">
        <div class="flex gap-6 overflow-x-auto">
          <div class="shrink-0">
            <p class="text-[11px] uppercase text-zinc-500">Vendedores</p>
            <p class="text-xl font-semibold">{{ stats()?.total ?? 0 }}</p>
          </div>
          <div class="shrink-0">
            <p class="text-[11px] uppercase text-zinc-500">Activos</p>
            <p class="text-xl font-semibold text-green-300">{{ stats()?.active ?? 0 }}</p>
          </div>
          <div class="shrink-0">
            <p class="text-[11px] uppercase text-zinc-500">Leads asignados</p>
            <p class="text-xl font-semibold text-blue-300">{{ stats()?.assignedLeads ?? 0 }}</p>
          </div>
          <div class="shrink-0">
            <p class="text-[11px] uppercase text-zinc-500">Contactos</p>
            <p class="text-xl font-semibold text-orange-300">{{ stats()?.contacts ?? 0 }}</p>
          </div>
          <div class="shrink-0">
            <p class="text-[11px] uppercase text-zinc-500">Visitas</p>
            <p class="text-xl font-semibold text-purple-300">{{ stats()?.visits ?? 0 }}</p>
          </div>
          <div class="shrink-0">
            <p class="text-[11px] uppercase text-zinc-500">Reuniones</p>
            <p class="text-xl font-semibold text-cyan-300">{{ stats()?.meetings ?? 0 }}</p>
          </div>
        </div>
      </section>

      @if (showCreate()) {
        <section class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
          <h2 class="font-semibold">Alta rapida</h2>
          <div class="mt-4 grid gap-3 md:grid-cols-4">
            <input class="rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm" placeholder="Nombre" [(ngModel)]="draftSeller.name" />
            <input class="rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm" placeholder="Email" [(ngModel)]="draftSeller.email" />
            <input class="rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm" placeholder="Instagram" [(ngModel)]="draftSeller.instagram" />
            <input class="rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm" placeholder="LinkedIn" [(ngModel)]="draftSeller.linkedin" />
            <input class="rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm" placeholder="Ciudad base" [(ngModel)]="draftSeller.city" />
            <input class="rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm" placeholder="Rol" [(ngModel)]="draftSeller.role" />
            <input class="rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm" type="number" placeholder="Meta diaria" [(ngModel)]="draftSeller.dailyTarget" />
            <input class="rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm" type="number" placeholder="Visitas semanales" [(ngModel)]="draftSeller.weeklyVisitTarget" />
          </div>
          <div class="mt-3">
            <p-button label="Crear vendedor" icon="pi pi-check" size="small" (onClick)="createSeller()" />
          </div>
        </section>
      }

      <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section class="space-y-4">
          <div class="grid gap-3 rounded-lg border border-zinc-700 bg-zinc-800 p-4 md:grid-cols-3">
            <input class="rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm" placeholder="Buscar vendedor..." [(ngModel)]="search" (ngModelChange)="fetchSellers()" />
            <select class="rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm" [(ngModel)]="status" (ngModelChange)="fetchSellers()">
              <option value="">Todos los estados</option>
              @for (item of sellerStatuses; track item) {
                <option [value]="item">{{ statusLabel(item) }}</option>
              }
            </select>
            <select class="rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm" [(ngModel)]="selectedLeadId">
              <option value="">Lead para registrar actividad</option>
              @for (lead of leadOptions(); track lead.id) {
                <option [value]="lead.id">{{ lead.name }} / {{ lead.city }}</option>
              }
            </select>
          </div>

          <div class="grid gap-4 lg:grid-cols-2">
            @for (seller of sellers(); track seller.id) {
              <article
                class="rounded-lg border bg-zinc-800 p-4 transition hover:border-blue-400"
                [ngClass]="selectedSeller()?.id === seller.id ? 'border-blue-400' : 'border-zinc-700'"
              >
                <button class="w-full text-left" type="button" (click)="selectSeller(seller)">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <h2 class="truncate text-lg font-semibold">{{ seller.name }}</h2>
                      <p class="mt-1 text-sm text-zinc-400">{{ seller.role || 'Vendedor comercial' }} @if (seller.city) { <span>/ {{ seller.city }}</span> }</p>
                    </div>
                    <span class="rounded px-2 py-1 text-xs" [ngClass]="statusClass(seller.status)">{{ statusLabel(seller.status) }}</span>
                  </div>
                  <div class="mt-4 grid grid-cols-3 gap-2 text-sm">
                    <div class="rounded bg-zinc-900 p-3">
                      <p class="text-[11px] uppercase text-zinc-500">Leads</p>
                      <p class="font-semibold">{{ seller._count?.leads ?? 0 }}</p>
                    </div>
                    <div class="rounded bg-zinc-900 p-3">
                      <p class="text-[11px] uppercase text-zinc-500">Acciones</p>
                      <p class="font-semibold">{{ seller._count?.activities ?? 0 }}</p>
                    </div>
                    <div class="rounded bg-zinc-900 p-3">
                      <p class="text-[11px] uppercase text-zinc-500">Perfil</p>
                      <p class="font-semibold">{{ profileScore(seller) }}/{{ profileLabels.length }}</p>
                    </div>
                  </div>
                </button>
                <div class="mt-4 flex flex-wrap gap-2">
                  <p-button label="Ver detalle" icon="pi pi-arrow-right" size="small" severity="secondary" (onClick)="openSeller(seller)" />
                  @if (seller.instagram) { <a class="rounded bg-pink-500/15 px-3 py-1 text-xs text-pink-200" [href]="normalizeSocial(seller.instagram, 'instagram')" target="_blank" rel="noopener">Instagram</a> }
                  @if (seller.linkedin) { <a class="rounded bg-blue-500/15 px-3 py-1 text-xs text-blue-200" [href]="normalizeSocial(seller.linkedin, 'linkedin')" target="_blank" rel="noopener">LinkedIn</a> }
                  @if (seller.phone) { <span class="rounded bg-green-500/15 px-3 py-1 text-xs text-green-200">{{ seller.phone }}</span> }
                </div>
              </article>
            } @empty {
              <div class="rounded-lg border border-zinc-700 bg-zinc-800 p-8 text-center text-zinc-400">Todavia no hay vendedores cargados.</div>
            }
          </div>
        </section>

        <aside class="space-y-6">
          <section class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
            <h2 class="font-semibold">Registrar accion</h2>
            @if (selectedSeller(); as seller) {
              <p class="mt-1 text-sm text-zinc-400">Vendedor: {{ seller.name }}</p>
              <div class="mt-4 space-y-3">
                <select class="w-full rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm" [(ngModel)]="activityType">
                  @for (item of activityTypes; track item) {
                    <option [value]="item">{{ activityLabel(item) }}</option>
                  }
                </select>
                <input class="w-full rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm" placeholder="Canal: Instagram, WhatsApp, local..." [(ngModel)]="activityChannel" />
                <input class="w-full rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm" placeholder="Direccion visitada (si fue fisico)" [(ngModel)]="activityAddress" />
                <textarea class="h-24 w-full rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm" placeholder="Nota, resultado, objecion o proximo paso" [(ngModel)]="activityNote"></textarea>
                <p-button label="Guardar accion" icon="pi pi-send" size="small" (onClick)="recordActivity()" />
              </div>
            } @else {
              <p class="mt-2 text-sm text-zinc-400">Selecciona un vendedor para registrar mensajes enviados o visitas fisicas.</p>
            }
          </section>

          @if (selectedSeller(); as seller) {
            <section class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
              <div class="flex items-center justify-between gap-3">
                <h2 class="font-semibold">Perfil comercial</h2>
                <select class="rounded border border-zinc-600 bg-zinc-900 px-2 py-1 text-xs" [ngModel]="seller.status" (ngModelChange)="updateSeller(seller, { status: $event })">
                  @for (item of sellerStatuses; track item) {
                    <option [value]="item">{{ statusLabel(item) }}</option>
                  }
                </select>
              </div>
              <div class="mt-4 space-y-2">
                @for (item of profileLabels; track item.key) {
                  <label class="flex gap-3 rounded border border-zinc-700 bg-zinc-900 p-3 text-sm">
                    <input type="checkbox" [ngModel]="seller.profileChecklist?.[item.key] ?? false" (ngModelChange)="toggleProfile(seller, item.key)" />
                    <span>{{ item.label }}</span>
                  </label>
                }
              </div>
            </section>
          }
        </aside>
      </div>

      <section class="grid gap-4 lg:grid-cols-4">
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
        <h2 class="font-semibold">Actividad reciente</h2>
        <div class="mt-3 grid gap-2">
          @for (activity of stats()?.recentActivities ?? []; track activity.id) {
            <div class="rounded border border-zinc-700 bg-zinc-900 p-3 text-sm">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <p class="font-semibold">{{ activity.seller?.name || 'Vendedor' }} / {{ activityLabel(activity.type) }}</p>
                <span class="text-xs text-zinc-500">{{ activity.occurredAt | date:'short' }}</span>
              </div>
              <p class="mt-1 text-zinc-400">{{ activity.lead?.name || 'Sin lead' }} @if (activity.lead?.city) { <span>/ {{ activity.lead?.city }}</span> }</p>
              @if (activity.note) { <p class="mt-2 text-zinc-300">{{ activity.note }}</p> }
            </div>
          } @empty {
            <p class="text-sm text-zinc-400">Todavia no hay actividad registrada.</p>
          }
        </div>
      </section>
    </div>
  `,
  styles: [`:host { display: block; } input, select, textarea { color-scheme: dark; }`],
})
export class AdminSellersComponent {
  private readonly api = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  readonly sellers = signal<Seller[]>([]);
  readonly leads = signal<Lead[]>([]);
  readonly stats = signal<SellerStats | null>(null);
  readonly selectedSeller = signal<Seller | null>(null);
  readonly showCreate = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly leadOptions = computed(() => this.leads().filter((lead) => !['WON', 'LOST', 'ARCHIVED'].includes(lead.status)).slice(0, 100));

  readonly sellerStatuses: SellerStatus[] = ['TRAINING', 'ACTIVE', 'PAUSED', 'INACTIVE'];
  readonly activityTypes: SellerActivityType[] = ['INSTAGRAM_SENT', 'LINKEDIN_SENT', 'WHATSAPP_SENT', 'CALLED', 'VISITED', 'MEETING', 'REPLIED', 'FOLLOW_UP', 'NOTE'];
  readonly profileLabels = PROFILE_CHECKLIST_LABELS;
  readonly salesGuides = SALES_GUIDES;

  search = '';
  status = '';
  selectedLeadId = '';
  activityType: SellerActivityType = 'INSTAGRAM_SENT';
  activityChannel = 'instagram';
  activityAddress = '';
  activityNote = '';
  draftSeller: Partial<Seller> = {
    name: '',
    email: '',
    instagram: '',
    linkedin: '',
    city: '',
    role: 'Vendedor comercial',
    dailyTarget: 30,
    weeklyVisitTarget: 10,
  };

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this.fetchStats();
    this.fetchSellers();
    this.fetchLeads();
  }

  fetchStats(): void {
    this.api.get<SellerStats>('sellers/stats').pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (stats) => this.stats.set(stats),
      error: (err) => this.errorMessage.set(err?.error?.message || 'No se pudieron cargar estadisticas de vendedores'),
    });
  }

  fetchSellers(): void {
    this.api
      .get<Paginated<Seller>>('sellers', { limit: 100, search: this.search || undefined, status: this.status || undefined })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.sellers.set(res.data ?? []);
          const selectedId = this.selectedSeller()?.id;
          if (selectedId) this.selectedSeller.set((res.data ?? []).find((seller) => seller.id === selectedId) ?? null);
        },
        error: (err) => this.errorMessage.set(err?.error?.message || 'No se pudieron cargar vendedores'),
      });
  }

  fetchLeads(): void {
    this.api
      .get<Paginated<Lead>>('leads', { limit: 100, status: 'NEW' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => this.leads.set(res.data ?? []),
        error: (err) => this.errorMessage.set(err?.error?.message || 'No se pudieron cargar leads para asignar'),
      });
  }

  selectSeller(seller: Seller): void {
    this.selectedSeller.set(seller);
  }

  openSeller(seller: Seller): void {
    this.router.navigate(['/admin/sellers', seller.id]);
  }

  createSeller(): void {
    if (!this.draftSeller.name?.trim()) {
      this.errorMessage.set('El nombre del vendedor es obligatorio');
      return;
    }
    const payload = {
      ...this.draftSeller,
      status: 'TRAINING',
      profileChecklist: {},
    };
    this.api.post<Seller>('sellers', payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (seller) => {
        this.selectedSeller.set(seller);
        this.showCreate.set(false);
        this.draftSeller = { name: '', role: 'Vendedor comercial', dailyTarget: 30, weeklyVisitTarget: 10 };
        this.addSystemMessage('Vendedor creado.');
        this.refresh();
      },
      error: (err) => this.errorMessage.set(err?.error?.message || 'No se pudo crear el vendedor'),
    });
  }

  updateSeller(seller: Seller, patch: Partial<Seller>): void {
    this.api.patch<Seller>(`sellers/${seller.id}`, patch).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (updated) => {
        this.replaceSeller(updated);
        this.addSystemMessage('Vendedor actualizado.');
      },
      error: (err) => this.errorMessage.set(err?.error?.message || 'No se pudo actualizar el vendedor'),
    });
  }

  toggleProfile(seller: Seller, key: keyof SellerProfileChecklist): void {
    const profileChecklist = { ...(seller.profileChecklist ?? {}), [key]: !seller.profileChecklist?.[key] };
    this.updateSeller(seller, { profileChecklist });
  }

  recordActivity(): void {
    const seller = this.selectedSeller();
    if (!seller) return;
    const lead = this.leads().find((item) => item.id === this.selectedLeadId);
    this.api
      .post<SellerActivity>(`sellers/${seller.id}/activities`, {
        leadId: this.selectedLeadId || undefined,
        type: this.activityType,
        channel: this.activityChannel || undefined,
        address: this.activityAddress || lead?.address || undefined,
        note: this.activityNote || undefined,
        outcome: this.activityType === 'VISITED' ? 'Visita registrada' : undefined,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.activityNote = '';
          this.activityAddress = '';
          this.addSystemMessage('Accion comercial registrada.');
          this.refresh();
        },
        error: (err) => this.errorMessage.set(err?.error?.message || 'No se pudo guardar la accion'),
      });
  }

  profileScore(seller: Seller): number {
    return Object.values(seller.profileChecklist ?? {}).filter(Boolean).length;
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

  private replaceSeller(updated: Seller): void {
    this.sellers.update((items) => items.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)));
    if (this.selectedSeller()?.id === updated.id) this.selectedSeller.set({ ...this.selectedSeller(), ...updated } as Seller);
    this.fetchStats();
  }

  private addSystemMessage(message: string): void {
    this.successMessage.set(message);
    setTimeout(() => {
      if (this.successMessage() === message) this.successMessage.set('');
    }, 3500);
  }
}
