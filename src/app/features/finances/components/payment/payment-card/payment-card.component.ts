import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PhoneFormatPipe } from '@core/pipes/phone-format.pipe';
import { TranslocoPipe } from '@jsverse/transloco';
import { Daum } from '../models/payment.models';
import { PaymentType } from '@core/models/payment.model';

@Component({
  selector: 'app-payment-card',
  imports: [DatePipe, PhoneFormatPipe, TranslocoPipe],
  templateUrl: './payment-card.component.html',
  styleUrl: './payment-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentCardComponent {
  payment = input.required<Daum>();
  onCardClick = output<void>();
  protected readonly PaymentType = PaymentType;

  getPaymentMethodIcon(paymentType: string): string {
    switch (paymentType) {
      case 'dc':
        return 'assets/icons/dushanbe-city.svg';
      case 'alif':
        return 'assets/icons/alif.svg';
      case 'eskhata':
        return 'assets/icons/eskhata.svg';
      case 'cash':
        return 'assets/icons/cash.svg';
      default:
        return 'assets/icons/cash.svg';
    }
  }
}

