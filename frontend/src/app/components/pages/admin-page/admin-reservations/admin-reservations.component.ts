import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../../../services/reservation.service';
import { Reservation } from '../../../../models/reservation.model';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../user-page/shared/loading/loading.component';
import { ErrorModalComponent } from '../../user-page/shared/error-modal/error-modal.component';
import { SidebarComponent } from '../side-bar/side-bar.component';

@Component({
  selector: 'app-admin-reservations',
  standalone: true,
  imports: [CommonModule, LoadingComponent, ErrorModalComponent, SidebarComponent],
  templateUrl: './admin-reservations.component.html',
  styleUrls: ['./admin-reservations.component.css']
})
export class AdminReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  paginatedReservations: Reservation[] = []; // Array to hold paginated results
  loading = true;
  error: string | null = null;
  currentPage = 1;
  usersPerPage = 8; // Number of items to display per page
  totalReservations = 0; // Total number of reservations

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.fetchAdminReservations();
  }

  fetchAdminReservations(): void {
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.reservations = data;
        this.totalReservations = data.length; // Store the total number of reservations
        this.paginateReservations(); // Initialize paginated reservations for the first page
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load reservations';
        console.error(err);
        this.loading = false;
      }
    });
  }

  paginateReservations(): void {
    const startIndex = (this.currentPage - 1) * this.usersPerPage;
    this.paginatedReservations = this.reservations.slice(startIndex, startIndex + this.usersPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.paginateReservations(); // Recalculate paginated reservations when the page changes
  }

  get totalPages(): number {
    return Math.ceil(this.totalReservations / this.usersPerPage);
  }
}
