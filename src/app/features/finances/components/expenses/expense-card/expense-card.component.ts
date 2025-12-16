import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { TransactionsModel } from '@core/models/transactions.model';
import { LucideAngularModule, SquarePen } from 'lucide-angular';

@Component({
  selector: 'app-expense-card',
  imports: [TranslocoPipe, LucideAngularModule],
  templateUrl: './expense-card.component.html',
  styleUrl: './expense-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseCardComponent {
  expense = input.required<TransactionsModel>();
  onCardClick = output<void>();
  onEdit = output<void>();
  readonly SquarePen = SquarePen;

  getPaymentMethodIcon(paymentMethod: string): string {
    switch (paymentMethod) {
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

