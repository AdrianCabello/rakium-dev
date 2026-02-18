import {
  Component,
  inject,
  signal,
  effect,
  ChangeDetectionStrategy,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SiteSettingsService } from '../../../core/services/site-settings.service';
import type { SiteSettings, SiteContact, SiteService, SocialNetwork } from '../../../core/config/site-settings.types';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { EditorModule } from 'primeng/editor';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';

const LUCIDE_ICONS = [
  'calendar-check',
  'home',
  'credit-card',
  'globe',
  'code',
  'palette',
  'server',
  'database',
  'rocket',
  'message-circle',
  'instagram',
  'linkedin',
  'twitter',
  'facebook',
  'youtube',
  'mail',
  'phone',
  'map-pin',
  'briefcase',
  'wrench',
  'settings',
  'sparkles',
  'layers',
  'share-2',
  'image',
  'file-text',
  'shopping-cart',
  'users',
  'bar-chart-3',
];

@Component({
  selector: 'app-admin-site-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TabViewModule,
    CardModule,
    EditorModule,
    ToastModule,
    DropdownModule,
  ],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-toast />
    <div class="site-settings-page">
      <h1 class="text-2xl font-semibold text-white mb-6">Configuración del sitio</h1>
      <p-tabView>
        <p-tabPanel header="Contacto">
          <div class="section-card">
            <h2 class="form-title">Datos de contacto</h2>
            <form (ngSubmit)="saveContact()" class="settings-form">
              <div class="form-row form-row--2">
                <div class="form-field">
                  <label>WhatsApp (número con código país)</label>
                  <input pInputText [(ngModel)]="contactForm.whatsappNumber" name="whatsapp" placeholder="542262497993" class="w-full" />
                </div>
                <div class="form-field">
                  <label>Mensaje por defecto (WhatsApp)</label>
                  <input pInputText [(ngModel)]="contactForm.whatsappMessage" name="whatsappMsg" placeholder="Mensaje al abrir WhatsApp" class="w-full" />
                </div>
              </div>
              <div class="form-row form-row--3">
                <div class="form-field">
                  <label>Email</label>
                  <input pInputText type="email" [(ngModel)]="contactForm.email" name="email" placeholder="contacto&#64;ejemplo.com" class="w-full" />
                </div>
                <div class="form-field">
                  <label>Teléfono</label>
                  <input pInputText [(ngModel)]="contactForm.phone" name="phone" placeholder="+54 11 ..." class="w-full" />
                </div>
                <div class="form-field">
                  <label>Dirección</label>
                  <input pInputText [(ngModel)]="contactForm.address" name="address" placeholder="Dirección" class="w-full" />
                </div>
              </div>
              <div class="form-actions">
                <p-button type="submit" label="Guardar contacto" icon="pi pi-check" [loading]="saving()" />
              </div>
            </form>
          </div>
        </p-tabPanel>
        <p-tabPanel header="Sobre mí">
          <div class="section-card">
            <h2 class="form-title">Sobre mí (About)</h2>
            <form (ngSubmit)="saveAbout()" class="settings-form">
              <div class="form-field">
                <label>Contenido (HTML permitido)</label>
                <p-editor [(ngModel)]="aboutForm" name="about" [style]="{ height: '300px' }" class="w-full" />
              </div>
              <div class="form-actions">
                <p-button type="submit" label="Guardar" icon="pi pi-check" [loading]="saving()" />
              </div>
            </form>
          </div>
        </p-tabPanel>
        <p-tabPanel header="Descripción">
          <div class="section-card">
            <h2 class="form-title">Descripción del sitio</h2>
            <p class="text-zinc-400 text-sm mb-4">Texto breve que aparece en el hero y en meta SEO</p>
            <form (ngSubmit)="saveDescription()" class="settings-form">
              <div class="form-field">
                <label>Descripción</label>
                <textarea pInputText [(ngModel)]="descriptionForm" name="description" rows="4" class="w-full" placeholder="Creamos sitios web y aplicaciones..."></textarea>
              </div>
              <div class="form-actions">
                <p-button type="submit" label="Guardar" icon="pi pi-check" [loading]="saving()" />
              </div>
            </form>
          </div>
        </p-tabPanel>
        <p-tabPanel header="Servicios">
          <div class="section-card">
            <h2 class="form-title">Servicios</h2>
            <p class="text-zinc-400 text-sm mb-4">Agregar, editar o eliminar servicios. Elegí el icono de cada uno.</p>
            <div class="space-y-4">
              @for (s of servicesForm; track s.id; let i = $index) {
                <div class="service-item border border-zinc-700 rounded-lg p-4">
                  <div class="flex justify-between items-start gap-4 mb-3">
                    <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div class="form-field">
                        <label>Título</label>
                        <input pInputText [(ngModel)]="s.title" [name]="'title_' + s.id" class="w-full" />
                      </div>
                      <div class="form-field">
                        <label>Subtítulo</label>
                        <input pInputText [(ngModel)]="s.subtitle" [name]="'subtitle_' + s.id" class="w-full" />
                      </div>
                      <div class="form-field md:col-span-2">
                        <label>Descripción</label>
                        <textarea pInputText [(ngModel)]="s.description" [name]="'desc_' + s.id" rows="2" class="w-full"></textarea>
                      </div>
                      <div class="form-field">
                        <label>Icono (Lucide)</label>
                        <p-dropdown
                          [options]="iconOptions"
                          [(ngModel)]="s.icon"
                          [name]="'icon_' + s.id"
                          optionLabel="label"
                          optionValue="value"
                          placeholder="Seleccionar icono"
                          styleClass="w-full"
                        />
                      </div>
                      <div class="form-field flex gap-2">
                        <button type="button" pButton icon="pi pi-arrow-up" (click)="moveService(i, -1)" [disabled]="i === 0" class="p-button-text"></button>
                        <button type="button" pButton icon="pi pi-arrow-down" (click)="moveService(i, 1)" [disabled]="i === servicesForm.length - 1" class="p-button-text"></button>
                      </div>
                    </div>
                    <button type="button" pButton icon="pi pi-trash" severity="danger" (click)="removeService(i)" class="p-button-text"></button>
                  </div>
                </div>
              }
              <p-button label="Agregar servicio" icon="pi pi-plus" (onClick)="addService()" />
            </div>
            <div class="form-actions mt-6">
              <p-button label="Guardar servicios" icon="pi pi-check" (onClick)="saveServices()" [loading]="saving()" />
            </div>
          </div>
        </p-tabPanel>
        <p-tabPanel header="Redes sociales">
          <div class="section-card">
            <h2 class="form-title">Redes sociales</h2>
            <div class="space-y-4">
              @for (r of socialForm; track r.id; let i = $index) {
                <div class="flex gap-3 items-end">
                  <div class="form-field flex-1">
                    <label>Nombre</label>
                    <input pInputText [(ngModel)]="r.name" [name]="'sname_' + r.id" placeholder="Instagram" class="w-full" />
                  </div>
                  <div class="form-field flex-1">
                    <label>URL</label>
                    <input pInputText [(ngModel)]="r.url" [name]="'surl_' + r.id" placeholder="https://instagram.com/..." class="w-full" />
                  </div>
                  <div class="form-field" style="min-width: 140px;">
                    <label>Icono</label>
                    <p-dropdown [options]="iconOptions" [(ngModel)]="r.icon" [name]="'sicon_' + r.id" optionLabel="label" optionValue="value" styleClass="w-full" />
                  </div>
                  <button type="button" pButton icon="pi pi-trash" severity="danger" (click)="removeSocial(i)" class="p-button-text"></button>
                </div>
              }
              <p-button label="Agregar red" icon="pi pi-plus" (onClick)="addSocial()" />
            </div>
            <div class="form-actions mt-6">
              <p-button label="Guardar redes" icon="pi pi-check" (onClick)="saveSocialNetworks()" [loading]="saving()" />
            </div>
          </div>
        </p-tabPanel>
      </p-tabView>
    </div>
  `,
  styles: [`
    .site-settings-page { max-width: 48rem; }
    .section-card {
      background: rgb(39 39 42);
      border-radius: 8px;
      padding: 1.5rem;
      border: 1px solid rgb(63 63 70);
    }
    .form-title { margin: 0 0 1rem 0; font-size: 1rem; font-weight: 600; color: #fff; }
    .settings-form { display: flex; flex-direction: column; gap: 1rem; }
    .form-row { display: grid; gap: 0.75rem; }
    .form-row--2 { grid-template-columns: 1fr 1fr; }
    .form-row--3 { grid-template-columns: 1fr 1fr 1fr; }
    @media (max-width: 768px) { .form-row--2, .form-row--3 { grid-template-columns: 1fr; } }
    .form-field { display: flex; flex-direction: column; gap: 0.25rem; }
    .form-field label { font-size: 0.75rem; color: #A0A0A0; }
    .form-actions { display: flex; justify-content: flex-end; padding-top: 0.5rem; }
    :host ::ng-deep .w-full { width: 100%; }
  `],
})
export class AdminSiteSettingsComponent {
  private readonly siteSettings = inject(SiteSettingsService);
  private readonly message = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly saving = signal(false);
  contactForm: SiteContact = { whatsappNumber: '', whatsappMessage: '', email: '', phone: '', address: '' };
  aboutForm = '';
  descriptionForm = '';
  servicesForm: SiteService[] = [];
  socialForm: SocialNetwork[] = [];
  readonly iconOptions = LUCIDE_ICONS.map((v) => ({ label: v, value: v }));

  constructor() {
    effect(() => {
      const s = this.siteSettings.settings();
      this.contactForm = { ...s.contact };
      this.aboutForm = s.about;
      this.descriptionForm = s.description;
      this.servicesForm = s.services.map((x) => ({ ...x }));
      this.socialForm = s.socialNetworks.map((x) => ({ ...x }));
    });
  }

  saveContact(): void {
    this.saving.set(true);
    this.siteSettings.save({ contact: this.contactForm });
    this.saving.set(false);
    this.message.add({ severity: 'success', summary: 'Contacto guardado' });
  }

  saveAbout(): void {
    this.saving.set(true);
    this.siteSettings.save({ about: this.aboutForm });
    this.saving.set(false);
    this.message.add({ severity: 'success', summary: 'Sobre mí guardado' });
  }

  saveDescription(): void {
    this.saving.set(true);
    this.siteSettings.save({ description: this.descriptionForm });
    this.saving.set(false);
    this.message.add({ severity: 'success', summary: 'Descripción guardada' });
  }

  addService(): void {
    const id = crypto.randomUUID();
    const maxOrder = Math.max(0, ...this.servicesForm.map((s) => s.order));
    this.servicesForm.push({
      id,
      title: '',
      subtitle: '',
      icon: 'rocket',
      description: '',
      precioEstatico: '',
      precioAutogestionable: '',
      idealFor: [],
      incluye: [],
      order: maxOrder + 1,
    });
  }

  removeService(index: number): void {
    this.servicesForm.splice(index, 1);
  }

  moveService(index: number, delta: number): void {
    const target = index + delta;
    if (target < 0 || target >= this.servicesForm.length) return;
    [this.servicesForm[index], this.servicesForm[target]] = [this.servicesForm[target], this.servicesForm[index]];
  }

  saveServices(): void {
    this.saving.set(true);
    const ordered = this.servicesForm.map((s, i) => ({ ...s, order: i }));
    this.siteSettings.save({ services: ordered });
    this.saving.set(false);
    this.message.add({ severity: 'success', summary: 'Servicios guardados' });
  }

  addSocial(): void {
    this.socialForm.push({
      id: crypto.randomUUID(),
      name: '',
      url: '',
      icon: 'share-2',
    });
  }

  removeSocial(index: number): void {
    this.socialForm.splice(index, 1);
  }

  saveSocialNetworks(): void {
    this.saving.set(true);
    this.siteSettings.save({ socialNetworks: this.socialForm });
    this.saving.set(false);
    this.message.add({ severity: 'success', summary: 'Redes guardadas' });
  }
}
