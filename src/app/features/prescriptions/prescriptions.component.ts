import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Pill, Plus, Search, Download } from 'lucide-angular';
import { PrescriptionService } from '@core/services/prescription.service';
import { Prescription } from '@core/models/prescription.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prescriptions',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './prescriptions.component.html',
  styleUrl: './prescriptions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrescriptionsComponent {
  private prescriptionService = inject(PrescriptionService);

  protected readonly Pill = Pill;
  protected readonly Plus = Plus;
  protected readonly Search = Search;
  protected readonly Download = Download;

  prescriptions = signal<Prescription[]>([]);
  isLoading = signal(true);
  searchQuery = signal('');
  selectedStatus = signal('all');

  ngOnInit() {
    this.loadPrescriptions();
  }

  loadPrescriptions() {
    this.isLoading.set(true);
    this.prescriptionService.getPrescriptions().subscribe({
      next: (prescriptions) => {
        this.prescriptions.set(prescriptions);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }
}
