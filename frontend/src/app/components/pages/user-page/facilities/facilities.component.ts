import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FacilityService } from '../../../../services/facility.service';
import { Facility } from '../../../../models/facility.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../shared/loading/loading.component'; // Adjust import path as needed

@Component({
  selector: 'app-facilities',
  standalone: true,
  imports: [HeaderComponent, CommonModule, LoadingComponent],
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.css']
})
export class FacilitiesComponent implements OnInit {
  facilities: Facility[] = [];
  isLoading: boolean = true; // Loading state

  constructor(private facilityService: FacilityService, private router: Router) {}

  ngOnInit(): void {
    this.facilityService.getAvailableFacilities().subscribe(
      (data: Facility[]) => {
        this.facilities = data;
        this.isLoading = false; // Stop loading when data is fetched
      },
      (error) => {
        console.error('Error fetching facilities:', error);
        this.isLoading = false; // Stop loading on error as well
      }
    );
  }

  viewFacility(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/facilities', id]); // Navigate only if id is defined
    } else {
      console.error('Facility ID is undefined');
    }
  }
}
