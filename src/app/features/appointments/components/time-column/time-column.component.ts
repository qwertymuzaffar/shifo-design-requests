import { Component, input } from '@angular/core';

@Component({
  selector: 'app-time-column',
  template: `
    <div class="border-r border-gray-200">
      @for (time of timeSlots(); track time) {
        <div
          class="h-16 border-b border-gray-100 flex items-center justify-center text-sm text-gray-500"
          [class.bg-red-50]="isCurrentTime()(time)"
          [class.text-red-600]="isCurrentTime()(time)"
          [class.font-medium]="isCurrentTime()(time)"
        >
          {{ time }}
        </div>
      }
    </div>
  `,
})
export class TimeColumnComponent {
  timeSlots = input.required<string[]>();
  isCurrentTime = input.required<(time: string) => boolean>();
}

