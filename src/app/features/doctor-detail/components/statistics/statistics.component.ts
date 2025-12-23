import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorDetailComponent } from '../../doctor-detail.component';
import { LucideAngularModule, Calendar, DollarSign, TrendingUp, Users, ChevronLeft, ChevronRight } from 'lucide-angular';
import { AppointmentService } from '@core/services/appointment.service';
import { DateRangePickerComponent } from '@shared/components/date-range-picker/date-range-picker';

type PeriodType = 'today' | 'week' | 'month' | 'year' | 'custom';

@Component({
  selector: 'app-doctor-statistics',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, DateRangePickerComponent],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class DoctorStatisticsComponent implements OnInit {
  private parent = inject(DoctorDetailComponent);
  private appointmentService = inject(AppointmentService);

  doctor = this.parent.doctor;
  isLoading = signal(true);
  totalAppointments = signal(0);
  completedAppointments = signal(0);
  totalRevenue = signal(0);
  averageRating = signal(0);

  selectedPeriod = signal<PeriodType>('month');
  showCalendar = signal(false);
  selectedDates = signal<{ from: Date | null; to: Date | null }>({
    from: this.getMonthStart(),
    to: this.getMonthEnd()
  });

  protected readonly Calendar = Calendar;
  protected readonly DollarSign = DollarSign;
  protected readonly TrendingUp = TrendingUp;
  protected readonly Users = Users;
  protected readonly ChevronLeft = ChevronLeft;
  protected readonly ChevronRight = ChevronRight;

  ngOnInit(): void {
    const doctorId = this.doctor()?.id;
    if (doctorId) {
      this.loadStatistics(doctorId);
    }
  }

  private getMonthStart(): Date {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private getMonthEnd(): Date {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  selectPeriod(period: PeriodType): void {
    this.selectedPeriod.set(period);
    const today = new Date();

    switch (period) {
      case 'today':
        this.selectedDates.set({ from: today, to: today });
        break;
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        this.selectedDates.set({ from: weekStart, to: weekEnd });
        break;
      case 'month':
        this.selectedDates.set({ from: this.getMonthStart(), to: this.getMonthEnd() });
        break;
      case 'year':
        const yearStart = new Date(today.getFullYear(), 0, 1);
        const yearEnd = new Date(today.getFullYear(), 11, 31);
        this.selectedDates.set({ from: yearStart, to: yearEnd });
        break;
      case 'custom':
        this.showCalendar.set(true);
        return;
    }

    this.showCalendar.set(false);
    this.loadStatistics(this.doctor()?.id!);
  }

  onDatesChange(dates: { from: Date | null; to: Date | null }): void {
    this.selectedDates.set(dates);
    if (dates.from && dates.to) {
      this.loadStatistics(this.doctor()?.id!);
    }
  }

  getFormattedDateRange(): string {
    const dates = this.selectedDates();
    if (!dates.from || !dates.to) return '';

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    if (dates.from.getTime() === dates.to.getTime()) {
      return formatDate(dates.from);
    }

    return `${formatDate(dates.from)} - ${formatDate(dates.to)}`;
  }

  private loadStatistics(doctorId: number): void {
    this.isLoading.set(true);
    const dates = this.selectedDates();

    this.appointmentService.getAppointments({
      doctorId,
      startDate: dates.from?.toISOString().split('T')[0],
      endDate: dates.to?.toISOString().split('T')[0]
    }).subscribe({
      next: (response) => {
        const appointments = Array.isArray(response) ? response : (response as any).data || [];
        const completed = appointments.filter((a: any) => a.status === 'completed');

        this.totalAppointments.set(appointments.length);
        this.completedAppointments.set(completed.length);
        this.totalRevenue.set(completed.reduce((sum: number, a: any) => sum + (a.totalAmount || 0), 0));
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}
