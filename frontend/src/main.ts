import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component'; // Adjust the path as necessary
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes'; // Import your routes
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Include HttpClient

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes), // Register your routes here
    provideHttpClient(), provideAnimationsAsync(),       // Register HttpClient
  ],
})
  .catch((err) => console.error(err));
