import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Instagram, Linkedin, Mail, Phone, MapPin, Github, Twitter } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  imports: [CommonModule, LucideAngularModule]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  // Social media links
  socialLinks = [
    { name: 'Instagram', url: 'https://instagram.com/rakium', icon: Instagram },
    { name: 'LinkedIn', url: 'https://linkedin.com/company/rakium', icon: Linkedin },
    { name: 'GitHub', url: 'https://github.com/rakium', icon: Github },
    { name: 'Twitter', url: 'https://twitter.com/rakium', icon: Twitter }
  ];

  // Icons
  mailIcon = Mail;
  phoneIcon = Phone;
  locationIcon = MapPin;

  // Services
  services = [
    { name: 'Desarrollo Web', description: 'Sitios web modernos y responsivos' },
    { name: 'Aplicaciones Móviles', description: 'iOS y Android nativas' },
    { name: 'E-commerce', description: 'Tiendas online personalizadas' },
    { name: 'Consultoría Digital', description: 'Estrategias de transformación digital' }
  ];

  // Contact info
  contactInfo = {
    address: 'Mar del Plata, Buenos Aires, Argentina',
    phone: '+54 9 2262 497993',
    email: 'contacto@rakium.com'
  };
}
