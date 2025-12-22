import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { LucideAngularModule, ArrowLeft, User, Phone, Calendar } from 'lucide-angular';
import { AnalyticsService } from '@features/analytics/service/analytics.service';
import { DebtorModel } from '@features/analytics/models/debtor.model';
import { PhoneFormatPipe } from '@core/pipes/phone-format.pipe';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-debtors',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoPipe,
    LucideAngularModule,
    PhoneFormatPipe,
    NgxSkeletonLoaderModule
  ],
  templateUrl: './debtors.component.html',
  styleUrls: ['./debtors.component.scss']
})
export class DebtorsComponent {
  private analyticsService = inject(AnalyticsService);
  private router = inject(Router);

  protected readonly ArrowLeft = ArrowLeft;
  protected readonly User = User;
  protected readonly Phone = Phone;
  protected readonly Calendar = Calendar;

  debtors = signal<DebtorModel[]>([]);
  isLoading = signal(true);
  totalDebt = signal(0);

  constructor() {
    this.loadDebtors();
  }

  loadDebtors(): void {
    this.isLoading.set(true);
    this.analyticsService.getDebtors().subscribe({
      next: (response) => {
        this.debtors.set(response.data);
        this.totalDebt.set(response.data.reduce((sum, debtor) => sum + debtor.totalDebt, 0));
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/analytics']);
  }

  navigateToPatient(patientId: number): void {
    this.router.navigate(['/patients', patientId]);
  }

  getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
}
