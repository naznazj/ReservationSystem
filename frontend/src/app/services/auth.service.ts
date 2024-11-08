import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model'; // Import the User interface
import {jwtDecode,} from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserId?: string;
  private apiUrl = 'http://localhost:5000/api/auth'; // Updated API URL for all routes
  private tokenKey = 'token';
  private roleKey = 'role'; // Key to store role
  private token: string | null = null;
  private isLoggedInSubject = new BehaviorSubject<boolean>(false); // To manage login state



  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token'); 
  }

  // Login method
  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/login`, { email, password }, { headers })
    ;
  }

  // Register method
  register(user: User): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/register`, user, { headers });
  }

  // Admin: Add a new user
  addUser(user: User): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/admin/add-user`, user, { headers });
  }

  // Admin: View all users
  viewAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/view-users`);
  }

  // Admin: View a specific user by ID
  viewUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/admin/view-user/${id}`);
  }

  // Admin: Edit a user by ID
  editUser(id: string, user: User): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.apiUrl}/admin/edit-user/${id}`, user, { headers });
  }

  // Admin: Delete a user by ID
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/delete-user/${id}`);
  }

  // Store JWT token and role
  storeToken(token: string, role: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.roleKey, role); // Store the user role
  }

  // Get JWT token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUserId(): string | undefined {
    return this.currentUserId; // Replace with actual logic to retrieve user ID
  }

  // Get user role
  getUserRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  // Remove JWT token and role
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  getUserId(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    
    const decoded: any = jwtDecode(token); // Decode the token
    return decoded.id; // Assuming 'id' is the field in your token payload
  }
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users/`);
  }
  isAuthenticated(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }
  
  getCurrentUser(): any {
    if (this.token) { // Log the token
        try {
            const decodedToken: any = jwtDecode(this.token);
            return {
                id: decodedToken.id,
                fullName: `${decodedToken.firstName || ''} ${decodedToken.lastName || ''}`,
                role: decodedToken.role,
            };
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }
    return null;
}

}  

