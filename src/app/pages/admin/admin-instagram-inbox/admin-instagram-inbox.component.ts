import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../core/services/api.service';
import { Lead, Paginated, messageForLead, normalizeInstagram } from '../admin-leads/lead-shared';

type ConversationStatus = 'UNMATCHED' | 'MATCHED' | 'ARCHIVED';

interface InstagramSetup {
  webhookUrl: string;
  hasVerifyToken: boolean;
  hasAppSecret: boolean;
  requiredEnv: string[];
  subscriptions: string[];
}

interface InstagramMessage {
  id: string;
  direction: 'INBOUND' | 'OUTBOUND';
  text?: string;
  receivedAt: string;
}

interface InstagramConversation {
  id: string;
  senderId: string;
  username?: string;
  leadId?: string;
  status: ConversationStatus;
  lastMessageText?: string;
  lastMessageAt?: string;
  lead?: Lead;
  messages?: InstagramMessage[];
}

@Component({
  selector: 'app-admin-instagram-inbox',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-sm uppercase tracking-wide text-blue-300">Captacion automatizada</p>
          <h1 class="text-3xl font-bold">Respuestas de Instagram</h1>
          <p class="mt-2 text-sm text-zinc-400">Webhook de Meta, bandeja de respuestas y registro de mensajes aprobados.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <p-button label="Actualizar" icon="pi pi-refresh" severity="secondary" size="small" (onClick)="refresh()" />
        </div>
      </div>

      @if (errorMessage()) {
        <div class="rounded border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{{ errorMessage() }}</div>
      }
      @if (successMessage()) {
        <div class="rounded border border-green-500/40 bg-green-500/10 p-3 text-sm text-green-200">{{ successMessage() }}</div>
      }

      <section class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 class="text-lg font-semibold">Conexion Meta</h2>
            <p class="mt-1 text-sm text-zinc-400">Usa esta URL al configurar Instagram Messaging Webhooks en Meta Developers.</p>
            <div class="mt-3 rounded border border-zinc-700 bg-zinc-900 p-3 font-mono text-xs text-blue-100">{{ setup()?.webhookUrl || 'Cargando...' }}</div>
          </div>
          <div class="grid gap-2 text-sm sm:grid-cols-2">
            <div class="rounded border border-zinc-700 bg-zinc-900 px-3 py-2">
              <span class="text-zinc-500">Verify token</span>
              <strong class="ml-2" [class.text-green-300]="setup()?.hasVerifyToken" [class.text-red-300]="!setup()?.hasVerifyToken">
                {{ setup()?.hasVerifyToken ? 'OK' : 'Falta' }}
              </strong>
            </div>
            <div class="rounded border border-zinc-700 bg-zinc-900 px-3 py-2">
              <span class="text-zinc-500">App secret</span>
              <strong class="ml-2" [class.text-green-300]="setup()?.hasAppSecret" [class.text-red-300]="!setup()?.hasAppSecret">
                {{ setup()?.hasAppSecret ? 'OK' : 'Falta' }}
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
          <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 class="text-lg font-semibold">Bandeja</h2>
              <p class="text-sm text-zinc-400">{{ conversations().length }} conversaciones recibidas</p>
            </div>
            <div class="flex gap-2">
              <select [(ngModel)]="statusFilter" class="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" (change)="loadConversations()">
                <option value="">Todas</option>
                <option value="UNMATCHED">Sin lead</option>
                <option value="MATCHED">Vinculadas</option>
                <option value="ARCHIVED">Archivadas</option>
              </select>
              <input [(ngModel)]="search" class="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" placeholder="Buscar" (keyup.enter)="loadConversations()" />
            </div>
          </div>

          <div class="mt-4 divide-y divide-zinc-700">
            @for (conversation of conversations(); track conversation.id) {
              <button
                type="button"
                class="block w-full px-0 py-4 text-left hover:bg-zinc-900/50"
                (click)="selectConversation(conversation.id)"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="font-semibold">{{ conversation.lead?.name || conversation.username || conversation.senderId }}</p>
                    <p class="mt-1 line-clamp-2 text-sm text-zinc-400">{{ conversation.lastMessageText || 'Sin texto' }}</p>
                  </div>
                  <span class="rounded border border-zinc-600 px-2 py-1 text-xs text-zinc-300">{{ statusLabel(conversation.status) }}</span>
                </div>
              </button>
            } @empty {
              <p class="py-8 text-center text-sm text-zinc-500">Todavia no entraron respuestas por webhook.</p>
            }
          </div>
        </div>

        <aside class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
          <h2 class="text-lg font-semibold">Detalle</h2>
          @if (selectedConversation(); as conversation) {
            <div class="mt-4 space-y-4">
              <div class="rounded border border-zinc-700 bg-zinc-900 p-3">
                <p class="text-xs uppercase text-zinc-500">Remitente</p>
                <p class="font-mono text-sm">{{ conversation.senderId }}</p>
                @if (conversation.lead) {
                  <p class="mt-2 text-sm text-green-300">Vinculado a {{ conversation.lead.name }}</p>
                }
              </div>

              <div class="space-y-2">
                <label class="text-sm text-zinc-400" for="leadLink">Vincular lead</label>
                <select id="leadLink" [(ngModel)]="leadToLinkId" class="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm">
                  <option value="">Elegir lead</option>
                  @for (lead of leadOptions(); track lead.id) {
                    <option [value]="lead.id">{{ lead.name }} - {{ lead.city }}</option>
                  }
                </select>
                <div class="flex gap-2">
                  <p-button label="Vincular y marcar respondio" icon="pi pi-link" size="small" [disabled]="!leadToLinkId" (onClick)="linkLead(conversation.id)" />
                  <p-button label="Archivar" icon="pi pi-inbox" severity="secondary" size="small" (onClick)="archive(conversation.id)" />
                </div>
              </div>

              <div class="space-y-3">
                @for (message of conversation.messages || []; track message.id) {
                  <div class="rounded border border-zinc-700 bg-zinc-900 p-3">
                    <p class="text-xs uppercase text-blue-300">{{ message.direction === 'INBOUND' ? 'Respuesta recibida' : 'Enviado' }}</p>
                    <p class="mt-1 text-sm text-zinc-100">{{ message.text || 'Adjunto o evento sin texto' }}</p>
                    <p class="mt-2 text-xs text-zinc-500">{{ message.receivedAt | date:'short' }}</p>
                  </div>
                }
              </div>
            </div>
          } @else {
            <p class="mt-4 text-sm text-zinc-500">Elegi una conversacion para ver el historial.</p>
          }
        </aside>
      </section>

      <section class="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
        <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 class="text-lg font-semibold">Cola aprobada de 20 leads</h2>
            <p class="text-sm text-zinc-400">Abri Instagram, envia el texto revisado y registra el contacto en Rakium.</p>
          </div>
          <p-button label="Traer 20 con Instagram" icon="pi pi-users" severity="secondary" size="small" (onClick)="loadOutreachLeads()" />
        </div>

        <div class="mt-4 grid gap-3 lg:grid-cols-2">
          @for (lead of outreachLeads(); track lead.id) {
            <article class="rounded border border-zinc-700 bg-zinc-900 p-3">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h3 class="font-semibold">{{ lead.name }}</h3>
                  <p class="text-sm text-zinc-400">{{ lead.city }} · {{ lead.category || 'Sin rubro' }}</p>
                </div>
                <span class="rounded border border-zinc-600 px-2 py-1 text-xs text-zinc-300">P{{ lead.priority }}</span>
              </div>
              <p class="mt-3 rounded border border-zinc-700 bg-zinc-800 p-3 text-sm text-zinc-200">{{ suggestedMessage(lead) }}</p>
              <div class="mt-3 flex flex-wrap gap-2">
                @if (lead.instagram) {
                  <a class="rounded bg-[#639BF0] px-3 py-2 text-sm font-semibold text-white no-underline hover:bg-[#78a8f2]" [href]="instagramUrl(lead.instagram)" target="_blank" rel="noreferrer">Abrir Instagram</a>
                }
                <p-button label="Registrar enviado" icon="pi pi-send" severity="secondary" size="small" (onClick)="registerSent(lead)" />
              </div>
            </article>
          } @empty {
            <p class="text-sm text-zinc-500">No hay leads cargados en la cola todavia.</p>
          }
        </div>
      </section>
    </div>
  `,
})
export class AdminInstagramInboxComponent {
  private readonly api = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);

  setup = signal<InstagramSetup | null>(null);
  conversations = signal<InstagramConversation[]>([]);
  selectedConversation = signal<InstagramConversation | null>(null);
  leadOptions = signal<Lead[]>([]);
  outreachLeads = signal<Lead[]>([]);
  errorMessage = signal('');
  successMessage = signal('');
  selectedConversationId = computed(() => this.selectedConversation()?.id);

  statusFilter = '';
  search = '';
  leadToLinkId = '';

  constructor() {
    this.refresh();
  }

  refresh() {
    this.errorMessage.set('');
    this.loadSetup();
    this.loadConversations();
    this.loadLeadOptions();
    this.loadOutreachLeads();
  }

  loadSetup() {
    this.api.get<InstagramSetup>('integrations/instagram/setup').pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (setup) => this.setup.set(setup),
      error: () => this.errorMessage.set('No pude cargar el estado de Instagram.'),
    });
  }

  loadConversations() {
    this.api
      .get<Paginated<InstagramConversation>>('integrations/instagram/conversations', {
        limit: 50,
        status: this.statusFilter || undefined,
        search: this.search || undefined,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.conversations.set(response.data);
          const currentId = this.selectedConversationId();
          if (currentId) {
            const updated = response.data.find((conversation) => conversation.id === currentId);
            if (updated) this.selectConversation(updated.id);
          }
        },
        error: () => this.errorMessage.set('No pude cargar las conversaciones.'),
      });
  }

  selectConversation(id: string) {
    this.api.get<InstagramConversation>(`integrations/instagram/conversations/${id}`).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (conversation) => {
        this.selectedConversation.set(conversation);
        this.leadToLinkId = conversation.leadId || '';
      },
      error: () => this.errorMessage.set('No pude abrir la conversacion.'),
    });
  }

  loadLeadOptions() {
    this.api.get<Paginated<Lead>>('leads', { limit: 100, contact: 'instagram' }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => this.leadOptions.set(response.data),
      error: () => this.errorMessage.set('No pude cargar leads para vincular.'),
    });
  }

  loadOutreachLeads() {
    this.api
      .get<Paginated<Lead>>('leads', { limit: 20, contact: 'instagram', status: 'NEW' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => this.outreachLeads.set(response.data),
        error: () => this.errorMessage.set('No pude cargar la cola de leads.'),
      });
  }

  linkLead(conversationId: string) {
    if (!this.leadToLinkId) return;
    this.api
      .patch<InstagramConversation>(`integrations/instagram/conversations/${conversationId}/link-lead`, { leadId: this.leadToLinkId })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (conversation) => {
          this.selectedConversation.set(conversation);
          this.successMessage.set('Conversacion vinculada y lead marcado como respondio.');
          this.loadConversations();
        },
        error: () => this.errorMessage.set('No pude vincular la conversacion.'),
      });
  }

  archive(conversationId: string) {
    this.api.patch<InstagramConversation>(`integrations/instagram/conversations/${conversationId}/archive`, {}).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.successMessage.set('Conversacion archivada.');
        this.selectedConversation.set(null);
        this.loadConversations();
      },
      error: () => this.errorMessage.set('No pude archivar la conversacion.'),
    });
  }

  registerSent(lead: Lead) {
    this.api
      .post(`leads/${lead.id}/activities`, {
        type: 'INSTAGRAM_SENT',
        channel: 'instagram',
        note: this.suggestedMessage(lead),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.successMessage.set(`Contacto registrado para ${lead.name}.`);
          this.loadOutreachLeads();
        },
        error: () => this.errorMessage.set('No pude registrar el contacto.'),
      });
  }

  suggestedMessage(lead: Lead) {
    return messageForLead(lead);
  }

  instagramUrl(value: string) {
    return normalizeInstagram(value);
  }

  statusLabel(status: ConversationStatus) {
    const labels: Record<ConversationStatus, string> = {
      UNMATCHED: 'Sin lead',
      MATCHED: 'Vinculada',
      ARCHIVED: 'Archivada',
    };
    return labels[status];
  }
}
