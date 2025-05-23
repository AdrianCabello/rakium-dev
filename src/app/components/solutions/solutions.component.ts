import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Search, Settings, Rocket } from 'lucide-angular';

@Component({
  selector: 'app-solutions',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './solutions.component.html',
})
export class SolutionsComponent {
  searchIcon = Search;
  settingsIcon = Settings;
  rocketIcon = Rocket;
}
