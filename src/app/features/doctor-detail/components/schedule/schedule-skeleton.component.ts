import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-schedule-skeleton',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoaderModule],
  template: `
    <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-2">
          <ngx-skeleton-loader
            count="1"
            [theme]="{ width: '24px', height: '24px', 'border-radius': '6px' }"
          ></ngx-skeleton-loader>
          <ngx-skeleton-loader
            count="1"
            [theme]="{ width: '180px', height: '28px', 'border-radius': '6px' }"
          ></ngx-skeleton-loader>
        </div>
        <ngx-skeleton-loader
          count="1"
          [theme]="{ width: '80px', height: '40px', 'border-radius': '8px' }"
        ></ngx-skeleton-loader>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        @for (i of [1, 2, 3]; track i) {
          <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
            <ngx-skeleton-loader
              count="1"
              [theme]="{ width: '120px', height: '16px', 'border-radius': '4px', 'margin-bottom': '8px' }"
            ></ngx-skeleton-loader>
            <ngx-skeleton-loader
              count="1"
              [theme]="{ width: '80px', height: '32px', 'border-radius': '4px' }"
            ></ngx-skeleton-loader>
          </div>
        }
      </div>

      <div class="space-y-3">
        @for (i of [1, 2, 3, 4, 5, 6, 7]; track i) {
          <div class="border border-gray-200 rounded-lg p-4 bg-white">
            <div class="flex flex-col sm:flex-row sm:items-center gap-4">
              <div class="flex items-center gap-3 min-w-[140px]">
                <ngx-skeleton-loader
                  count="1"
                  [theme]="{ width: '40px', height: '40px', 'border-radius': '8px' }"
                ></ngx-skeleton-loader>
                <ngx-skeleton-loader
                  count="1"
                  [theme]="{ width: '100px', height: '20px', 'border-radius': '4px' }"
                ></ngx-skeleton-loader>
              </div>

              <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <ngx-skeleton-loader
                    count="1"
                    [theme]="{ width: '100px', height: '14px', 'border-radius': '4px', 'margin-bottom': '8px' }"
                  ></ngx-skeleton-loader>
                  <ngx-skeleton-loader
                    count="1"
                    [theme]="{ width: '100%', height: '36px', 'border-radius': '8px' }"
                  ></ngx-skeleton-loader>
                </div>

                <div>
                  <ngx-skeleton-loader
                    count="1"
                    [theme]="{ width: '80px', height: '14px', 'border-radius': '4px', 'margin-bottom': '8px' }"
                  ></ngx-skeleton-loader>
                  <ngx-skeleton-loader
                    count="1"
                    [theme]="{ width: '100%', height: '36px', 'border-radius': '8px' }"
                  ></ngx-skeleton-loader>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class ScheduleSkeletonComponent {}
