import { Component, input, output, signal } from '@angular/core';
import { DateRangePickerComponent } from '@shared/components/date-range-picker/date-range-picker';
import { TranslocoPipe } from '@jsverse/transloco';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-period-selector',
  standalone: true,
  imports: [
    DateRangePickerComponent,
    TranslocoPipe,
    LucideAngularModule,
  ],
  templateUrl: './period-selector.component.html',
  styleUrl: './period-selector.component.scss',
})
export class PeriodSelectorComponent {
  dateRangeText = input.required<string>();
  selectedDates = input.required<{ from: Date | null; to: Date | null }>();
  
  datesChange = output<{ from: Date | null; to: Date | null }>();
  applyDates = output<{ from: Date | null; to: Date | null }>();
  clearFilter = output<void>();

  protected readonly X = X;
  readonly isCalendarOpen = signal<boolean>(false);
  readonly tempDates = signal<{ from: Date | null; to: Date | null }>({ from: null, to: null });

  onOpenCalendar(): void {
    const currentDates = this.selectedDates();
    this.tempDates.set({ 
      from: currentDates.from ? new Date(currentDates.from) : null, 
      to: currentDates.to ? new Date(currentDates.to) : null 
    });
    this.isCalendarOpen.set(true);
  }

  onCloseCalendar(): void {
    this.isCalendarOpen.set(false);
    const currentDates = this.selectedDates();
    this.tempDates.set({ 
      from: currentDates.from ? new Date(currentDates.from) : null, 
      to: currentDates.to ? new Date(currentDates.to) : null 
    });
  }

  onDatesChange(dates: { from: Date | null; to: Date | null }): void {
    this.tempDates.set(dates);
    this.datesChange.emit(dates);
  }

  onApplyDates(): void {
    this.isCalendarOpen.set(false);
    this.applyDates.emit(this.tempDates());
  }

  onClearFilter(): void {
    this.clearFilter.emit();
  }
}

