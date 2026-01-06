import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentModel, DocumentTypeModel } from '@core/models/document.model';

interface PatientDocument extends DocumentModel {
  document_type?: DocumentTypeModel;
  file_name: string;
  created_at: string;
}

@Component({
  selector: 'app-my-documents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-documents.component.html',
  styleUrls: ['./my-documents.component.scss']
})
export class MyDocumentsComponent implements OnInit {
  documents = signal<PatientDocument[]>([]);
  loading = signal(false);
  filterType = signal<string>('all');

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments() {
    this.loading.set(true);
    setTimeout(() => {
      const mockDocuments: PatientDocument[] = [
        {
          id: 1,
          patientId: 1,
          title: 'Blood Test Results',
          file_name: 'blood-test-march-2024.pdf',
          description: 'Complete blood count results',
          fileUrl: '',
          fileSize: '245 KB',
          status: 'active',
          documentTypeId: 1,
          document_type: { id: 1, name: 'Lab Results', createdAt: '', updatedAt: '' },
          created_at: '2024-03-15T10:30:00',
          createdAt: '2024-03-15T10:30:00',
          updatedAt: '2024-03-15T10:30:00'
        },
        {
          id: 2,
          patientId: 1,
          title: 'X-Ray Chest',
          file_name: 'xray-chest-2024.jpg',
          description: 'Chest X-ray scan',
          fileUrl: '',
          fileSize: '1.2 MB',
          status: 'active',
          documentTypeId: 2,
          document_type: { id: 2, name: 'Imaging', createdAt: '', updatedAt: '' },
          created_at: '2024-02-20T14:15:00',
          createdAt: '2024-02-20T14:15:00',
          updatedAt: '2024-02-20T14:15:00'
        },
        {
          id: 3,
          patientId: 1,
          title: 'Prescription Record',
          file_name: 'prescription-jan-2024.pdf',
          description: 'Monthly prescription',
          fileUrl: '',
          fileSize: '180 KB',
          status: 'active',
          documentTypeId: 3,
          document_type: { id: 3, name: 'Prescription', createdAt: '', updatedAt: '' },
          created_at: '2024-01-10T09:00:00',
          createdAt: '2024-01-10T09:00:00',
          updatedAt: '2024-01-10T09:00:00'
        }
      ];
      this.documents.set(mockDocuments);
      this.loading.set(false);
    }, 500);
  }

  get filteredDocuments(): PatientDocument[] {
    if (this.filterType() === 'all') {
      return this.documents();
    }
    return this.documents().filter(doc => doc.document_type?.name === this.filterType());
  }

  get documentTypes(): string[] {
    const types = this.documents().map(doc => doc.document_type?.name || 'Other');
    return ['all', ...Array.from(new Set(types))];
  }

  setFilterType(type: string) {
    this.filterType.set(type);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z';
      default:
        return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
    }
  }

  downloadDocument(document: PatientDocument) {
    console.log('Downloading document:', document.file_name);
  }

  viewDocument(document: PatientDocument) {
    console.log('Viewing document:', document.file_name);
  }
}
