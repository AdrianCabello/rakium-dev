import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CHECKLIST_LABELS,
  Lead,
  LeadChecklist,
  dateInputValue,
  dateToIso,
  messageForLead,
  toNumber,
} from './lead-shared';

@Component({
  selector: 'app-lead-detail-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (lead; as current) {
      <div class="space-y-4 text-sm">
        <div class="flex flex-col gap-3 border-b border-zinc-700 pb-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p class="text-2xl font-semibold text-white">{{ current.name }}</p>
            <p class="mt-1 text-zinc-400">{{ current.category || 'Sin rubro' }} / {{ current.city }}</p>
            @if (current.address) {
              <p class="mt-1 text-xs text-zinc-500">{{ current.address }}</p>
            }
          </div>
          <div class="flex flex-wrap gap-2 text-xs">
            @if (current.website) {
              <a class="rounded bg-blue-500/20 px-3 py-2 text-blue-200 hover:bg-blue-500/30" [href]="normalizeUrl(current.website)" target="_blank" rel="noopener">Web</a>
            }
            @if (current.instagram) {
              <a class="rounded bg-pink-500/20 px-3 py-2 text-pink-200 hover:bg-pink-500/30" [href]="normalizeInstagram(current.instagram)" target="_blank" rel="noopener">Instagram</a>
            }
            @if (current.googleMapsUrl) {
              <a class="rounded bg-zinc-700 px-3 py-2 text-zinc-200 hover:bg-zinc-600" [href]="current.googleMapsUrl" target="_blank" rel="noopener">Maps</a>
            }
          </div>
        </div>

        <div class="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div class="rounded border border-zinc-700 bg-zinc-900 p-3">
            <p class="text-xs text-zinc-500">Oportunidad</p>
            <p class="mt-1 text-2xl font-semibold text-orange-300">{{ current.digitalPresenceScore }}/100</p>
          </div>
          <div class="rounded border border-zinc-700 bg-zinc-900 p-3">
            <p class="text-xs text-zinc-500">Estado</p>
            <p class="mt-1 text-lg font-semibold text-white">{{ current.status }}</p>
          </div>
          <div class="rounded border border-zinc-700 bg-zinc-900 p-3">
            <p class="text-xs text-zinc-500">Ultimo contacto</p>
            <p class="mt-1 text-sm text-white">{{ current.lastContactedAt ? (current.lastContactedAt | date:'short') : '-' }}</p>
          </div>
          <div class="rounded border border-zinc-700 bg-zinc-900 p-3">
            <p class="text-xs text-zinc-500">Proximo follow-up</p>
            <p class="mt-1 text-sm text-white">{{ current.nextFollowUpAt ? (current.nextFollowUpAt | date:'shortDate') : '-' }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div class="space-y-4">
            <div class="rounded border border-zinc-700 bg-zinc-900 p-4">
              <h3 class="mb-3 font-semibold">Gestion comercial</h3>
              <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
                <label class="text-xs text-zinc-400">
                  Responsable
                  <input class="mt-1 w-full rounded border border-zinc-600 bg-zinc-950 px-3 py-2 text-sm text-white" [ngModel]="current.assignedTo || ''" (ngModelChange)="fieldChange.emit({ lead: current, field: 'assignedTo', value: $event })" placeholder="Rakium / Lautaro / Adrian" />
                </label>
                <label class="text-xs text-zinc-400">
                  Valor estimado
                  <input class="mt-1 w-full rounded border border-zinc-600 bg-zinc-950 px-3 py-2 text-sm text-white" type="number" [ngModel]="current.estimatedValue || null" (ngModelChange)="fieldChange.emit({ lead: current, field: 'estimatedValue', value: toNumber($event) })" placeholder="0" />
                </label>
                <label class="text-xs text-zinc-400">
                  Follow-up
                  <input class="mt-1 w-full rounded border border-zinc-600 bg-zinc-950 px-3 py-2 text-sm text-white" type="date" [ngModel]="dateInputValue(current.nextFollowUpAt)" (ngModelChange)="fieldChange.emit({ lead: current, field: 'nextFollowUpAt', value: dateToIso($event) })" />
                </label>
              </div>
            </div>

            <div class="rounded border border-zinc-700 bg-zinc-900 p-4">
              <div class="mb-3 flex items-center justify-between">
                <h3 class="font-semibold">Diagnostico digital</h3>
                <span class="text-xs text-zinc-500">{{ checklistScore(current) }}/{{ checklistItems.length }}</span>
              </div>
              <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                @for (item of checklistItems; track item.key) {
                  <label class="flex items-center gap-2 rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-300">
                    <input type="checkbox" [checked]="!!current.checklist?.[item.key]" (change)="checklistChange.emit({ lead: current, key: item.key })" />
                    <span>{{ item.label }}</span>
                  </label>
                }
              </div>
            </div>

            <div class="rounded border border-zinc-700 bg-zinc-900 p-4">
              <div class="mb-3 flex items-center justify-between">
                <h3 class="font-semibold">Mensaje sugerido</h3>
                <button class="rounded bg-blue-600 px-3 py-1 text-xs hover:bg-blue-700" type="button" (click)="copy.emit(current)">Copiar</button>
              </div>
              <textarea class="h-36 w-full rounded border border-zinc-600 bg-zinc-950 p-3 text-xs text-zinc-100" [ngModel]="messageForLead(current)" (ngModelChange)="fieldChange.emit({ lead: current, field: 'suggestedMessage', value: $event })"></textarea>
            </div>
          </div>

          <div class="space-y-4">
            <div class="rounded border border-zinc-700 bg-zinc-900 p-4">
              <h3 class="mb-3 font-semibold">Notas y acciones</h3>
              <textarea #notesTextarea class="h-28 w-full rounded border border-zinc-600 bg-zinc-950 p-3 text-sm" placeholder="Nota de seguimiento..." [(ngModel)]="draftNote"></textarea>
              <div class="mt-3 flex flex-wrap gap-2">
                <button class="rounded bg-zinc-700 px-4 py-2 text-sm hover:bg-zinc-600" type="button" (click)="saveNote(current)">Guardar nota</button>
                <button class="rounded bg-blue-600 px-4 py-2 text-sm hover:bg-blue-700" type="button" (click)="instagramSent.emit(current)">IG enviado</button>
                <button class="rounded bg-green-600 px-4 py-2 text-sm hover:bg-green-700" type="button" (click)="convert.emit(current)">Convertir a cliente</button>
              </div>
            </div>

            <div class="space-y-2">
              @for (activity of current.activities ?? []; track activity.id) {
                <div class="rounded border border-zinc-700 bg-zinc-900 p-3">
                  <div class="text-xs text-zinc-500">{{ activity.type }} / {{ activity.createdAt | date:'short' }}</div>
                  <p class="mt-1 text-zinc-300">{{ activity.note || '-' }}</p>
                </div>
              } @empty {
                <p class="rounded border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-400">Todavia no hay actividad registrada.</p>
              }
            </div>
          </div>
        </div>
      </div>
    } @else {
      <p class="text-sm text-zinc-400">Selecciona un lead para revisar el detalle.</p>
    }
  `,
  styles: [`
    :host { display: block; }
    input, textarea { color-scheme: dark; }
  `],
})
export class LeadDetailPanelComponent {
  @Input() lead: Lead | null = null;
  @Output() fieldChange = new EventEmitter<{ lead: Lead; field: keyof Lead; value: Lead[keyof Lead] }>();
  @Output() checklistChange = new EventEmitter<{ lead: Lead; key: keyof LeadChecklist }>();
  @Output() noteAdd = new EventEmitter<{ lead: Lead; note: string }>();
  @Output() instagramSent = new EventEmitter<Lead>();
  @Output() copy = new EventEmitter<Lead>();
  @Output() convert = new EventEmitter<Lead>();

  readonly checklistItems = CHECKLIST_LABELS;
  draftNote = '';
  readonly messageForLead = messageForLead;
  readonly dateInputValue = dateInputValue;
  readonly dateToIso = dateToIso;
  readonly toNumber = toNumber;
  readonly normalizeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : `https://${value}`;
  readonly normalizeInstagram = (value: string) => /^https?:\/\//i.test(value) ? value : `https://www.instagram.com/${value.replace(/^@/, '')}`;

  checklistScore(lead: Lead): number {
    return this.checklistItems.filter((item) => !!lead.checklist?.[item.key]).length;
  }

  saveNote(lead: Lead): void {
    const note = this.draftNote.trim();
    if (!note) return;
    this.noteAdd.emit({ lead, note });
    this.draftNote = '';
  }
}
