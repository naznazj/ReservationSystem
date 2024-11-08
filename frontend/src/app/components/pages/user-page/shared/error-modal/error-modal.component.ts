import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-modal',
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
        <h2 id="modal-title" class="text-red-600 font-bold text-center">{{ title }}</h2>
        <p id="modal-description" class="text-center my-2">{{ message }}</p>
        <div class="flex justify-center">
          <button (click)="closeModal()" class="mt-4 bg-red-500 text-white py-2 px-4 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
    <div class="fixed inset-0 bg-black opacity-50" *ngIf="visible"></div>
  `,
  styleUrls: ['./error-modal.component.css'],
})
export class ErrorModalComponent {
  @Input() errorMessage: string | null = null; // Optional: Use if needed for additional error messages
  @Input() message: string = '';
  @Input() title: string = 'Warning'; // Dynamic title
  @Input() visible: boolean = false; // Control visibility from parent component
  @Output() closed = new EventEmitter<void>(); // Event emitter to notify parent when modal is closed

  openModal(message: string, title: string = 'Warning') {
    this.message = message;
    this.title = title; // Set dynamic title
    this.visible = true;
  }

  closeModal() {
    this.visible = false;
    this.closed.emit(); // Emit close event to parent component
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closeModal(); // Close modal on Escape key press
    }
  }
}
