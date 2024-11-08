import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router'; // Keep the RouterOutlet for routing
import { AuthService } from './services/auth.service'; // Import AuthService
import { HomeComponent } from './components/pages/user-page/home/home.component';
import { AdminDashboardComponent } from './components/pages/admin-page/admin-dashboard/admin-dashboard.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent,AdminDashboardComponent, CommonModule], // No need to import HomeComponent and AdminDashboardComponent directly
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'frontend';
}