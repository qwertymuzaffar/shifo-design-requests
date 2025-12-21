import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatDialog } from '@angular/material/dialog';
import { PaymentService } from '@core/services/payment.service';
import { PatientService } from '@features/patients/services/patient.service';
import { PaymentInterface, PaymentStatusEnum, PaymentMethodType, PaymentType } from '@core/models/payment.model';
import { ToastService } from '@core/services/toast.service';
import { PaymentDetailsDialogComponent } from './payment-details-dialog/payment-details-dialog.component';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, TranslocoPipe],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private patientService = inject(PatientService);
  private dialog = inject(MatDialog);
  private toastService = inject(ToastService);

  payments = signal<PaymentInterface[]>([]);
  loading = signal(true);
  patientId = signal<number | null>(null);
  sortColumn = signal<'date' | 'amount'>('date');
  sortDirection = signal<'asc' | 'desc'>('desc');

  PaymentStatusEnum = PaymentStatusEnum;
  PaymentMethodType = PaymentMethodType;
  PaymentType = PaymentType;

  ngOnInit(): void {
    this.patientService.patientMedicalCardInfo$.subscribe((info) => {
      if (info.data?.patient?.id) {
        this.patientId.set(info.data.patient.id);
        this.loadPayments(info.data.patient.id);
      }
    });
  }

  loadPayments(patientId: number): void {
    this.loading.set(true);
    this.paymentService.getPaymentsByPatientId(patientId).subscribe({
      next: (payments) => {
        this.payments.set(payments);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.toastService.openToast('Failed to load payments', 'Error', 'error');
        this.loading.set(false);
      }
    });
  }

  openPaymentDetails(payment: PaymentInterface): void {
    this.dialog.open(PaymentDetailsDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: payment
    });
  }

  sort(column: 'date' | 'amount'): void {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('desc');
    }

    const sorted = [...this.payments()].sort((a, b) => {
      let comparison = 0;
      if (column === 'date') {
        const dateA = new Date(a.paidAt || a.createdAt).getTime();
        const dateB = new Date(b.paidAt || b.createdAt).getTime();
        comparison = dateA - dateB;
      } else {
        comparison = parseFloat(a.amount) - parseFloat(b.amount);
      }
      return this.sortDirection() === 'asc' ? comparison : -comparison;
    });

    this.payments.set(sorted);
  }

  getStatusColor(status: PaymentStatusEnum): string {
    switch (status) {
      case PaymentStatusEnum.PAID:
        return 'text-green-600 bg-green-50';
      case PaymentStatusEnum.PENDING:
        return 'text-yellow-600 bg-yellow-50';
      case PaymentStatusEnum.FAILED:
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  }

  getPaymentMethodLabel(method: PaymentMethodType): string {
    const labels: Record<PaymentMethodType, string> = {
      [PaymentMethodType.CASH]: 'Cash',
      [PaymentMethodType.DC]: 'Card',
      [PaymentMethodType.ESKHATA]: 'Eskhata',
      [PaymentMethodType.ALIF]: 'Alif'
    };
    return labels[method] || method;
  }

  getPaymentTypeLabel(type?: PaymentType): string {
    if (!type) return 'Full Payment';
    const labels: Record<PaymentType, string> = {
      [PaymentType.Payment]: 'Full Payment',
      [PaymentType.Prepayment]: 'Prepayment',
      [PaymentType.Debt]: 'Debt',
      [PaymentType.DebtPayment]: 'Debt Payment',
      [PaymentType.BalanceDeduction]: 'Balance Deduction'
    };
    return labels[type] || type;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
