import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service'; // Adjust the path as necessary
import { User } from '../../../../models/user.model'; // Import the User interface
import { SidebarComponent } from '../side-bar/side-bar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ErrorModalComponent } from '../../user-page/shared/error-modal/error-modal.component';
import { SuccessModalComponent } from '../../user-page/shared/success-modal/success-modal.component';
import { LoadingComponent } from '../../user-page/shared/loading/loading.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [SidebarComponent, CommonModule, FormsModule, ErrorModalComponent, SuccessModalComponent, LoadingComponent],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  paginatedUsers: User[] = [];
  loading = true;
  error: string | null = null;
  currentPage: number = 1;
  usersPerPage: number = 8;

  constructor(private userService: AuthService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.paginateUsers();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users';
        console.error(err);
        this.loading = false;
      }
    });
  }

  paginateUsers(): void {
    const startIndex = (this.currentPage - 1) * this.usersPerPage;
    this.paginatedUsers = this.users.slice(startIndex, startIndex + this.usersPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.paginateUsers();
  }

  get totalPages(): number {
    return Math.ceil(this.users.length / this.usersPerPage);
  }
}
