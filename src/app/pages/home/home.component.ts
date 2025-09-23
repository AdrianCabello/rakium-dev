import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { ServicesComponent } from '../../components/services/services.component';
import { ContactComponent } from '../../components/contact/contact.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, HeroComponent, ServicesComponent, ContactComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 transition-colors duration-300 font-sans antialiased">
      <app-header></app-header>
      <main class="flex-1 w-full">
        <app-hero></app-hero>
        <app-services></app-services>
        <app-contact></app-contact>
      </main>
    </div>
  `
})
export class HomeComponent {
}
