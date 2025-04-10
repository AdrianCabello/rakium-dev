import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Sparkles, ArrowRight, Code, Globe } from 'lucide-angular';

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
  
  // Define the icons for use in the template
  sparklesIcon = Sparkles;
  arrowRightIcon = ArrowRight;
  codeIcon = Code;
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
