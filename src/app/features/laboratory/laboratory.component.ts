import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, FlaskConical, Plus, Search, Filter, Download } from 'lucide-angular';
import { LaboratoryService } from '@core/services/laboratory.service';
import { LabOrder } from '@core/models/laboratory.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-laboratory',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './laboratory.component.html',
  styleUrl: './laboratory.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaboratoryComponent {
  private laboratoryService = inject(LaboratoryService);

  protected readonly FlaskConical = FlaskConical;
  protected readonly Plus = Plus;
  protected readonly Search = Search;
  protected readonly Filter = Filter;
  protected readonly Download = Download;

  orders = signal<LabOrder[]>([]);
  isLoading = signal(true);
  searchQuery = signal('');
  selectedStatus = signal('all');

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading.set(true);
    this.laboratoryService.getLabOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      collected: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pending',
      collected: 'Collected',
      processing: 'Processing',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    return labels[status] || status;
  }
}
