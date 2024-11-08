import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SidebarComponent {
  isSidebarOpen = false; // Manage sidebar visibility

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen; // Toggle sidebar open/close
  }

  closeSidebar() {
    this.isSidebarOpen = false; // Close sidebar
  }

  pageTitle: string = 'Admin Dashboard';  // Default title
  loading: boolean = false;  // Loading state

  constructor(private authService: AuthService, private router: Router) {
    // Listen for route changes to dynamically update page title
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updatePageTitle();
      }
    });
  }

  // Function to update page title based on route
  updatePageTitle() {
    const route = this.router.url;
    switch (route) {
      case '/admin-dashboard':
        this.pageTitle = 'Admin Dashboard';
        break;
      case '/admin-users':
        this.pageTitle = 'Manage Users';
        break;
      case '/admin-facilities':
        this.pageTitle = 'Manage Facilities';
        break;
      case '/admin-reservations':
        this.pageTitle = 'Reservations';
        break;
      case '/admin-notifications':
        this.pageTitle = 'Notifications';
        break;
      default:
        this.pageTitle = 'Admin Dashboard';  // Default fallback
        break;
    }
  }

  // Logout function with loading state and routing
  logout() {
    this.loading = true;  // Set loading to true to show loading state
    console.log('Logging out...');  // Optional: Add logging for debugging

    // Clear the token and role from local storage
    this.authService.logout();

    // Navigate to home page after logout
    this.router.navigate(['/']);

    // Optionally hide loading state after a delay
    setTimeout(() => {
      this.loading = false;  // Hide loading state after navigation
    }, 1000);  // Adjust the delay as needed
  }
}
