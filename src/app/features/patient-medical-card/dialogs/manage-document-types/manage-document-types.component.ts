import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DocumentTypeModel } from '@core/models/document.model';
import { DocumentService } from '@core/services/document.service';
import { ToastService } from '@core/services/toast.service';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { LucideAngularModule, Plus, Trash2 } from 'lucide-angular';
import { first } from 'rxjs';

@Component({
  selector: 'app-manage-document-types',
  standalone: true,
  imports: [ReactiveFormsModule, TranslocoPipe, LucideAngularModule],
  templateUrl: './manage-document-types.component.html',
  styleUrl: './manage-document-types.component.scss',
})
export class ManageDocumentTypesComponent {
  private dialogRef = inject(MatDialogRef<ManageDocumentTypesComponent>);
  private documentService = inject(DocumentService);
  private toastService = inject(ToastService);
  private translocoService = inject(TranslocoService);

  protected readonly Plus = Plus;
  protected readonly Trash2 = Trash2;

  documentTypes = signal<DocumentTypeModel[]>([]);
  isLoading = signal(false);
  isDeleting = signal<number | null>(null);
  newTypeName = new FormControl('', [Validators.required, Validators.minLength(2)]);

  constructor() {
    this.loadDocumentTypes();
  }

  loadDocumentTypes(): void {
    this.isLoading.set(true);
    this.documentService
      .getDocumentTypes()
      .pipe(first())
      .subscribe({
        next: (types) => {
          this.documentTypes.set(types);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.toastService.openToast(
            this.translocoService.translate('documentTypes.error'),
            this.translocoService.translate('documentTypes.loadError'),
            'error'
          );
        },
      });
  }

  addDocumentType(): void {
    if (this.newTypeName.invalid || this.isLoading()) return;

    const typeName = this.newTypeName.value?.trim();
    if (!typeName) return;

    this.isLoading.set(true);
    this.documentService
      .addDocumentType(typeName)
      .pipe(first())
      .subscribe({
        next: (newType) => {
          this.documentTypes.update((types) => [...types, newType]);
          this.newTypeName.reset();
          this.isLoading.set(false);
          this.toastService.openToast(
            '',
            this.translocoService.translate('documentTypes.addSuccess')
          );
        },
        error: () => {
          this.isLoading.set(false);
          this.toastService.openToast(
            this.translocoService.translate('documentTypes.error'),
            this.translocoService.translate('documentTypes.addError'),
            'error'
          );
        },
      });
  }

  deleteDocumentType(typeId: number): void {
    if (this.isDeleting()) return;

    this.isDeleting.set(typeId);
    this.documentService
      .deleteDocumentType(typeId)
      .pipe(first())
      .subscribe({
        next: () => {
          this.documentTypes.update((types) =>
            types.filter((type) => type.id !== typeId)
          );
          this.isDeleting.set(null);
          this.toastService.openToast(
            '',
            this.translocoService.translate('documentTypes.deleteSuccess')
          );
        },
        error: () => {
          this.isDeleting.set(null);
          this.toastService.openToast(
            this.translocoService.translate('documentTypes.error'),
            this.translocoService.translate('documentTypes.deleteError'),
            'error'
          );
        },
      });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
