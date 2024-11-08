import { Component, Input, OnInit, HostListener } from '@angular/core';
import { ReservationService } from '../../../../services/reservation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-reservation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-reservation.component.html',
  styleUrls: ['./user-reservation.component.css']
})
export class UserReservationComponent implements OnInit {
  @Input() userId: string = ''; 
  @Input() close: () => void = () => {}; // Use this to call the parent's close modal function
  reservations: any[] = [];
  displayedReservations: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    if (this.userId) {
      this.fetchReservations();
    }
  }

  fetchReservations(): void {
    this.reservationService.getReservationsByUserId(this.userId).subscribe(
      (data) => {
        this.reservations = data;
        this.totalPages = Math.ceil(this.reservations.length / this.itemsPerPage);
        this.updateDisplayedReservations();
      },
      (error) => {
        console.error('Error fetching reservations:', error);
      }
    );
  }

  updateDisplayedReservations(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedReservations = this.reservations.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedReservations();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedReservations();
    }
  }

  // Close modal if user clicks outside of it
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-overlay')) {
      this.closeModal();
    }
  }

  closeModal(): void {
    this.close(); // Call the parent component's close method to hide the modal
  }
}
