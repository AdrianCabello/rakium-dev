import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LucideAngularModule, Palette, Share2, Image } from 'lucide-angular';
import { faCheck, faCalendarCheck, faHome, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { services, hostingServices, extras } from '../../core/config/services.config';
import { SiteSettingsService } from '../../core/services/site-settings.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, LucideAngularModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  readonly siteSettings = inject(SiteSettingsService);
  readonly configurableServices = this.siteSettings.services;
  services = services;
  hostingServices = hostingServices;
  extras = extras;

  // Define icons for use in template
  faCheck = faCheck;
  faWhatsapp = faWhatsapp;
  faCalendarCheck = faCalendarCheck;
  faHome = faHome;
  faCreditCard = faCreditCard;

  // Iconos para Servicios de Diseño
  paletteIcon = Palette;
  share2Icon = Share2;
  imageIcon = Image;
}
