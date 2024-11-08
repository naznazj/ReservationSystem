import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/user-page/home/home.component';
import { AboutComponent } from './components/pages/user-page/about/about.component';
import { ProfileComponent } from './components/pages/user-page/profile/profile.component';
import { FacilitiesComponent } from './components/pages/user-page/facilities/facilities.component';
import { ReservationComponent } from './components/pages/user-page/reservation/reservation.component';
import { NotificationsComponent } from './components/pages/user-page/notifications/notifications.component';
import { FaqsComponent } from './components/pages/user-page/faqs/faqs.component';
import { AdminDashboardComponent } from './components/pages/admin-page/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/pages/admin-page/admin-users/admin-users.component';
import { AdminFacilitiesComponent } from './components/pages/admin-page/admin-facilities/admin-facilities.component';
import { AdminReservationsComponent } from './components/pages/admin-page/admin-reservations/admin-reservations.component';
import { AdminNotificationsComponent } from './components/pages/admin-page/admin-notifications/admin-notifications.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { FacilitiesDetailsComponent } from './components/pages/user-page/facilities-details/facilities-details.component';
import { ReservationAvailabilityComponent } from './components/pages/user-page/reservation-availability/reservation-availability.component';
import { UserReservationComponent } from './components/pages/user-page/user-reservation/user-reservation.component';

export const appRoutes: Routes = [
  // User routes
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'facilities', component: FacilitiesComponent, canActivate: [AuthGuard] }, // Facility List
  { path: 'facilities/:id', component: FacilitiesDetailsComponent, canActivate: [AuthGuard] }, // Facility Details with Calendar
  { path: 'reservations', component: ReservationComponent, canActivate: [AuthGuard] }, // General reservations page
  { path: 'reservations/:facilityId', component: ReservationAvailabilityComponent, canActivate: [AuthGuard] }, // Reservation Availability by Facility ID
  // { path: 'user-reservations', component: UserReservationComponent, canActivate: [AuthGuard] }, // User reservations list by User ID
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },
  { path: 'faqs', component: FaqsComponent },
  // Admin routes
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: 'admin-users', component: AdminUsersComponent, canActivate: [AdminGuard] },
  { path: 'admin-facilities', component: AdminFacilitiesComponent, canActivate: [AdminGuard] },
  { path: 'admin-reservations', component: AdminReservationsComponent, canActivate: [AdminGuard] },
  { path: 'admin-notifications', component: AdminNotificationsComponent, canActivate: [AdminGuard] },

  // Wildcard route
  { path: '**', redirectTo: '' }
];
