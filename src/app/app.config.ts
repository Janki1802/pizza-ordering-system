import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';  // Optional if using HTTP service
import { routes } from './app.routes';  // Your application's routes
import { PizzaService } from './services/pizza.service';  // PizzaService
import { CommonModule } from '@angular/common';  // Angular's CommonModule for common directives
import { FormsModule } from '@angular/forms';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    PizzaService,
    CommonModule,
    FormsModule
  ]
};
