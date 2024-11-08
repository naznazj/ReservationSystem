import { Component } from '@angular/core';
import { FacilityService } from '../../../../services/facility.service';
import { SidebarComponent } from '../side-bar/side-bar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuccessModalComponent } from '../../user-page/shared/success-modal/success-modal.component';
import { ErrorModalComponent } from '../../user-page/shared/error-modal/error-modal.component';
import { Facility } from '../../../../models/facility.model';
import { HttpClient } from '@angular/common/http';
import { LoadingComponent } from '../../user-page/shared/loading/loading.component';

@Component({
  selector: 'app-admin-facilities',
  standalone: true,
  imports: [SidebarComponent, CommonModule, FormsModule, ErrorModalComponent, SuccessModalComponent, LoadingComponent],
  templateUrl: './admin-facilities.component.html',
  styleUrls: ['./admin-facilities.component.css']
})
export class AdminFacilitiesComponent {
  facility: Facility = {
    name: '',
    description: '',
    price: 0,
    availability: {
      startDay: '',
      endDay: '',
      timeRange: {
        startTime: '',
        endTime: ''
      }
    },
    imageFile: null,
    imageFilename: '' // Added property for storing the image filename
  };

  facilities: Facility[] = [];
  paginatedFacilities: Facility[] = [];
  noDataAvailable: boolean = false;
  daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  imagePreviewUrl: string | ArrayBuffer | null = null;
  showModal: boolean = false;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;

  // Loader
  isLoading: boolean = false;

  // Modal control
  showErrorModal: boolean = false;
  showSuccessModal: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  validTimes: string[] = [];

  constructor(private facilityService: FacilityService, private http: HttpClient) {
    this.generateValidTimes();
    this.fetchFacilities();
  }

  // Pagination method
  paginateFacilities() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedFacilities = this.facilities.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage() {
    if ((this.currentPage * this.itemsPerPage) < this.facilities.length) {
      this.currentPage++;
      this.paginateFacilities();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateFacilities();
    }
  }

  // Method to generate valid times for validation
  generateValidTimes() {
    for (let hour = 0; hour < 24; hour++) {
      const hourStr = String(hour).padStart(2, '0');
      this.validTimes.push(`${hourStr}:00`, `${hourStr}:30`);
    }
  }

/// Fetch facilities from the service
fetchFacilities() {
  this.isLoading = true; // Show loader
  this.facilityService.getAvailableFacilities().subscribe(
    (response: Facility[]) => {
      this.isLoading = false; // Hide loader
      this.facilities = response;

      // Debugging line to log fetched facilities
      console.log('Fetched facilities:', this.facilities);

      this.noDataAvailable = !this.facilities || this.facilities.length === 0;
      this.paginateFacilities(); // Paginate facilities after fetching
    },
    (error) => {
      this.isLoading = false;
      console.error('Error fetching facilities:', error);
      this.noDataAvailable = true;
      this.openErrorModal('Failed to fetch facilities. Please try again later.');
    }
  );
}


  // Method to open the modal
  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }
  // Handle file selection and create an image preview
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.facility.imageFile = file;
      this.facility.imageFilename = file.name; // Set the image filename
      // Create image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle facility addition
  addFacility() {
    if (!this.facility.name || !this.facility.description || this.facility.price <= 0 || !this.facility.imageFile) {
      this.openErrorModal("Please fill in all the required fields including an image.");
      return;
    }

    // Validate time values
    if (!this.validTimes.includes(this.facility.availability.timeRange.startTime)) {
      this.openErrorModal(`Invalid start time: ${this.facility.availability.timeRange.startTime}`);
      return;
    }

    if (!this.validTimes.includes(this.facility.availability.timeRange.endTime)) {
      this.openErrorModal(`Invalid end time: ${this.facility.availability.timeRange.endTime}`);
      return;
    }

    const formData = new FormData();
    formData.append('name', this.facility.name);
    formData.append('description', this.facility.description);
    formData.append('price', this.facility.price.toString());
    formData.append('availability', JSON.stringify({
      startDay: this.facility.availability.startDay,
      endDay: this.facility.availability.endDay,
      timeRange: {
        startTime: this.facility.availability.timeRange.startTime,
        endTime: this.facility.availability.timeRange.endTime
      }
    }));

    if (this.facility.imageFile) {
      formData.append('image', this.facility.imageFile);
    }

    // Debugging: Log the form data
    console.log('Form Data:');
    formData.forEach((value, key) => {
      console.log(`${key}: `, value);
    });

    this.facilityService.addFacility(formData).subscribe(
      (response: Facility) => {
        console.log('Facility added successfully:', response);
        this.successMessage = "Facility added successfully!";
        this.showSuccessModal = true;
        this.fetchFacilities();
        this.closeModal();
      },
      (error) => {
        console.error('Error adding facility:', error);
        const errorMessage = error.error?.message || 'An error occurred while adding the facility.';
        this.openErrorModal(errorMessage);
      }
    );
  }

  // Handle facility editing
  editFacility(id: string | null) {
    if (!id) {
      console.error('No facility ID provided for editing.');
      return;
    }

    const facilityToEdit = this.facilities.find(f => f._id === id); // Use _id from Facility interface
    if (!facilityToEdit) {
      console.error('Facility not found for editing.');
      return;
    }

    this.facility = { ...facilityToEdit }; // Pre-fill the form with facility data
    this.openModal(); // Open modal to edit
  }

  // Handle facility deletion
  deleteFacility(id: string | null) {
    if (!id) {
      console.error('No facility ID provided for deletion.');
      return;
    }

    if (confirm('Are you sure you want to delete this facility?')) {
      this.facilityService.deleteFacility(id).subscribe(
        (response) => {
          console.log('Facility deleted successfully:', response);
          this.successMessage = "Facility deleted successfully!";
          this.showSuccessModal = true; // Show success modal
          this.fetchFacilities(); // Refresh the facility list after deletion
        },
        (error) => {
          console.error('Error deleting facility:', error);
          const errorMessage = error.error?.message || 'An error occurred while deleting the facility.';
          this.openErrorModal(errorMessage);
        }
      );
    }
  }

  // Open error modal with a message
  openErrorModal(message: string) {
    this.errorMessage = message;
    this.showErrorModal = true;
  }

  // Close error modal
  closeErrorModal() {
    this.showErrorModal = false;
  }

  // Close success modal
  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  // Reset the form to its initial state
  resetForm() {
    this.facility = {
      name: '',
      description: '',
      price: 0,
      availability: {
        startDay: '',
        endDay: '',
        timeRange: {
          startTime: '',
          endTime: ''
        }
      },
      imageFile: null,
      imageFilename: '' // Reset the image filename
    };
    this.imagePreviewUrl = null; // Reset the image preview
  }
}
