import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Shield, Plus, FileText } from 'lucide-angular';
import { InsuranceService } from '@core/services/insurance.service';
import { InsuranceCompany } from '@core/models/insurance.model';

@Component({
  selector: 'app-insurance',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="p-6 max-w-7xl mx-auto">
      <div class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-3">
            <lucide-icon [img]="Shield" [size]="32" class="text-sky-500"></lucide-icon>
            <h1 class="text-3xl font-bold text-gray-800">Insurance Management</h1>
          </div>
          <button class="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <lucide-icon [img]="Plus" [size]="20"></lucide-icon>
            <span>New Claim</span>
          </button>
        </div>
        <p class="text-gray-600">Manage insurance companies, plans, and claims</p>
      </div>

      <div class="grid gap-6 mb-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Insurance Companies</h3>
          @if (isLoading()) {
            <div class="flex items-center justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              @for (company of companies(); track company.id) {
                <div class="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div class="flex items-start justify-between mb-2">
                    <div>
                      <h4 class="font-semibold text-gray-800">{{ company.name }}</h4>
                      <div class="text-sm text-gray-600">{{ company.code }}</div>
                    </div>
                    <div class="text-right">
                      <div class="text-lg font-bold text-sky-600">{{ company.coverage_percentage }}%</div>
                      <div class="text-xs text-gray-500">Coverage</div>
                    </div>
                  </div>
                  @if (company.contact_email) {
                    <div class="text-xs text-gray-600 mt-2">{{ company.contact_email }}</div>
                  }
                  @if (company.contact_phone) {
                    <div class="text-xs text-gray-600">{{ company.contact_phone }}</div>
                  }
                </div>
              }
            </div>
          }
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <lucide-icon [img]="FileText" [size]="48" class="text-gray-300 mx-auto mb-4"></lucide-icon>
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Insurance Claims</h3>
          <p class="text-gray-500">Track and manage insurance claims for appointments</p>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsuranceComponent {
  private insuranceService = inject(InsuranceService);

  protected readonly Shield = Shield;
  protected readonly Plus = Plus;
  protected readonly FileText = FileText;

  companies = signal<InsuranceCompany[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.loadCompanies();
  }

  loadCompanies() {
    this.isLoading.set(true);
    this.insuranceService.getCompanies().subscribe({
      next: (companies) => {
        this.companies.set(companies);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}
