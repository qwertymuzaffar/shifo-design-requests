import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, UserCog, Plus, Users, Calendar, Clock } from 'lucide-angular';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="p-6 max-w-7xl mx-auto">
      <div class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-3">
            <lucide-icon [img]="UserCog" [size]="32" class="text-sky-500"></lucide-icon>
            <h1 class="text-3xl font-bold text-gray-800">Staff Management</h1>
          </div>
          <button class="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <lucide-icon [img]="Plus" [size]="20"></lucide-icon>
            <span>Add Staff Member</span>
          </button>
        </div>
        <p class="text-gray-600">Manage clinic staff, schedules, and attendance</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center gap-3 mb-2">
            <lucide-icon [img]="Users" [size]="24" class="text-blue-500"></lucide-icon>
            <h3 class="font-semibold text-gray-700">Total Staff</h3>
          </div>
          <div class="text-3xl font-bold text-gray-800">24</div>
          <div class="text-sm text-gray-600 mt-1">Active employees</div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center gap-3 mb-2">
            <lucide-icon [img]="Clock" [size]="24" class="text-green-500"></lucide-icon>
            <h3 class="font-semibold text-gray-700">On Duty</h3>
          </div>
          <div class="text-3xl font-bold text-gray-800">18</div>
          <div class="text-sm text-gray-600 mt-1">Currently working</div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center gap-3 mb-2">
            <lucide-icon [img]="Calendar" [size]="24" class="text-yellow-500"></lucide-icon>
            <h3 class="font-semibold text-gray-700">Leave Requests</h3>
          </div>
          <div class="text-3xl font-bold text-gray-800">5</div>
          <div class="text-sm text-gray-600 mt-1">Pending approval</div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-4 border-b border-gray-200">
          <h3 class="font-semibold text-gray-800">Staff Directory</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (role of staffRoles; track role) {
              <div class="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div class="font-semibold text-gray-800 mb-2">{{ role.name }}</div>
                <div class="text-sm text-gray-600">{{ role.count }} members</div>
                <div class="text-xs text-gray-500 mt-1">{{ role.description }}</div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaffComponent {
  protected readonly UserCog = UserCog;
  protected readonly Plus = Plus;
  protected readonly Users = Users;
  protected readonly Calendar = Calendar;
  protected readonly Clock = Clock;

  staffRoles = [
    { name: 'Nurses', count: 8, description: 'Patient care and assistance' },
    { name: 'Receptionists', count: 4, description: 'Front desk operations' },
    { name: 'Lab Technicians', count: 3, description: 'Laboratory testing' },
    { name: 'Pharmacists', count: 2, description: 'Medication dispensing' },
    { name: 'Medical Assistants', count: 4, description: 'Clinical support' },
    { name: 'Administrative Staff', count: 3, description: 'Management and admin' }
  ];
}
