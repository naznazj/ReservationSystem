import { Component, NgModule, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../../services/auth.service'; // Adjust the path as necessary
import { Router, RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ErrorModalComponent } from '../shared/error-modal/error-modal.component';
import { LoadingComponent } from '../shared/loading/loading.component';

@Component({
  selector: 'app-header',
  standalone: true, // Indicating that this is a standalone component
  imports: [RouterLink,RouterModule, FormsModule, CommonModule, ErrorModalComponent, LoadingComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {

  email: string = '';
  password: string = '';
  regEmail: string = '';
  regPassword: string = '';
  username: string = '';
  showLoginModal: boolean = false;
  showRegisterModal: boolean = false;
  loading: boolean = false;
  mobileMenuOpen: boolean = false; // Controls mobile menu visibility
  mobileMenuDelay: boolean = false; // For managing delay in mobile menu

  @ViewChild(ErrorModalComponent) errorModal!: ErrorModalComponent; // Reference to the error modal component

  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {

  } // Inject ChangeDetectorRef

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  

  toggleLoginModal() {
    // Toggle modal visibility immediately
    this.showLoginModal = !this.showLoginModal; 
  }
  
  toggleRegisterModal() {
    // Toggle modal visibility immediately
    this.showRegisterModal = !this.showRegisterModal; 
  }

  toggleMobileMenu() {
    this.mobileMenuDelay = true; // Start delay for mobile menu
    setTimeout(() => {
      this.mobileMenuOpen = !this.mobileMenuOpen; // Toggle mobile menu after delay
      this.mobileMenuDelay = false; // Reset delay state
    }, 500); // Adjust the delay (in milliseconds) as needed
  }

  displayError(message: string) {
    this.errorModal.openModal(message); // Open the modal with the error message
  }

  onLogin() {
    this.loading = true; // Show loader
    if (!this.email || !this.password) {
      this.displayError('Please enter both email and password.');
      this.loading = false; // Hide loader
      return;
    }
  
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        this.authService.storeToken(response.token, response.role);
        this.loading = false; // Hide loader
  
        // Navigate based on the user's role immediately after storing the token
        if (response.role === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/']);
        }
        this.showLoginModal = false; // Close the modal
      },
      (error) => {
        console.error('Login failed:', error);
        this.displayError('Login failed. Please check your credentials.');
        this.loading = false; // Hide loader
      }
    );
  }

  // Add additional properties for the new fields
firstName: string = '';
lastName: string = '';
birthday: string = '';
contactNumber: string = '';
address: string = '';

onRegister() {
    this.loading = true; // Show loader

    // Ensure all required fields are filled
    if (!this.username || !this.regEmail || !this.regPassword || !this.firstName || !this.lastName || !this.birthday || !this.contactNumber || !this.address) {
      this.displayError('Please fill all registration fields.');
      this.loading = false; // Hide loader
      return;
    }

    // Create the user object to match the expected format in the backend
    const newUser = {
      email: this.regEmail,
      password: this.regPassword,
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      birthday: this.birthday,
      contactNumber: this.contactNumber,
      address: this.address
    };

    // Call the register function and subscribe to the response
    this.authService.register(newUser).subscribe(
      (response) => {
        // Store the token and role
        this.authService.storeToken(response.token, response.role);
        this.loading = false; // Hide loader

        // Use setTimeout to ensure the navigation happens after token storage
        setTimeout(() => {
          if (response.role === 'admin') {
            this.router.navigate(['/admin-dashboard']);
          } else {
            this.router.navigate(['/']);
          }
          this.cdr.detectChanges(); // Manually trigger change detection
        }, 0); // Short timeout to ensure changes are detected

        this.showRegisterModal = false; // Close the modal
      },
      (error) => {
        console.error('Registration failed:', error);
        this.displayError('Registration failed. Please try again.');
        this.loading = false; // Hide loader
      }
    );
}



  logout() {
    this.authService.logout(); // Ensure logout method is implemented
    this.router.navigate(['/']); // Redirect to home after logout
    this.mobileMenuOpen = false; // Close the mobile menu on logout
  }
}
