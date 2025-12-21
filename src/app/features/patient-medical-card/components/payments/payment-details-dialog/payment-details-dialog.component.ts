import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslocoPipe } from '@jsverse/transloco';
import { PaymentInterface, PaymentStatusEnum, PaymentMethodType, PaymentType } from '@core/models/payment.model';

@Component({
  selector: 'app-payment-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TranslocoPipe],
  templateUrl: './payment-details-dialog.component.html',
  styleUrl: './payment-details-dialog.component.css'
})
export class PaymentDetailsDialogComponent {
  dialogRef = inject(MatDialogRef<PaymentDetailsDialogComponent>);
  payment: PaymentInterface = inject(MAT_DIALOG_DATA);

  PaymentStatusEnum = PaymentStatusEnum;
  PaymentMethodType = PaymentMethodType;
  PaymentType = PaymentType;

  close(): void {
    this.dialogRef.close();
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  isPrepayment(): boolean {
    return this.payment.paymentKind === PaymentType.Prepayment;
  }
}
