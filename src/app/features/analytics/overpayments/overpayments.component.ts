import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { LucideAngularModule, ArrowLeft, User, Calendar } from 'lucide-angular';
import { AnalyticsService } from '@features/analytics/service/analytics.service';
import { OverpaymentModel } from '@features/analytics/models/overpayment.model';
import { PhoneFormatPipe } from '@core/pipes/phone-format.pipe';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-overpayments',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoPipe,
    LucideAngularModule,
    PhoneFormatPipe,
    NgxSkeletonLoaderModule
  ],
  templateUrl: './overpayments.component.html',
  styleUrls: ['./overpayments.component.scss']
})
export class OverpaymentsComponent {
  private analyticsService = inject(AnalyticsService);
  private router = inject(Router);

  protected readonly ArrowLeft = ArrowLeft;
  protected readonly User = User;
  protected readonly Calendar = Calendar;

  overpayments = signal<OverpaymentModel[]>([]);
  isLoading = signal(true);
  totalOverpayment = signal(0);

  constructor() {
    this.loadOverpayments();
  }

  loadOverpayments(): void {
    this.isLoading.set(true);
    this.analyticsService.getOverpayments().subscribe({
      next: (response) => {
        this.overpayments.set(response.data);
        this.totalOverpayment.set(response.data.reduce((sum, overpayment) => sum + overpayment.totalOverpayment, 0));
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
