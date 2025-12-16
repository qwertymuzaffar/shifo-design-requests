import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { LucideAngularModule, X, Check, Ban, Trash2, Edit, ChevronRight } from 'lucide-angular';
import { DatePipe } from '@angular/common';
import { PatientRequestService } from '../../services/patient-request.service';
import { PatientRequest } from '../../models/patient-request.model';
import { ToastService } from '@core/services/toast.service';
import { finalize, first } from 'rxjs';
import { ConfirmDialogComponent } from '@shared/confirm-dialog/confirm-dialog.component';
import { PatientRequestDetailComponent } from './patient-request-detail.component';

@Component({
  selector: 'app-patient-requests-dialog',
  imports: [
    MatDialogModule,
    TranslocoPipe,
    LucideAngularModule,
    DatePipe,
  ],
  template: `
    <div class="flex flex-col h-full max-h-[80vh]">
      <div class="flex items-center justify-between p-4 border-b">
        <h2 class="text-xl font-semibold text-gray-900">
          {{ 'patientRequests.title' | transloco }}
        </h2>
        <button
          type="button"
          (click)="close()"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <lucide-icon [img]="XIcon" [size]="24"></lucide-icon>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4">
        @if (isLoading()) {
          <div class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
          </div>
        } @else if (requests().length === 0) {
          <div class="text-center py-12">
            <p class="text-gray-500">{{ 'patientRequests.no_requests' | transloco }}</p>
          </div>
        } @else {
          <div class="space-y-3">
            @for (request of requests(); track request.id) {
              <div class="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between mb-2">
                  <div class="flex-1">
                    <h3 class="font-semibold text-gray-900">{{ request.fullName }}</h3>
                    <p class="text-sm text-gray-600">{{ request.phone }}</p>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ 'patientRequests.birth_date' | transloco }}: {{ request.birthDate }}
                    </p>
                  </div>
                  <span
                    class="px-2 py-1 text-xs font-medium rounded"
                    [class]="getStatusClass(request.status)"
                  >
                    {{ 'patientRequests.status.' + request.status | transloco }}
                  </span>
                </div>

                @if (request.status === 'pending') {
                  <div class="flex gap-2 mt-3 flex-wrap">
                    <button
                      type="button"
                      (click)="viewDetails(request)"
                      class="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                    >
                      <lucide-icon [img]="ChevronRightIcon" [size]="16"></lucide-icon>
                      {{ 'patientRequests.view_details' | transloco }}
                    </button>
                    <button
                      type="button"
                      (click)="approveRequest(request)"
                      class="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                    >
                      <lucide-icon [img]="CheckIcon" [size]="16"></lucide-icon>
                      {{ 'patientRequests.approve' | transloco }}
                    </button>
                    <button
                      type="button"
                      (click)="rejectRequest(request)"
                      class="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                    >
                      <lucide-icon [img]="BanIcon" [size]="16"></lucide-icon>
                      {{ 'patientRequests.reject' | transloco }}
                    </button>
                    <button
                      type="button"
                      (click)="deleteRequest(request)"
                      class="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition-colors"
                    >
                      <lucide-icon [img]="Trash2Icon" [size]="16"></lucide-icon>
                      {{ 'patientRequests.delete' | transloco }}
                    </button>
                  </div>
                } @else {
                  <div class="mt-3 text-sm text-gray-500">
                    <p class="text-xs">
                      {{ 'patientRequests.processed_at' | transloco }}: {{ request.updatedAt | date:'short' }}
                    </p>
                    @if (request.reviewNotes) {
                      <p class="mt-1 text-xs">
                        {{ 'patientRequests.notes' | transloco }}: {{ request.reviewNotes }}
                      </p>
                    }
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>

      <div class="flex items-center justify-between p-4 border-t">
        <div class="text-sm text-gray-600">
          {{ 'patientRequests.total' | transloco }}: {{ requests().length }}
        </div>
        <button
          type="button"
          (click)="close()"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
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
export class PatientRequestsDialogComponent implements OnInit {
  readonly XIcon = X;
  readonly CheckIcon = Check;
  readonly BanIcon = Ban;
  readonly Trash2Icon = Trash2;
  readonly EditIcon = Edit;
  readonly ChevronRightIcon = ChevronRight;

  private dialogRef = inject(MatDialogRef<PatientRequestsDialogComponent>);
  private requestService = inject(PatientRequestService);
  private toastService = inject(ToastService);
  private transloco = inject(TranslocoService);
  private dialog = inject(MatDialog);

  readonly isLoading = signal<boolean>(false);
  readonly requests = signal<PatientRequest[]>([]);

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading.set(true);
    this.requestService.getRequests({ limit: 100 })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => {
          this.requests.set(data.items || []);
        },
        error: (error) => {
          console.error('Error loading patient requests:', error);
          this.toastService.openToast(
            this.transloco.translate('patientRequests.error_loading'),
            this.transloco.translate('app-dialog.error'),
            'error'
          );
        }
      });
  }

  viewDetails(request: PatientRequest): void {
    const dialogRef = this.dialog.open(PatientRequestDetailComponent, {
      width: '600px',
      data: { request }
    });

    dialogRef.afterClosed()
      .pipe(first())
      .subscribe((result) => {
        if (result) {
          this.loadRequests();
        }
      });
  }

  approveRequest(request: PatientRequest): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        message: this.transloco.translate('patientRequests.confirm_approve'),
        action: () => this.requestService.approveRequest(request.id)
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
          this.loadRequests();
        }
      });
  }

  rejectRequest(request: PatientRequest): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        message: this.transloco.translate('patientRequests.confirm_reject'),
        action: () => this.requestService.rejectRequest(request.id)
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
          this.loadRequests();
        }
      });
  }

  deleteRequest(request: PatientRequest): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        message: this.transloco.translate('patientRequests.confirm_delete'),
        action: () => this.requestService.deleteRequest(request.id)
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
          this.loadRequests();
        }
      });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
