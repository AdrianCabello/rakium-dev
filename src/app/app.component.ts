import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoogleAnalyticsService } from './core/services/google-analytics.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(analytics: GoogleAnalyticsService) {
    // Inicializa el tracking de rutas al cargar la app
  }
}
