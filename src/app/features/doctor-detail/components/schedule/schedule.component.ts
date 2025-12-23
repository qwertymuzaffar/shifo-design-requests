import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorDetailComponent } from '../../doctor-detail.component';
import { LucideAngularModule, Clock, Calendar, Coffee, Edit2, Save, X, Plus, Trash2 } from 'lucide-angular';
import { ScheduleService } from '../../services/schedule.service';
import { DoctorSchedule, WeekSchedule } from '../../models/schedule.model';
import { ToastService } from '@core/services/toast.service';
import { ScheduleSkeletonComponent } from './schedule-skeleton.component';

interface DaySchedule {
  dayOfWeek: number;
  name: string;
  short: string;
  isWorking: boolean;
  startTime: string;
  endTime: string;
  breakStart: string;
  breakEnd: string;
  scheduleId?: string;
}

@Component({
  selector: 'app-doctor-schedule',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, ScheduleSkeletonComponent],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class DoctorScheduleComponent implements OnInit {
  private parent = inject(DoctorDetailComponent);
  private scheduleService = inject(ScheduleService);
  private toastService = inject(ToastService);

  doctor = computed(() => this.parent.doctor());
  isEditMode = signal(false);
  isLoading = signal(false);
  isSaving = signal(false);

  weekSchedule = signal<DaySchedule[]>([
    { dayOfWeek: 1, name: 'Monday', short: 'Mon', isWorking: true, startTime: '09:00', endTime: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    { dayOfWeek: 2, name: 'Tuesday', short: 'Tue', isWorking: true, startTime: '09:00', endTime: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    { dayOfWeek: 3, name: 'Wednesday', short: 'Wed', isWorking: true, startTime: '09:00', endTime: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    { dayOfWeek: 4, name: 'Thursday', short: 'Thu', isWorking: true, startTime: '09:00', endTime: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    { dayOfWeek: 5, name: 'Friday', short: 'Fri', isWorking: true, startTime: '09:00', endTime: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    { dayOfWeek: 6, name: 'Saturday', short: 'Sat', isWorking: false, startTime: '09:00', endTime: '14:00', breakStart: '', breakEnd: '' },
    { dayOfWeek: 0, name: 'Sunday', short: 'Sun', isWorking: false, startTime: '09:00', endTime: '14:00', breakStart: '', breakEnd: '' }
  ]);

  protected readonly Clock = Clock;
  protected readonly Calendar = Calendar;
  protected readonly Coffee = Coffee;
  protected readonly Edit2 = Edit2;
  protected readonly Save = Save;
  protected readonly X = X;
  protected readonly Plus = Plus;
  protected readonly Trash2 = Trash2;

  ngOnInit(): void {
    this.loadSchedule();
  }

  loadSchedule(): void {
    const doctorId = this.doctor()?.id;
    if (!doctorId) return;

    this.isLoading.set(true);
    this.scheduleService.getScheduleByDoctorId(doctorId).subscribe({
      next: (schedules: WeekSchedule) => {
        const updatedSchedule = this.weekSchedule().map(day => {
          const dbSchedule = schedules[day.dayOfWeek];
          if (dbSchedule) {
            return {
              ...day,
              isWorking: dbSchedule.isWorking,
              startTime: dbSchedule.startTime,
              endTime: dbSchedule.endTime,
              breakStart: dbSchedule.breakStart || '',
              breakEnd: dbSchedule.breakEnd || '',
              scheduleId: dbSchedule.id
            };
          }
          return day;
        });
        this.weekSchedule.set(updatedSchedule);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  toggleEditMode(): void {
    if (this.isEditMode()) {
      this.loadSchedule();
    }
    this.isEditMode.update(v => !v);
  }

  saveSchedule(): void {
    const doctorId = this.doctor()?.id;
    if (!doctorId) return;

    this.isSaving.set(true);
    const saveOperations = this.weekSchedule().map(day => {
      const schedule: DoctorSchedule = {
        id: day.scheduleId,
        doctorId,
        dayOfWeek: day.dayOfWeek,
        isWorking: day.isWorking,
        startTime: day.startTime,
        endTime: day.endTime,
        breakStart: day.breakStart || null,
        breakEnd: day.breakEnd || null
      };
      return this.scheduleService.upsertSchedule(schedule);
    });

    let completed = 0;
    saveOperations.forEach(op => {
      op.subscribe({
        next: () => {
          completed++;
          if (completed === saveOperations.length) {
            this.isSaving.set(false);
            this.isEditMode.set(false);
            this.toastService.openToast('Schedule updated successfully', 'Success', 'success');
            this.loadSchedule();
          }
        },
        error: () => {
          this.isSaving.set(false);
          this.toastService.openToast('Failed to update schedule', 'Error', 'error');
        }
      });
    });
  }

  toggleDay(day: DaySchedule): void {
    const schedule = this.weekSchedule();
    const index = schedule.findIndex(d => d.dayOfWeek === day.dayOfWeek);
    if (index !== -1) {
      schedule[index].isWorking = !schedule[index].isWorking;
      this.weekSchedule.set([...schedule]);
    }
  }

  clearBreak(day: DaySchedule): void {
    const schedule = this.weekSchedule();
    const index = schedule.findIndex(d => d.dayOfWeek === day.dayOfWeek);
    if (index !== -1) {
      schedule[index].breakStart = '';
      schedule[index].breakEnd = '';
      this.weekSchedule.set([...schedule]);
    }
  }

  hasBreak(day: DaySchedule): boolean {
    return !!(day.breakStart && day.breakEnd);
  }

  getWorkingDays(): number {
    return this.weekSchedule().filter(d => d.isWorking).length;
  }

  getTotalHours(): number {
    return this.weekSchedule()
      .filter(d => d.isWorking)
      .reduce((total, day) => {
        const start = this.timeToMinutes(day.startTime);
        const end = this.timeToMinutes(day.endTime);
        let breakTime = 0;
        if (day.breakStart && day.breakEnd) {
          breakTime = this.timeToMinutes(day.breakEnd) - this.timeToMinutes(day.breakStart);
        }
        return total + ((end - start - breakTime) / 60);
      }, 0);
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
