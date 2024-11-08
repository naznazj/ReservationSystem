import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Facility } from '../models/facility.model';
import { Reservation } from '../models/reservation.model'; // Adjust the import path according to your project structure

@Injectable({
  providedIn: 'root'
})
export class FacilityService {
  private apiUrl = 'http://localhost:5000/api/facilities'; // Facility-related base URL

  constructor(private http: HttpClient) {}

  private selectedFacilityId?: string;

  setSelectedFacilityId(id: string): void {
    this.selectedFacilityId = id;
  }
  
  getSelectedFacilityId(): string | undefined {
    return this.selectedFacilityId;
  }
  
  // Get all available facilities with image URLs
   getAvailableFacilities(): Observable<Facility[]> {
    return this.http.get<Facility[]>(`${this.apiUrl}/available`).pipe(
      map((facilities: Facility[]) => {
        return facilities.map(facility => {
          // Use the base URL only once when accessing the image
          return {
            ...facility,
            imageUrl: `http://localhost:5000${facility.imageUrl}` // Construct full URL dynamically
          };
        });
      })
    );
  }

  // Add a new facility (FormData for handling file uploads)
  addFacility(formData: FormData): Observable<Facility> {
    return this.http.post<Facility>(`${this.apiUrl}/add`, formData); // POST request to add facility
  }

  // Update an existing facility
  updateFacility(id: string, formData: FormData): Observable<Facility> {
    return this.http.put<Facility>(`${this.apiUrl}/update/${id}`, formData);
  }

  // Delete a facility
  deleteFacility(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  getFacilityById(id: string): Observable<Facility> {
    return this.http.get<Facility>(`${this.apiUrl}/${id}`).pipe(
      map(facility => ({
        ...facility,
        imageUrl: `http://localhost:5000${facility.imageUrl}` // Construct full URL dynamically
      }))
    );
  }

  getAvailableDates(facilityId: string): Observable<Facility[]> {
    return this.http.get<Facility[]>(`${this.apiUrl}/${facilityId}/available-dates`);
  }

  getUserReservations(userId: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/user/${userId}`); // Adjust endpoint as necessary
  }

}

