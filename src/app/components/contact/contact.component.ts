import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, MessageCircle, Hash } from 'lucide-angular';
import { SiteSettingsService } from '../../core/services/site-settings.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
})
export class ContactComponent {
  readonly siteSettings = inject(SiteSettingsService);
  readonly whatsappUrl = this.siteSettings.whatsappUrl;
  readonly contact = this.siteSettings.contact;
  readonly socialNetworks = this.siteSettings.socialNetworks;
  messageIcon = MessageCircle;
  hashIcon = Hash;
}
