import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Instagram, Linkedin, MessageCircle, Hash } from 'lucide-angular';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  standalone: true,
  imports: [CommonModule, LucideAngularModule]
})
export class ContactComponent {
  // WhatsApp number should be configured here
  whatsappNumber = '542262497993';
  whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=Hola!%20Quería%20asesoramiento%20para%20crear%20un%20proyecto%20digital%20con%20Rakium.`;

  // Social media links
  instagramUrl = 'https://instagram.com/rakium'; // Replace with your Instagram
  linkedinUrl = 'https://linkedin.com/company/rakium'; // Replace with your LinkedIn

  // Icons
  instagramIcon = Instagram;
  linkedinIcon = Linkedin;
  messageIcon = MessageCircle;
  hashIcon = Hash;
}
