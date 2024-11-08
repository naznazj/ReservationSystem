import { Component, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 flex items-center justify-center z-50" *ngIf="visible">
      <div
        class="bg-white rounded shadow-lg p-5 w-1/3 transition-transform transform duration-300 ease-in-out"
        [ngClass]="{ 'scale-100': visible, 'scale-90': !visible }"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <h2 id="modal-title" class="text-green-600 font-bold text-center">{{ title }}</h2>
        <p id="modal-description" class="text-center my-2">{{ message }}</p>
        <div class="flex justify-center">
          <button (click)="closeModal()" class="mt-4 bg-green-500 text-white py-2 px-4 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
    <div class="fixed inset-0 bg-black opacity-50" *ngIf="visible"></div>
  `,
  styleUrls: ['./success-modal.component.css'],
})
export class SuccessModalComponent {
  @Input() message: string = '';
  @Input() title: string = 'Success'; // Dynamic title
  visible: boolean = false;

  openModal(message: string, title: string = 'Success') {
    this.message = message;
    this.title = title; // Set dynamic title
    this.visible = true;
  }

  closeModal() {
    this.visible = false;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closeModal(); // Close modal on Escape key press
    }
  }
}
