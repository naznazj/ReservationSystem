import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ReservationService } from '../../../../services/reservation.service';
import { AvailableDate, TimeSlot, Reservation } from '../../../../models/reservation.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { SuccessModalComponent } from '../shared/success-modal/success-modal.component';
import { ErrorModalComponent } from '../shared/error-modal/error-modal.component';


@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, SuccessModalComponent, ErrorModalComponent],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  @Input() facilityId: string | null = null;
  view: 'month' | 'week' | 'day' = 'month';
  currentDate = new Date();
  currentPeriod: string = '';
  monthDays: number[] = [];
  availableReservations: AvailableDate[] = [];
  selectedDay: number | null = null;
  availableTimeSlots: TimeSlot[] = [];
  isModalOpen: boolean = false;
  isReservationModalOpen: boolean = false;
  isMonthModalOpen: boolean = false;
  isYearModalOpen: boolean = false;
  isSuccessModalOpen: boolean = false;
  successMessage: string = 'Reservation created successfully!';
  errorMessage: string | null = null;

  // New properties
  currentUser: any; // Adjust type as per your user model
  selectedFacilityName: string = '';
  selectedFacilityPrice: number = 0;

  reservationData: Reservation = {
    userId: '',
    fullName: '',
    facilityId: this.facilityId || '',
    address: '',
    contactNumber: '',
    reservationDate: new Date(),
    startTime: '',
    endTime: '',
    purpose: '',
    price: 0,
  };

  availableMonths: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  availableYears: number[] = [];
  selectedStartTime: string | null = null;
  selectedEndTime: string | null = null;

  @ViewChild(SuccessModalComponent) successModal!: SuccessModalComponent;
  @ViewChild(ErrorModalComponent) errorModal!: ErrorModalComponent;

  constructor(private reservationService: ReservationService, private authService: AuthService) { }

  ngOnInit() {
    console.log('Facility ID:', this.facilityId);
    this.loadAvailableYears();
    this.updateMonth();
    this.currentUser = this.authService.getCurrentUser();

    console.log('Current User:', this.currentUser)

    if (this.facilityId) {
      this.loadAvailableReservations(this.facilityId);
      this.loadFacilityDetails(this.facilityId);
    } else {
      console.error('Facility ID is missing. Cannot load reservations.');
    }
  }

  loadAvailableYears() {
    const currentYear = new Date().getFullYear();
    this.availableYears = Array.from({ length: 5 }, (_, i) => currentYear + i);
  }
  closeSuccessModal() {
    this.isSuccessModalOpen = false; // Close the success modal
    this.resetModal(); // Optionally reset the reservation modal if it's open
  }
  // Method to handle day selection
  selectDay(day: number) {
    this.selectedDay = day; // Set the selected day based on the user's click
    this.updateReservationDate(); // Update the reservation date
  }

  // Update reservation date based on selected day
  updateReservationDate() {
    if (this.selectedDay !== null) {
      // Set the reservation date
      this.reservationData.reservationDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        this.selectedDay
      );

      // Log the constructed reservation date for verification
      console.log('Reservation Date set to:', this.reservationData.reservationDate);
    }
  }

  // Example click handler for calendar days
  onDayClick(day: number) {
    console.log('Day clicked:', day); // Log the clicked day
    this.selectDay(day); // Call selectDay when a day is clicked
  }

  loadAvailableReservations(facilityId: string) {
    this.reservationService.getAvailableReservations(facilityId).subscribe(
      (reservations) => {
        this.availableReservations = reservations;
        console.log('Available Reservations:', this.availableReservations);
        this.updateMonth();
      },
      (error) => {
        console.error('Error fetching available reservations:', error);
      }
    );
  }

  loadFacilityDetails(facilityId: string) {
    this.reservationService.getFacilityDetails(facilityId).subscribe(
      (facility) => {
        this.selectedFacilityName = facility.name;
        this.selectedFacilityPrice = facility.price;
        this.reservationData.price = this.selectedFacilityPrice;
        this.reservationData.fullName = this.currentUser.fullName;
      },
      (error) => {
        console.error('Error fetching facility details:', error);
      }
    );
  }


  updateMonth() {
    this.currentPeriod = this.currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' });

    const firstDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getDay();
    const lastDateOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).getDate();

    const leadingEmptyDays = Array(firstDayOfMonth).fill(null);
    const daysInMonth = Array.from({ length: lastDateOfMonth }, (_, i) => i + 1);

    this.monthDays = leadingEmptyDays.concat(daysInMonth);
  }

  selectTimeSlot(slot: TimeSlot) {
    if (!this.selectedStartTime) {
      this.selectedStartTime = slot.start; // Use the start property of TimeSlot
      console.log('Selected Start Time:', this.selectedStartTime);
    } else if (!this.selectedEndTime) {
      this.selectedEndTime = slot.end; // Use the end property of TimeSlot
      console.log('Selected End Time:', this.selectedEndTime);
      this.isReservationModalOpen = true; // Open modal
    } else {
      console.log('Resetting time selection.');
      this.selectedStartTime = slot.start; // Reset to the new selected start time
      this.selectedEndTime = null; // Clear the end time
      console.log('Selected Start Time:', this.selectedStartTime);
    }
  }



  createReservation() {
    // Check for required fields
    if (!this.facilityId) {
      console.error('Facility ID is required to create a reservation.');
      return;
    }

    if (!this.selectedStartTime || !this.selectedEndTime) {
      console.error('Start time and end time are required to create a reservation.');
      return;
    }

    // Set up reservation data
    this.reservationData.facilityId = this.facilityId;
    this.reservationData.userId = this.currentUser.id; // Ensure this is set to the user's ID
    this.reservationData.reservationDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.selectedDay!);

    // Set full name or email if the name is not available
    this.reservationData.fullName = this.currentUser.fullName || this.currentUser.email;

    // Add startTime and endTime to reservationData
    this.reservationData.startTime = this.selectedStartTime;
    this.reservationData.endTime = this.selectedEndTime;

    // Create the reservation
    this.reservationService.createReservation(this.reservationData).subscribe(
      (reservation) => {
        console.log('Reservation created:', reservation);
        this.loadAvailableReservations(this.facilityId!); // Refresh available reservations
        this.displaySuccess('Reservation created successfully!'); // Open the success modal

        // Reset the modal after a brief delay to allow the user to see the success message
        setTimeout(() => {
          this.resetModal(); // Reset modal after successful reservation creation
        }, 2000); // Adjust the delay as necessary
        this.errorMessage = null;
      },
      (error) => {
        console.error('Error creating reservation:', error);
        this.displayError('Time Conflict');
        // Optionally add a user-friendly message to display in the UI
      }
    );
  }
  displayError(message: string) {
    this.errorModal.openModal(message); // Open the modal with the error message
  }
  displaySuccess(message: string) {
    this.successModal.openModal(message); // Open the modal with the success message
  }

  resetModal() {
    this.isModalOpen = false; // Close the modal
    this.isReservationModalOpen = false; // Close reservation modal
    this.selectedStartTime = null; // Clear selected start time
    this.selectedEndTime = null; // Clear selected end time

    // Reset reservation data structure
    this.reservationData = {
      userId: this.currentUser.id,
      fullName: this.currentUser.fullName || this.currentUser.email,
      facilityId: this.facilityId || '',
      address: '',
      contactNumber: '',
      reservationDate: new Date(),
      startTime: '',
      endTime: '',
      purpose: '',
      price: 0,
    };
  }



  generateTimeSlots(startTime: string, endTime: string, interval: number = 60): string[] {
    const slots: string[] = [];
    let current = this.convertTimeToDate(startTime);
    const end = this.convertTimeToDate(endTime);

    while (current < end) {
      const next = new Date(current.getTime());
      next.setHours(current.getHours() + 1);
      slots.push(`${this.formatDateToTime(current)} - ${this.formatDateToTime(next)}`);
      current = next;
    }

    return slots;
  }

  convertTimeToDate(time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  formatDateToTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  isTimeSlotReserved(slot: string, reservedSlots: TimeSlot[]): boolean {
    const [slotStart, slotEnd] = slot.split(' - ').map(t => t.trim());

    return reservedSlots.some(reservedSlot => {
      const reservedStart = reservedSlot.start;
      const reservedEnd = reservedSlot.end;

      return (slotStart < reservedEnd && slotEnd > reservedStart);
    });
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openMonthModal() {
    this.isMonthModalOpen = true;
  }

  closeMonthModal() {
    this.isMonthModalOpen = false;
  }

  openYearModal() {
    this.isYearModalOpen = true;
  }

  closeYearModal() {
    this.isYearModalOpen = false;
  }

  selectYear(year: number) {
    this.currentDate.setFullYear(year);
    this.isYearModalOpen = false;
    this.loadAvailableReservations(this.facilityId!);
  }

  selectMonth(month: number) {
    const selectedDate = new Date(this.currentDate.getFullYear(), month);

    if (selectedDate < new Date()) {
      console.warn('Cannot select a past month.');
      return;
    }

    this.currentDate.setMonth(month);
    this.loadAvailableReservations(this.facilityId!);
    this.isMonthModalOpen = false;
  }

  // Add methods for handling different views (week, day) if needed


  nextMonth() {
    const nextDate = new Date(this.currentDate);
    nextDate.setMonth(this.currentDate.getMonth() + 1);

    if (nextDate < new Date()) {
      console.warn('Cannot navigate to a past month.');
      return;
    }

    this.currentDate = nextDate;
    this.loadAvailableReservations(this.facilityId!);
    this.updateMonth();
  }

  previousMonth() {
    const previousDate = new Date(this.currentDate);
    previousDate.setMonth(this.currentDate.getMonth() - 1);

    this.currentDate = previousDate;
    this.loadAvailableReservations(this.facilityId!);
    this.updateMonth();
  }

  isFullyUnavailable(day: string): boolean {
    const reservation = this.availableReservations.find(res => res.day === day);
    if (!day) return false;
    return reservation ? reservation.slots.length === this.generateTimeSlots("08:00", "18:00").length : false;
  }
  isPartiallyReserved(day: string): boolean {
    const reservation = this.availableReservations.find(res => res.day === day);
    return reservation ? reservation.slots.length > 0 && reservation.slots.length < this.generateTimeSlots("08:00", "18:00").length : false;
  }


  handleDayClick(day: number) {
    if (this.isPastDay(day)) {
      return; // Prevent clicking on past days
    }

    const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

    // Allow modal opening for available, fully reserved, or partially reserved days
    if (this.isAvailable(day) || this.isFullyUnavailable(dayName) || this.isPartiallyReserved(dayName)) {
      this.openModal(day); // Open modal when the day is clicked

    }
    this.selectDay(day);
  }



  openModal(day: number) {
    this.selectedDay = day; // Set the currently selected day
    this.isModalOpen = true;

    console.log('Facility ID:', this.facilityId); // Debug log

    if (this.facilityId) {
        const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);

        // Convert date to ISO format (YYYY-MM-DD)
        const formattedDate = date.toISOString().split('T')[0];

        // Clear previous time slots every time the modal is opened
        this.availableTimeSlots = [];

        // Fetch available reservations for the selected day
        this.reservationService.getAvailableReservations(this.facilityId).subscribe(
            (availableDates) => {
                const reservation = availableDates.find(res => res.day === formattedDate);

                // Create all available time slots for the day based on facility availability
                const allAvailableSlots = this.getAllAvailableTimeSlots();

                if (reservation) {
                    const reservedSlots: TimeSlot[] = reservation.slots;

                    // Filter out the reserved slots from the available slots
                    this.availableTimeSlots = allAvailableSlots.filter(slot => {
                        return !reservedSlots.some(reserved => this.isOverlapping(slot, reserved));
                    });
                } else {
                    console.log('No reservations available for this day.');
                    this.availableTimeSlots = allAvailableSlots;
                }

                console.log('Available Time Slots:', this.availableTimeSlots);
            },
            (error) => {
                console.error('Error fetching available time slots:', error);
                this.isModalOpen = false; // Close the modal if there was an error
            }
        );
    } else {
        console.error('Facility ID is required to open the modal.');
    }
}

// Function to get all available time slots for the facility
private getAllAvailableTimeSlots(): TimeSlot[] {
    // Example: Assume the facility is available from 09:00 to 17:00
    const timeRange = { startTime: '09:00', endTime: '17:00' };
    return this.generateHourlySlots(timeRange.startTime, timeRange.endTime);
}

// Function to generate hourly slots
private generateHourlySlots(start: string, end: string): TimeSlot[] {
    const startTime = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);
    const slots: TimeSlot[] = [];

    for (let time = startTime; time < endTime; time.setHours(time.getHours() + 1)) {
        const nextHour = new Date(time);
        nextHour.setHours(nextHour.getHours() + 1);
        slots.push({
            start: time.toTimeString().slice(0, 5), // Format: "HH:mm"
            end: nextHour.toTimeString().slice(0, 5) // Format: "HH:mm"
        });
    }

    return slots;
}

// Function to check if two time slots overlap
private isOverlapping(slot1: TimeSlot, slot2: TimeSlot): boolean {
    const start1 = new Date(`1970-01-01T${slot1.start}:00`);
    const end1 = new Date(`1970-01-01T${slot1.end}:00`);
    const start2 = new Date(`1970-01-01T${slot2.start}:00`);
    const end2 = new Date(`1970-01-01T${slot2.end}:00`);

    return start1 < end2 && end1 > start2;
}


  // generateHourlySlots(startTime: string, endTime: string): string[] {
  //   const slots: string[] = [];

  //   let currentTime = this.convertToDate(startTime);
  //   const endDateTime = this.convertToDate(endTime);

  //   while (currentTime < endDateTime) {
  //       const nextTime = new Date(currentTime.getTime() + 60 * 60 * 1000); // Add 1 hour
  //       if (nextTime > endDateTime) {
  //           break;
  //       }
  //       slots.push(`${this.formatTime(currentTime)} - ${this.formatTime(nextTime)}`);
  //       currentTime = nextTime;
  //   }

  //   return slots;
  // }


  convertToDate(time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }


  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }


  isAvailable(day: number): boolean {
    const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

    // Check if the dayName exists in the availableReservations array
    return this.availableReservations.some(reservation => reservation.day === dayName);
  }


  isUnavailable(day: number): boolean {
    return this.isFullyUnavailable(this.getDayName(day));
  }

  getDayName(day: number): string {
    return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day)
      .toLocaleDateString('en-US', { weekday: 'long' });
  }

  formatDay(day: number): string {
    return day.toString().padStart(2, '0');
  }
  isPastDay(day: number): boolean {
    const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
    const today = new Date();

    // Check if the selected date is before today (ignoring the time)
    return date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }

}
