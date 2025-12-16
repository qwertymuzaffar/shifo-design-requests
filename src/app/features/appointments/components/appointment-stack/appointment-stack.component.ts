import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  computed,
} from '@angular/core';
import { AppointmentModel } from '@models/appointment.model';
import { getAppointmentColor } from '@features/appointments/utils/appointment-color.util';
import { MatTooltip } from '@angular/material/tooltip';
import { AppointmentStatus } from '@features/appointments/models/appointment.model';

@Component({
  selector: 'app-appointment-stack',
  imports: [MatTooltip],
  template: `
    @for (patient of visibleAppointments(); track patient.id; let i = $index) {
      @if (showOverflowButton() && i === 3) {
        <div
          class="h-14 flex items-center justify-center bg-white border-2 border-blue-200 rounded p-2 font-semibold text-sm transition-colors hover:bg-blue-50 hover:border-blue-300 cursor-pointer"
          [style.width]="itemWidth()"
          (click)="overflowSelected.emit()"
        >
          <span class="text-blue-500">+{{ appointments().length - 3 }}</span>
        </div>
      } @else {
        <div
          class="h-14 flex flex-col items-center justify-center p-2 cursor-pointer border rounded hover:shadow-md transition-shadow transition-transform"
          [class]="getAppointmentColor(patient.status)"
          [style.width]="itemWidth()"
          (click)="appointmentSelected.emit(patient)"
          matTooltip="{{ patient.patient.fullName }}"
          matTooltipPosition="above"
        >
          <div
            class="overflow-hidden text-ellipsis whitespace-nowrap text-center w-full font-semibold text-xs"
            [class.line-through]="
              patient.status === AppointmentStatus.CANCELLED_FOREVER
            "
          >
            {{ patient.patient.fullName }}
          </div>

          <div class="text-[10px] opacity-90">
            {{ patient.duration }}{{ durationLabel() }}
          </div>
        </div>
      }
    }
  `,
  styles: `
    :host {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentStackComponent {
  appointments = input.required<AppointmentModel[]>();
  durationLabel = input<string>('м');
  appointmentSelected = output<AppointmentModel>();
  overflowSelected = output<void>();

  protected readonly getAppointmentColor = getAppointmentColor;

  itemWidth = computed(() => {
    const count = this.appointments().length;

    if (count < 2) {
      return `calc(100% - 1px)`;
    }

    if (count >= 2 && count < 5) {
      return `calc(${100 / count}% - 1px)`;
    }

    return `calc(${100 / 4}% - 1px)`;
  });

  showOverflowButton = computed(() => this.appointments().length > 4);

  visibleAppointments = computed(() => {
    const list = this.appointments();
    return list.length > 4 ? list.slice(0, 4) : list;
  });

  protected readonly AppointmentStatus = AppointmentStatus;
}
