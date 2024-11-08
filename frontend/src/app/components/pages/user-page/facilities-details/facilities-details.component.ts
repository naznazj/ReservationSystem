import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacilityService } from '../../../../services/facility.service';
import { Facility } from '../../../../models/facility.model';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-facilities-details',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './facilities-details.component.html',
  styleUrls: ['./facilities-details.component.css']
})
export class FacilitiesDetailsComponent implements OnInit {
  facility?: Facility;

  constructor(
    private route: ActivatedRoute,
    private facilityService: FacilityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const facilityId = this.route.snapshot.paramMap.get('id');
    if (facilityId) {
      this.getFacilityDetails(facilityId);
    }
  }

  private getFacilityDetails(id: string): void {
    this.facilityService.getFacilityById(id).subscribe(
      (data: Facility) => {
        this.facility = data;
      },
      (error) => {
        console.error('Error fetching facility details:', error);
      }
    );
  }

  viewAvailability(): void {
    if (this.facility) {
      // Directly navigate to the reservations page with the facility ID
      this.router.navigate(['/reservations', this.facility._id]);
    }
  }
}
