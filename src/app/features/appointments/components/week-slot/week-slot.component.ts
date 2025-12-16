import { Component, inject, input, output } from '@angular/core';
import { AppointmentModel } from '@models/appointment.model';
import { AppointmentStackComponent } from '@features/appointments/components/appointment-stack/appointment-stack.component';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentsListModalComponent } from '@features/appointments/dialogs/appointments-list-modal/appointments-list-modal.component';
import { LucideAngularModule, Plus } from 'lucide-angular';

@Component({
  selector: 'app-week-slot',
  imports: [AppointmentStackComponent, LucideAngularModule],
  template: `
    <div
      class="h-16 border-b border-gray-200 p-1 relative cursor-pointer hover:bg-gray-50 transition-colors"
      [class.bg-red-50]="isCurrentSlot()"
    >
      @if (isCurrentSlot()) {
        <div
          class="absolute top-0 left-0 w-full h-0.5 bg-red-500 z-10"
        ></div>
      }

      <div
        class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
        (click)="handleEmptyClick()"
      >
        @if (appointments().length === 0) {
          <lucide-icon
            [name]="Plus"
            [size]="16"
            class="text-gray-400"
          ></lucide-icon>
        }
      </div>

      @if (appointments().length > 0) {
        <div
          class="h-full flex items-center justify-center cursor-pointer text-center relative overflow-visible"
        >
          <app-appointment-stack
            [appointments]="appointments()"
            [durationLabel]="durationLabel()"
            (appointmentSelected)="appointmentSelected.emit($event)"
            (overflowSelected)="handleOverflowClick()"
          />
        </div>
      }
    </div>
  `,
})
export class WeekSlotComponent {
  appointments = input<AppointmentModel[]>([]);
  isCurrentSlot = input<boolean>(false);
  durationLabel = input<string>('м');
  enableOverflowDialog = input<boolean>(true);
  appointmentSelected = output<AppointmentModel>();
  emptySlotClicked = output<void>();
  overflowClicked = output<AppointmentModel[]>();

  private matDialog = inject(MatDialog);
  protected readonly Plus = Plus;

  handleEmptyClick() {
    if (this.appointments().length === 0) {
      this.emptySlotClicked.emit();
    }
  }

  handleOverflowClick() {
    this.overflowClicked.emit(this.appointments());

    if (this.enableOverflowDialog()) {
      this.matDialog.open(AppointmentsListModalComponent, {
        data: this.appointments(),
        position: {
          top: '0',
          right: '0'
        },
      });
    }
  }
}

