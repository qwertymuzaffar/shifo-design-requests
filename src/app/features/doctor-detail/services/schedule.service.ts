import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { DoctorSchedule, WeekSchedule } from '../models/schedule.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.supabaseUrl}/rest/v1`;
  private headers = new HttpHeaders({
    'apikey': environment.supabaseKey,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  });

  getScheduleByDoctorId(doctorId: number): Observable<WeekSchedule> {
    return this.http.get<any[]>(
      `${this.apiUrl}/doctor_schedules?doctor_id=eq.${doctorId}`,
      { headers: this.headers }
    ).pipe(
      map(schedules => {
        const weekSchedule: WeekSchedule = {};
        schedules.forEach(schedule => {
          weekSchedule[schedule.day_of_week] = this.mapToSchedule(schedule);
        });
        return weekSchedule;
      }),
      catchError(() => of({}))
    );
  }

  upsertSchedule(schedule: DoctorSchedule): Observable<DoctorSchedule> {
    const payload = {
      doctor_id: schedule.doctorId,
      day_of_week: schedule.dayOfWeek,
      is_working: schedule.isWorking,
      start_time: schedule.startTime,
      end_time: schedule.endTime,
      break_start: schedule.breakStart,
      break_end: schedule.breakEnd
    };

    return this.http.post<any>(
      `${this.apiUrl}/doctor_schedules`,
      payload,
      {
        headers: this.headers.set('Prefer', 'resolution=merge-duplicates,return=representation')
      }
    ).pipe(
      map(response => Array.isArray(response) ? this.mapToSchedule(response[0]) : this.mapToSchedule(response))
    );
  }

  updateSchedule(id: string, schedule: Partial<DoctorSchedule>): Observable<DoctorSchedule> {
    const payload: any = {};
    if (schedule.isWorking !== undefined) payload.is_working = schedule.isWorking;
    if (schedule.startTime) payload.start_time = schedule.startTime;
    if (schedule.endTime) payload.end_time = schedule.endTime;
    if (schedule.breakStart !== undefined) payload.break_start = schedule.breakStart;
    if (schedule.breakEnd !== undefined) payload.break_end = schedule.breakEnd;

    return this.http.patch<any>(
      `${this.apiUrl}/doctor_schedules?id=eq.${id}`,
      payload,
      { headers: this.headers }
    ).pipe(
      map(response => Array.isArray(response) ? this.mapToSchedule(response[0]) : this.mapToSchedule(response))
    );
  }

  private mapToSchedule(data: any): DoctorSchedule {
    return {
      id: data.id,
      doctorId: data.doctor_id,
      dayOfWeek: data.day_of_week,
      isWorking: data.is_working,
      startTime: data.start_time,
      endTime: data.end_time,
      breakStart: data.break_start,
      breakEnd: data.break_end,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }
}
