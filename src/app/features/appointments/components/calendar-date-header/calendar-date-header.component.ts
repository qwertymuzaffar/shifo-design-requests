import { Component, input, output, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { DatePipe, SlicePipe, NgStyle } from '@angular/common';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-calendar-date-header',
  imports: [
    DatePipe,
    SlicePipe,
    TranslocoPipe,
    LucideAngularModule,
    MatTooltip,
    NgStyle,
  ],
  templateUrl: './calendar-date-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarDateHeaderComponent {
  private transloco = inject(TranslocoService);
  lang = computed(() => this.transloco.getActiveLang());

  displayDays = input.required<Date[]>();
  dateClicked = output<Date>();

  protected readonly Plus = Plus;

  isToday(date: Date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }
}

