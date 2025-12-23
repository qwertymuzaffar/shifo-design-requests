import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorDetailComponent } from '../../doctor-detail.component';
import { LucideAngularModule, Clock, Calendar, Coffee } from 'lucide-angular';

@Component({
  selector: 'app-doctor-schedule',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class DoctorScheduleComponent {
  private parent = inject(DoctorDetailComponent);
  doctor = computed(() => this.parent.doctor());

  protected readonly Clock = Clock;
  protected readonly Calendar = Calendar;
  protected readonly Coffee = Coffee;

  weekDays = [
    { name: 'Monday', short: 'Mon' },
    { name: 'Tuesday', short: 'Tue' },
    { name: 'Wednesday', short: 'Wed' },
    { name: 'Thursday', short: 'Thu' },
    { name: 'Friday', short: 'Fri' },
    { name: 'Saturday', short: 'Sat' },
    { name: 'Sunday', short: 'Sun' }
  ];
}
