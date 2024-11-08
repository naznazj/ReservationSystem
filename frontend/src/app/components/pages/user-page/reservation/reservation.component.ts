import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { ReservationService } from '../../../../services/reservation.service';
import { HeaderComponent } from '../header/header.component';
import { UserReservationComponent } from '../user-reservation/user-reservation.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, HeaderComponent, UserReservationComponent],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  userId: string = ''; // User ID to be set from AuthService
  showModal: boolean = false; // Control the modal visibility

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser(); // Assuming your AuthService provides this
    this.userId = currentUser ? currentUser.id : '';
  }

  viewUserReservations(): void {
    this.showModal = true; // Show the modal when the button is clicked
  }

  closeModal(): void {
    this.showModal = false; // Close the modal
  }

  // Close modal when user clicks outside of it
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.showModal && target.classList.contains('modal-overlay')) {
      this.closeModal();
    }
  }
}
