import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TransactionCategoriesService } from '@core/services/transaction-categories.service';
import { ToastService } from '@core/services/toast.service';
import { FormFieldComponent } from '@shared/controls';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-quick-add-category-dialog',
  imports: [
    FormFieldComponent,
    ReactiveFormsModule,
    CommonModule,
    TranslocoPipe
  ],
  templateUrl: './quick-add-category-dialog.component.html',
  styleUrl: './quick-add-category-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickAddCategoryDialogComponent {
  private transactionCategoryService = inject(TransactionCategoriesService);
  private translocoService = inject(TranslocoService);
  private toastService = inject(ToastService);
  private matDialogRef = inject(MatDialogRef<QuickAddCategoryDialogComponent>);

  isLoading = signal(false);

  form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    description: new FormControl('', { nonNullable: true }),
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const values = this.form.getRawValue();

    const payload = {
      ...values,
      type: 'expense',
    };

    this.transactionCategoryService
      .createCategory(payload)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (category) => {
          this.toastService.openToast(
            '',
            this.translocoService.translate('finance.expens.category_created')
          );
          this.matDialogRef.close(category);
        },
        error: () => {
          this.toastService.openToast(
            this.translocoService.translate('finance.expens.error'),
            this.translocoService.translate(
              'finance.expens.category_create_error'
            ),
            'error'
          );
        },
      });
  }

  onClose() {
    this.matDialogRef.close();
  }
}
