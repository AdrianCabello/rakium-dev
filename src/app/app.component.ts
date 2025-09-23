import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SeoService } from './core/services/seo.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'rakium-dev';

  constructor(private seoService: SeoService) { }

  ngOnInit() {
    // Configurar metadatos para la página principal
    this.seoService.updateMetadata({
      title: 'Inicio',
      description: 'Creamos sitios web y aplicaciones que destacan tu marca, conectan con tu audiencia y potencian tu presencia digital.',
      url: 'https://adriancabello.github.io/rakium-dev/'
    });
  }
}
