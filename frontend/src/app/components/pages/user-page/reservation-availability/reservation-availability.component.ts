import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarComponent } from '../calendar/calendar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-reservation-availability',
  standalone: true,
  imports: [CalendarComponent, HeaderComponent],
  templateUrl: './reservation-availability.component.html',
  styleUrls: ['./reservation-availability.component.css']
})
export class ReservationAvailabilityComponent implements OnInit {
  facilityId: string | null = null; // FacilityId to be passed to CalendarComponent

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Capture the facilityId from the route parameters
    this.facilityId = this.route.snapshot.paramMap.get('facilityId'); // Ensure this matches your route configuration
}
}
