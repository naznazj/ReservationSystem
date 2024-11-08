import { Component } from '@angular/core';
import { SidebarComponent } from '../side-bar/side-bar.component';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './admin-notifications.component.html',
  styleUrl: './admin-notifications.component.css'
})
export class AdminNotificationsComponent {

}
