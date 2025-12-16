import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { LucideAngularModule, X, Save, Check, Ban, Trash2 } from 'lucide-angular';
import { DatePipe } from '@angular/common';
import { PatientRequest } from '../../models/patient-request.model';
import { PatientRequestService } from '../../services/patient-request.service';
import { ToastService } from '@core/services/toast.service';
import { FormFieldComponent } from '@shared/controls';
import { NgxMaskDirective } from 'ngx-mask';
import { finalize, first } from 'rxjs';
import { ConfirmDialogComponent } from '@shared/confirm-dialog/confirm-dialog.component';
import { nameValidator } from '@core/validators/name.validator';

interface DialogData {
  request: PatientRequest;
}

@Component({
  selector: 'app-patient-request-detail',
  imports: [
    MatDialogModule,
    TranslocoPipe,
    LucideAngularModule,
    ReactiveFormsModule,
    FormFieldComponent,
    NgxMaskDirective,
    DatePipe,
  ],
  template: `
    <div class="flex flex-col max-h-[85vh]">
      <div class="flex items-center justify-between p-4 border-b">
        <h2 class="text-xl font-semibold text-gray-900">
          {{ 'patientRequests.request_details' | transloco }}
        </h2>
        <button
          type="button"
          (click)="close()"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <lucide-icon [img]="XIcon" [size]="24"></lucide-icon>
        </button>
      </div>

      <form [formGroup]="form" class="flex-1 overflow-y-auto p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <app-form-field
            label="{{ 'patientForm.fullName' | transloco }}"
            [control]="form.controls['fullName']"
          >
            <input type="text" formControlName="fullName" />
          </app-form-field>

          <app-form-field
            label="{{ 'patientForm.birthDate' | transloco }}"
            [control]="form.controls['birthDate']"
          >
            <input type="date" formControlName="birthDate" lang="en"/>
          </app-form-field>

          <app-form-field
            label="{{ 'patientForm.phone' | transloco }}"
            [control]="form.controls['phone']"
          >
            <input
              [showMaskTyped]="true"
              prefix="+992"
              mask=" 00 000 00 00"
              type="text"
              formControlName="phone"
            />
          </app-form-field>

          <app-form-field
            label="{{ 'patientForm.address' | transloco }}"
            [control]="form.controls['address']"
          >
            <input type="text" maxlength="60" formControlName="address" />
          </app-form-field>

          <app-form-field
            label="{{ 'patientForm.emergencyContact' | transloco }}"
            [control]="form.controls['emergencyContact']"
          >
            <input
              [showMaskTyped]="true"
              prefix="+992"
              mask=" 00 000 00 00"
              type="text"
              formControlName="emergencyContact"
            />
          </app-form-field>

          <app-form-field
            label="{{ 'patientForm.phoneInsurance' | transloco }}"
            [control]="form.controls['phoneInsurance']"
          >
            <input type="text" formControlName="phoneInsurance" />
          </app-form-field>

          <app-form-field
            label="{{ 'patientForm.allergies' | transloco }}"
            [control]="form.controls['allergies']"
            class="md:col-span-2"
          >
            <input type="text" maxlength="60" formControlName="allergies" />
          </app-form-field>

          <app-form-field
            label="{{ 'patientForm.medicalHistory' | transloco }}"
            [control]="form.controls['medicalHistory']"
            class="md:col-span-2"
          >
            <textarea formControlName="medicalHistory" rows="3"></textarea>
          </app-form-field>
        </div>

        @if (request.telegramUserId) {
          <div class="mt-4 p-3 bg-blue-50 rounded-lg">
            <p class="text-sm text-blue-800">
              <span class="font-medium">{{ 'patientRequests.telegram_id' | transloco }}:</span>
              {{ request.telegramUserId }}
            </p>
          </div>
        }

        <div class="mt-4 p-3 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-600">
            <span class="font-medium">{{ 'patientRequests.created_at' | transloco }}:</span>
            {{ request.createdAt | date:'medium' }}
          </p>
        </div>
      </form>

      <div class="flex gap-2 p-4 border-t flex-wrap">
        @if (request.status === 'pending') {
          <button
            type="button"
            (click)="saveAndApprove()"
            [disabled]="isLoading()"
            class="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <lucide-icon [img]="CheckIcon" [size]="18"></lucide-icon>
            {{ 'patientRequests.save_and_approve' | transloco }}
          </button>
          <button
            type="button"
            (click)="saveChanges()"
            [disabled]="isLoading() || !form.dirty"
            class="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <lucide-icon [img]="SaveIcon" [size]="18"></lucide-icon>
            {{ 'patientRequests.save_changes' | transloco }}
          </button>
          <button
            type="button"
            (click)="rejectRequest()"
            [disabled]="isLoading()"
            class="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <lucide-icon [img]="BanIcon" [size]="18"></lucide-icon>
            {{ 'patientRequests.reject' | transloco }}
          </button>
          <button
            type="button"
            (click)="deleteRequest()"
            [disabled]="isLoading()"
            class="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <lucide-icon [img]="Trash2Icon" [size]="18"></lucide-icon>
            {{ 'patientRequests.delete' | transloco }}
          </button>
        }
        <button
          type="button"
          (click)="close()"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ml-auto"
        >
          {{ 'patientRequests.close' | transloco }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class PatientRequestDetailComponent implements OnInit {
  readonly XIcon = X;
  readonly SaveIcon = Save;
  readonly CheckIcon = Check;
  readonly BanIcon = Ban;
  readonly Trash2Icon = Trash2;

  private dialogRef = inject(MatDialogRef<PatientRequestDetailComponent>);
  private data = inject<DialogData>(MAT_DIALOG_DATA);
  private requestService = inject(PatientRequestService);
  private toastService = inject(ToastService);
  private transloco = inject(TranslocoService);
  private dialog = inject(MatDialog);

  readonly isLoading = signal<boolean>(false);
  request!: PatientRequest;

  form = new FormGroup({
    fullName: new FormControl('', [Validators.required, nameValidator()]),
    phone: new FormControl('', [Validators.required]),
    birthDate: new FormControl('', [Validators.required]),
    address: new FormControl(''),
    emergencyContact: new FormControl(''),
    allergies: new FormControl(''),
    medicalHistory: new FormControl(''),
    phoneInsurance: new FormControl(''),
  });

  ngOnInit(): void {
    this.request = this.data.request;
    this.form.patchValue({
      fullName: this.request.fullName,
      phone: this.request.phone,
      birthDate: this.request.birthDate,
      address: this.request.address || '',
      emergencyContact: this.request.emergencyContact || '',
      allergies: this.request.allergies || '',
      medicalHistory: this.request.medicalHistory || '',
      phoneInsurance: this.request.phoneInsurance || '',
    });
  }

  saveChanges(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const formValue = this.form.getRawValue();

    this.requestService.updateRequest(this.request.id, {
      fullName: formValue.fullName!,
      phone: formValue.phone!,
      birthDate: formValue.birthDate!,
      address: formValue.address || undefined,
      emergencyContact: formValue.emergencyContact || undefined,
      allergies: formValue.allergies || undefined,
      medicalHistory: formValue.medicalHistory || undefined,
      phoneInsurance: formValue.phoneInsurance || undefined,
    })
    .pipe(finalize(() => this.isLoading.set(false)))
    .subscribe({
      next: () => {
        this.toastService.openToast(
          this.transloco.translate('patientRequests.changes_saved'),
          this.transloco.translate('patientRequests.success')
        );
        this.form.markAsPristine();
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error updating request:', error);
        this.toastService.openToast(
          this.transloco.translate('patientRequests.error_updating'),
          this.transloco.translate('app-dialog.error'),
          'error'
        );
      }
    });
  }

  saveAndApprove(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.dirty) {
      this.isLoading.set(true);
      const formValue = this.form.getRawValue();

      this.requestService.updateRequest(this.request.id, {
        fullName: formValue.fullName!,
        phone: formValue.phone!,
        birthDate: formValue.birthDate!,
        address: formValue.address || undefined,
        emergencyContact: formValue.emergencyContact || undefined,
        allergies: formValue.allergies || undefined,
        medicalHistory: formValue.medicalHistory || undefined,
        phoneInsurance: formValue.phoneInsurance || undefined,
      })
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: () => {
          this.approveRequest();
        },
        error: (error) => {
          console.error('Error updating request:', error);
          this.toastService.openToast(
            this.transloco.translate('patientRequests.error_updating'),
            this.transloco.translate('app-dialog.error'),
            'error'
          );
        }
      });
    } else {
      this.approveRequest();
    }
  }

  approveRequest(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        message: this.transloco.translate('patientRequests.confirm_approve'),
        action: () => this.requestService.approveRequest(this.request.id)
      }
    });

    dialogRef.afterClosed()
      .pipe(first())
      .subscribe((result) => {
        if (result) {
          this.toastService.openToast(
            this.transloco.translate('patientRequests.approved'),
            this.transloco.translate('patientRequests.success')
          );
          this.dialogRef.close(true);
        }
      });
  }

  rejectRequest(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        message: this.transloco.translate('patientRequests.confirm_reject'),
        action: () => this.requestService.rejectRequest(this.request.id)
      }
    });

    dialogRef.afterClosed()
      .pipe(first())
      .subscribe((result) => {
        if (result) {
          this.toastService.openToast(
            this.transloco.translate('patientRequests.rejected'),
            this.transloco.translate('patientRequests.success')
          );
          this.dialogRef.close(true);
        }
      });
  }

  deleteRequest(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        message: this.transloco.translate('patientRequests.confirm_delete'),
        action: () => this.requestService.deleteRequest(this.request.id)
      }
    });

    dialogRef.afterClosed()
      .pipe(first())
      .subscribe((result) => {
        if (result) {
          this.toastService.openToast(
            this.transloco.translate('patientRequests.deleted'),
            this.transloco.translate('patientRequests.success')
          );
          this.dialogRef.close(true);
        }
      });
  }

  close(): void {
    if (this.form.dirty) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: {
          message: this.transloco.translate('patientRequests.unsaved_changes'),
          action: () => Promise.resolve()
        }
      });

      dialogRef.afterClosed()
        .pipe(first())
        .subscribe((result) => {
          if (result) {
            this.dialogRef.close();
          }
        });
    } else {
      this.dialogRef.close();
    }
  }
}
