import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { AboutComponent } from '../about/about.component';
import { FaqsComponent } from '../faqs/faqs.component';
import { FooterComponent } from "../footer/footer.component";
import { AuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, AboutComponent, FaqsComponent, FooterComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  stats = {
    eventsBooked: 325,
    facilitiesReserved: 128,
    happyVisitors: 980,
    activeUsers: 250
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
  
  }
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  startSlider() {
    const slides = document.querySelectorAll('.event-slide');
    let currentIndex = 0;

    setInterval(() => {
      slides[currentIndex].classList.remove('opacity-100');
      slides[currentIndex].classList.add('opacity-0');

      currentIndex = (currentIndex + 1) % slides.length;

      slides[currentIndex].classList.remove('opacity-0');
      slides[currentIndex].classList.add('opacity-100');
    }, 3000); // 3 seconds interval
  }
}
