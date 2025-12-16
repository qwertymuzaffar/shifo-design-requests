import {
  Component,
  inject,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AppointmentModel } from '@models/appointment.model';
import { TimeSlotClickPayload } from '@features/appointments/models/time-slot.model';
import { Doctor } from '@features/doctor/models/doctor';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentDetailsComponent } from '@features/appointments/dialogs/appointment-details/appointment-details.component';
import { CalendarDateHeaderComponent } from '@features/appointments/components/calendar-date-header/calendar-date-header.component';
import { TimeColumnComponent } from '@features/appointments/components/time-column/time-column.component';
import { WeekSlotComponent } from '@features/appointments/components/week-slot/week-slot.component';
import { first } from 'rxjs';
import { toISODateString } from '@core/utils/date.utils';

@Component({
  selector: 'app-calendar-grid',
  standalone: true,
  imports: [
    CalendarDateHeaderComponent,
    TimeColumnComponent,
    WeekSlotComponent,
  ],
  templateUrl: './calendar-grid.component.html',
  styleUrls: ['./calendar-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarGridComponent {
  appointments = input<AppointmentModel[]>([]);
  doctors = input<Doctor[]>([]);
  displayDays = input<Date[]>([]);
  timeSlots = input<string[]>([]);
  isWeekMode = input<boolean>(false);
  appointmentClick = output<AppointmentModel>();
  timeSlotClick = output<TimeSlotClickPayload>();
  clonedAppointment = output<Date>();
  reload = output<void>();

  private matDialog = inject(MatDialog);

  getAppointmentsForSlot(date: Date, time: string, doctorIndex: number) {
    const dateStr = toISODateString(date);
    const doctorId = this.doctors()[doctorIndex]?.id;

    return this.appointments().filter((apt) => {
      const matchesDate = dateStr === apt.date;
      const matchesTime = apt.time.slice(0, 2) === time.slice(0, 2);
      const matchesDoctor = this.isWeekMode()
        ? true
        : apt.doctor?.id === doctorId;
      return matchesDate && matchesTime && matchesDoctor;
    });
  }

  isCurrentTime(time: string) {
    const now = new Date();
    const getHours = now.getHours().toString().padStart(2, '0');
    return time.slice(0, 2) === getHours;
  }

  addAppointment(
    date: Date,
    time: string,
    appointmentList: AppointmentModel[],
    doctor?: Doctor,
  ): void {
    if (!this.isWeekMode() && appointmentList.length > 0) {
      this.appointmentClick.emit(appointmentList[0]);
      return;
    }

    this.timeSlotClick.emit({
      date: toISODateString(date),
      time,
      appointmentList,
      ...(!this.isWeekMode() && { doctor }),
    });
  }

  openDetails(appointment: AppointmentModel) {
    this.matDialog
      .open(AppointmentDetailsComponent, {
        data: appointment,
        width: '100%',
        maxWidth: '900px',
        height: '900px',
      })
      .afterClosed()
      .pipe(first())
      .subscribe(() => {
        this.reload.emit();
      });
  }
}
