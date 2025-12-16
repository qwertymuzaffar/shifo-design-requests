import { Component, inject, input } from '@angular/core';
import { StatCardComponent } from 'app/components/stat-card/stat-card.component';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  Activity,
  Calendar,
  CircleAlert,
  CreditCard,
  DollarSign,
  FileText,
  LucideAngularModule,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-angular';
import { AnalyticsResponse } from '@features/analytics/models/analytics.models';
import { DoctorListResponse } from '@features/doctor/models/doctor';
import { rxResource } from '@angular/core/rxjs-interop';
import { BalancesService } from '@core/services/balances.service';
import { DatePipe } from '@angular/common';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-analytics-stats',
  standalone: true,
  imports: [StatCardComponent, TranslocoPipe, LucideAngularModule],
  templateUrl: './analytics-stats.component.html',
  styleUrl: './analytics-stats.component.scss',
  providers: [DatePipe],
})
export class AnalyticsStatsComponent {
  analyticsData = input<AnalyticsResponse | null>(null);
  doctorData = input<DoctorListResponse | null>(null);

  protected readonly Activity = Activity;
  protected readonly TrendingUp = TrendingUp;
  protected readonly Users = Users;
  protected readonly DollarSign = DollarSign;
  protected readonly Calendar = Calendar;
  protected readonly TrendingDown = TrendingDown;
  protected readonly CreditCard = CreditCard;
  protected readonly FileText = FileText;
  protected readonly CircleAlert = CircleAlert;
  protected readonly Wallet = Wallet;
  private balancesService = inject(BalancesService);
  private datePipe = inject(DatePipe);
  filter = input<{
    from: Date | null;
    to: Date | null;
    filterByAppointmentDate?: boolean;
  }>({
    from: null,
    to: null,
    filterByAppointmentDate: true,
  });

  balancesSummary = rxResource({
    params: () => this.filter(),
    stream: ({ params }) => {
      return this.balancesService.getBalanceSummary({
        ...(params.from && {
          dateFrom: this.datePipe.transform(params.from, 'yyyy-MM-dd'),
        }),
        ...(params.to && {
          dateTo: this.datePipe.transform(params.to, 'yyyy-MM-dd'),
        }),
        filterByAppointmentDate: params.filterByAppointmentDate,
      });
    },
  });

  financialDetails = rxResource({
    params: () => this.filter(),
    stream: ({ params }) => {
      return this.balancesService
        .getFinancialDetails({
          ...(params.from && {
            dateFrom: this.datePipe.transform(params.from, 'yyyy-MM-dd'),
          }),
          ...(params.to && {
            dateTo: this.datePipe.transform(params.to, 'yyyy-MM-dd'),
          }),
        })
        .pipe(tap((data) => console.log('Financial Details Data:', data)));
    },
  });
}
