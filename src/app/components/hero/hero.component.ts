import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LucideAngularModule, Palette, Code, Search, Settings, Sparkles, ArrowRight, Globe } from 'lucide-angular';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit {
  isLoaded = false;
  isBrowser: boolean;
  
  // Iconos
  paletteIcon = Palette;
  codeIcon = Code;
  searchIcon = Search;
  settingsIcon = Settings;
  sparklesIcon = Sparkles;
  arrowRightIcon = ArrowRight;
  globeIcon = Globe;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      // Trigger the animation after a short delay
      setTimeout(() => {
        this.isLoaded = true;
      }, 100);
    } else {
      // In SSR, just set isLoaded to true immediately
      this.isLoaded = true;
    }
  }
}
