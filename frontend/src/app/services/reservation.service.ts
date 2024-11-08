import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators'; // Import the map operator
import { Reservation } from '../models/reservation.model';
import { Facility } from '../models/facility.model'; // Adjust the import path according to your project structure
import { AuthService } from './auth.service';


interface TimeSlot {
  start: string;
  end: string;
}

interface AvailableDate {
  day: string;
  slots: TimeSlot[];
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:5000/api/reservations'; // API URL for reservations

  constructor(private http: HttpClient, private authService: AuthService) {}
  createReservation(reservationData: Reservation) { // Use the Reservation interface
    const token = localStorage.getItem('token'); // Assuming you're storing the JWT in localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}/add`, reservationData, { headers })
      .pipe(
        catchError(error => {
          console.error('Error creating reservation:', error);
          return throwError(error);
        })
      );
  }

  getAvailableTimes(facilityId: string, date: Date): Observable<AvailableDate[]> {
    return this.http.get<AvailableDate[]>(`${this.apiUrl}/available-times`, {
      params: { facilityId, date: date.toISOString() }
    });
  }

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  updateReservationStatus(reservationId: string, status: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.apiUrl}/update-status`, { reservationId, status }, { headers });
  }

  deleteReservation(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  getUserReservations(userId: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/user/${userId}`); // Adjust endpoint as necessary
  }

  getAvailableReservations(facilityId: string): Observable<AvailableDate[]> {
    const url = `${this.apiUrl}/available/${facilityId}`;
    return this.http.get<AvailableDate[]>(url);
  }
  

  getReservationsByUserId(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }

  // Method to get facility details by ID
  getFacilityDetails(facilityId: string): Observable<Facility> {
    const url = `http://localhost:5000/api/facilities/${facilityId}`; // Adjust the endpoint as necessary
    return this.http.get<Facility>(url).pipe(
      map(facility => ({
        ...facility,
        imageUrl: `http://localhost:5000${facility.imageUrl}` // Construct full URL dynamically if necessary
      }))
    );
  }
}
