import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Gift, Star, TrendingUp } from 'lucide-angular';

@Component({
  selector: 'app-loyalty',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="p-6 max-w-7xl mx-auto">
      <div class="mb-6">
        <div class="flex items-center gap-3 mb-2">
          <lucide-icon [img]="Gift" [size]="32" class="text-sky-500"></lucide-icon>
          <h1 class="text-3xl font-bold text-gray-800">Loyalty Program</h1>
        </div>
        <p class="text-gray-600">Manage patient rewards and loyalty tiers</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        @for (tier of tiers; track tier.name) {
          <div class="bg-white rounded-lg shadow-sm border-2 p-6" [class.border-sky-500]="tier.name === 'Gold'">
            <div class="flex items-center gap-2 mb-3">
              <lucide-icon [img]="Star" [size]="24" [class]="tier.color"></lucide-icon>
              <h3 class="text-lg font-bold" [class]="tier.color">{{ tier.name }}</h3>
            </div>
            <div class="text-2xl font-bold text-gray-800 mb-2">{{ tier.discount }}% OFF</div>
            <div class="text-sm text-gray-600 mb-3">{{ tier.points }}+ points required</div>
            <ul class="space-y-2 text-sm text-gray-600">
              @for (benefit of tier.benefits; track benefit) {
                <li class="flex items-start gap-2">
                  <span class="text-green-500 mt-0.5">✓</span>
                  <span>{{ benefit }}</span>
                </li>
              }
            </ul>
          </div>
        }
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <lucide-icon [img]="TrendingUp" [size]="48" class="text-gray-300 mx-auto mb-4"></lucide-icon>
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Patient Loyalty Dashboard</h3>
        <p class="text-gray-500">View patient loyalty accounts, points, and tier information</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoyaltyComponent {
  protected readonly Gift = Gift;
  protected readonly Star = Star;
  protected readonly TrendingUp = TrendingUp;

  tiers = [
    {
      name: 'Bronze',
      discount: 0,
      points: 0,
      color: 'text-orange-600',
      benefits: ['Basic member benefits', 'Birthday bonus']
    },
    {
      name: 'Silver',
      discount: 5,
      points: 1000,
      color: 'text-gray-500',
      benefits: ['5% discount', 'Priority booking', 'Birthday bonus']
    },
    {
      name: 'Gold',
      discount: 10,
      points: 5000,
      color: 'text-yellow-600',
      benefits: ['10% discount', 'Priority booking', 'Free annual checkup', 'Birthday bonus']
    },
    {
      name: 'Platinum',
      discount: 15,
      points: 15000,
      color: 'text-purple-600',
      benefits: ['15% discount', 'VIP priority', 'Free checkup', 'Free lab tests', 'Referral rewards']
    }
  ];
}
