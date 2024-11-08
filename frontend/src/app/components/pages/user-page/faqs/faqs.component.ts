import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.css'
})
export class FaqsComponent {
  faqs = [
    {
      question: 'How do I reserve a facility or asset through the system?',
      answer: 'To reserve a facility or asset, log in to our system and browse the available options. Select the facility or asset you wish to book, and the system will display a calendar with available dates and time slots. Choose the time that works best for you, fill out the reservation form, and submit your request.'
    },
    {
      question: 'Can I check the availability of a facility or asset before making a reservation?',
      answer: 'Yes, our system allows you to view the availability of any facility or asset in real-time. Simply select the facility or asset you are interested in, and the availability calendar will show you open time slots.'
    },
    {
      question: 'How do I know if the facility or asset I want to reserve is available?',
      answer: 'Once you select the facility or asset you are interested in, you’ll be able to view its availability on the calendar. Green highlights indicate available slots, while unavailable slots will be marked in red.'
    },
    {
      question: 'How can I cancel or modify a reservation after booking?',
      answer: 'You can manage your reservation through the user portal. If you need to cancel or modify your reservation, simply log in, navigate to your reservations, and make the necessary changes.'
    }
  ];
}


