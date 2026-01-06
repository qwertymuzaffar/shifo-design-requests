import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Package, Plus, Search, AlertTriangle, Download } from 'lucide-angular';
import { InventoryService } from '@core/services/inventory.service';
import { InventoryItem, InventoryAlert } from '@core/models/inventory.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryComponent {
  private inventoryService = inject(InventoryService);

  protected readonly Package = Package;
  protected readonly Plus = Plus;
  protected readonly Search = Search;
  protected readonly AlertTriangle = AlertTriangle;
  protected readonly Download = Download;

  items = signal<InventoryItem[]>([]);
  alerts = signal<InventoryAlert[]>([]);
  isLoading = signal(true);
  searchQuery = signal('');

  ngOnInit() {
    this.loadInventory();
    this.loadAlerts();
  }

  loadInventory() {
    this.isLoading.set(true);
    this.inventoryService.getItems().subscribe({
      next: (items) => {
        this.items.set(items);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  loadAlerts() {
    this.inventoryService.getAlerts(false).subscribe({
      next: (alerts) => {
        this.alerts.set(alerts);
      }
    });
  }

  getStockStatus(item: InventoryItem): string {
    const totalQty = item.stock?.reduce((sum, s) => sum + s.quantity, 0) || 0;
    if (totalQty === 0) return 'out-of-stock';
    if (totalQty <= item.reorder_level) return 'low-stock';
    return 'in-stock';
  }

  getStockColor(status: string): string {
    const colors: Record<string, string> = {
      'in-stock': 'bg-green-100 text-green-800',
      'low-stock': 'bg-yellow-100 text-yellow-800',
      'out-of-stock': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  getTotalQuantity(item: InventoryItem): number {
    return item.stock?.reduce((sum, s) => sum + s.quantity, 0) || 0;
  }
}
