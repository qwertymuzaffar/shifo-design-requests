import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorDetailComponent } from '../../doctor-detail.component';
import { LucideAngularModule, Calendar, DollarSign, TrendingUp, Users, ChevronLeft, ChevronRight, X } from 'lucide-angular';
import { AppointmentService } from '@core/services/appointment.service';
import { DateRangePickerComponent } from '@shared/components/date-range-picker/date-range-picker';

type PeriodType = 'today' | 'week' | 'month' | 'year' | 'all';

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

  // Patient metrics
  uniquePatients = signal(0);
  newPatients = signal(0);
  returningPatients = signal(0);

  // Cancellation metrics
  cancelledAppointments = signal(0);
  noShowAppointments = signal(0);

  // Appointment types
  consultationCount = signal(0);
  followUpCount = signal(0);
  procedureCount = signal(0);
  emergencyCount = signal(0);

  // Temporal statistics
  busiestDay = signal('');
  peakHours = signal<{ hour: number; count: number }[]>([]);

  // Financial metrics
  averagePayment = signal(0);
  unpaidAppointments = signal(0);
  paymentMethods = signal<{ method: string; count: number; amount: number }[]>([]);

  // Timeline data
  dailyStats = signal<{ date: string; appointments: number; revenue: number }[]>([]);

  // Additional analytics
  averageDuration = signal(0);
  utilizationRate = signal(0);

  selectedPeriod = signal<PeriodType>('month');
  isCalendarOpen = signal(false);
  selectedDates = signal<{ from: Date | null; to: Date | null }>({
    from: this.getMonthStart(),
    to: this.getMonthEnd()
  });
  tempDates = signal<{ from: Date | null; to: Date | null }>({
    from: this.getMonthStart(),
    to: this.getMonthEnd()
  });

  showAllTimeline = signal(false);

  protected readonly Calendar = Calendar;
  protected readonly DollarSign = DollarSign;
  protected readonly TrendingUp = TrendingUp;
  protected readonly Users = Users;
  protected readonly ChevronLeft = ChevronLeft;
  protected readonly ChevronRight = ChevronRight;
  protected readonly X = X;

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

    let newDates: { from: Date | null; to: Date | null };

    switch (period) {
      case 'today':
        newDates = { from: today, to: today };
        break;
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        newDates = { from: weekStart, to: weekEnd };
        break;
      case 'month':
        newDates = { from: this.getMonthStart(), to: this.getMonthEnd() };
        break;
      case 'year':
        const yearStart = new Date(today.getFullYear(), 0, 1);
        const yearEnd = new Date(today.getFullYear(), 11, 31);
        newDates = { from: yearStart, to: yearEnd };
        break;
      case 'all':
        newDates = { from: null, to: null };
        break;
    }

    this.tempDates.set(newDates);
  }

  onDatesChange(dates: { from: Date | null; to: Date | null }): void {
    this.tempDates.set(dates);
  }

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

  onApplyDates(): void {
    this.selectedDates.set(this.tempDates());
    this.isCalendarOpen.set(false);
    this.loadStatistics(this.doctor()?.id!);
  }

  onClearFilter(): void {
    this.selectedDates.set({ from: null, to: null });
    this.tempDates.set({ from: null, to: null });
    this.selectedPeriod.set('all');
    this.loadStatistics(this.doctor()?.id!);
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

  formatDailyDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' });
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
        this.calculateAllMetrics(appointments);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  private calculateAllMetrics(appointments: any[]): void {
    const completed = appointments.filter((a: any) => a.status === 'completed');
    const cancelled = appointments.filter((a: any) => a.status === 'cancelled');
    const noShow = appointments.filter((a: any) => a.status === 'cancelled_forever');

    // Basic metrics
    this.totalAppointments.set(appointments.length);
    this.completedAppointments.set(completed.length);
    this.totalRevenue.set(completed.reduce((sum: number, a: any) => sum + (a.totalAmount || 0), 0));

    // Patient metrics
    this.calculatePatientMetrics(appointments);

    // Cancellation metrics
    this.cancelledAppointments.set(cancelled.length);
    this.noShowAppointments.set(noShow.length);

    // Appointment types
    this.calculateAppointmentTypes(appointments);

    // Temporal statistics
    this.calculateTemporalStats(appointments);

    // Financial metrics
    this.calculateFinancialMetrics(completed);

    // Timeline data
    this.calculateDailyStats(appointments);

    // Additional analytics
    this.calculateAdditionalAnalytics(completed);
  }

  private calculatePatientMetrics(appointments: any[]): void {
    const patientIds = appointments.map((a: any) => a.patientId).filter(Boolean);
    const uniqueIds = [...new Set(patientIds)];
    this.uniquePatients.set(uniqueIds.length);

    // Calculate new vs returning patients
    const patientAppointmentCounts = new Map<number, number>();
    appointments.forEach((a: any) => {
      if (a.patientId) {
        const count = patientAppointmentCounts.get(a.patientId) || 0;
        patientAppointmentCounts.set(a.patientId, count + 1);
      }
    });

    let newCount = 0;
    let returningCount = 0;
    patientAppointmentCounts.forEach((count) => {
      if (count === 1) newCount++;
      else returningCount++;
    });

    this.newPatients.set(newCount);
    this.returningPatients.set(returningCount);
  }

  private calculateAppointmentTypes(appointments: any[]): void {
    const types = appointments.reduce((acc: any, a: any) => {
      const type = a.type?.toLowerCase() || 'consultation';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    this.consultationCount.set(types['consultation'] || 0);
    this.followUpCount.set(types['follow_up'] || types['follow-up'] || 0);
    this.procedureCount.set(types['procedure'] || 0);
    this.emergencyCount.set(types['emergency'] || 0);
  }

  private calculateTemporalStats(appointments: any[]): void {
    // Busiest day of week
    const dayCount = new Map<number, number>();
    const hourCount = new Map<number, number>();

    appointments.forEach((a: any) => {
      if (a.date) {
        const date = new Date(a.date);
        const day = date.getDay();
        dayCount.set(day, (dayCount.get(day) || 0) + 1);

        if (a.time) {
          const hour = parseInt(a.time.split(':')[0]);
          hourCount.set(hour, (hourCount.get(hour) || 0) + 1);
        }
      }
    });

    const busiestDayNum = Array.from(dayCount.entries()).reduce((max, entry) =>
      entry[1] > max[1] ? entry : max, [0, 0])[0];
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.busiestDay.set(daysOfWeek[busiestDayNum] || 'N/A');

    // Peak hours
    const peakHoursData = Array.from(hourCount.entries())
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    this.peakHours.set(peakHoursData);
  }

  private calculateFinancialMetrics(completed: any[]): void {
    if (completed.length > 0) {
      const totalAmount = completed.reduce((sum: number, a: any) => sum + (a.totalAmount || 0), 0);
      this.averagePayment.set(totalAmount / completed.length);
    } else {
      this.averagePayment.set(0);
    }

    const unpaid = completed.filter((a: any) => !a.isPaid || a.isPaid === false);
    this.unpaidAppointments.set(unpaid.length);

    // Payment methods distribution
    const methodsMap = new Map<string, { count: number; amount: number }>();
    completed.forEach((a: any) => {
      if (a.paymentMethod) {
        const current = methodsMap.get(a.paymentMethod) || { count: 0, amount: 0 };
        methodsMap.set(a.paymentMethod, {
          count: current.count + 1,
          amount: current.amount + (a.totalAmount || 0)
        });
      }
    });

    const paymentMethodsData = Array.from(methodsMap.entries())
      .map(([method, data]) => ({ method, count: data.count, amount: data.amount }));
    this.paymentMethods.set(paymentMethodsData);
  }

  private calculateDailyStats(appointments: any[]): void {
    const dailyMap = new Map<string, { appointments: number; revenue: number }>();

    appointments.forEach((a: any) => {
      if (a.date) {
        const dateStr = new Date(a.date).toISOString().split('T')[0];
        const current = dailyMap.get(dateStr) || { appointments: 0, revenue: 0 };
        dailyMap.set(dateStr, {
          appointments: current.appointments + 1,
          revenue: current.revenue + (a.status === 'completed' ? (a.totalAmount || 0) : 0)
        });
      }
    });

    const dailyStatsData = Array.from(dailyMap.entries())
      .map(([date, stats]) => ({ date, appointments: stats.appointments, revenue: stats.revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));

    this.dailyStats.set(dailyStatsData);
  }

  private calculateAdditionalAnalytics(completed: any[]): void {
    // Average duration (assuming 30 minutes per appointment if not specified)
    const durations = completed.map((a: any) => a.duration || 30);
    const avgDuration = durations.length > 0
      ? durations.reduce((sum, d) => sum + d, 0) / durations.length
      : 0;
    this.averageDuration.set(avgDuration);

    // Utilization rate (assuming 8 hour workday = 480 minutes)
    const dates = this.selectedDates();
    if (dates.from && dates.to) {
      const daysDiff = Math.ceil((dates.to.getTime() - dates.from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const totalWorkMinutes = daysDiff * 480; // 8 hours per day
      const totalAppointmentMinutes = completed.reduce((sum, a) => sum + (a.duration || 30), 0);
      const utilization = totalWorkMinutes > 0 ? (totalAppointmentMinutes / totalWorkMinutes) * 100 : 0;
      this.utilizationRate.set(utilization);
    }
  }

  toggleTimelineView(): void {
    this.showAllTimeline.set(!this.showAllTimeline());
  }

  getDisplayedTimeline() {
    const timeline = this.dailyStats();
    if (this.showAllTimeline() || timeline.length <= 4) {
      return timeline;
    }
    return timeline.slice(0, 4);
  }
}
