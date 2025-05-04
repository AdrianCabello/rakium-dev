import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

if (process.env['NODE_ENV'] === 'production') {
  enableProdMode();
}

export const AppServerModule = bootstrapApplication(AppComponent, appConfig).catch(
  (err) => console.error(err)
);
