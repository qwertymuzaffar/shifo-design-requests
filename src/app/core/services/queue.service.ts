import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { QueueEntry, QueueDisplaySettings } from '@core/models/queue.model';

@Injectable({
  providedIn: 'root',
})
export class QueueService {
  private httpClient = inject(HttpClient);
  private baseUrl = '/api';

  getQueueEntries(status?: string, doctorId?: number): Observable<QueueEntry[]> {
    let params = new HttpParams()
      .set('select', '*,patient:patients(*),doctor:doctors(*)')
      .set('order', 'priority.asc,check_in_time.asc');

    if (status) {
      params = params.set('status', `eq.${status}`);
    } else {
      params = params.set('status', 'in.(waiting,in_progress)');
    }

    if (doctorId) {
      params = params.set('doctor_id', `eq.${doctorId}`);
    }

    return this.httpClient.get<QueueEntry[]>(`${this.baseUrl}/queue_entries`, { params });
  }

  getTodayQueue(): Observable<QueueEntry[]> {
    const today = new Date().toISOString().split('T')[0];
    const params = new HttpParams()
      .set('check_in_time', `gte.${today}T00:00:00`)
      .set('select', '*,patient:patients(*),doctor:doctors(*)')
      .set('order', 'queue_number.desc')
      .set('limit', '1');

    return this.httpClient.get<QueueEntry[]>(`${this.baseUrl}/queue_entries`, { params });
  }

  checkInPatient(patientId: number, appointmentId?: number, doctorId?: number): Observable<QueueEntry> {
    return this.getTodayQueue().pipe(
      switchMap((entries: QueueEntry[]) => {
        const nextQueueNumber = entries.length > 0 ? entries[0].queue_number + 1 : 1;

        const entry = {
          patient_id: patientId,
          appointment_id: appointmentId,
          doctor_id: doctorId,
          queue_number: nextQueueNumber,
          status: 'waiting',
          priority: 5,
          estimated_wait_minutes: nextQueueNumber * 15
        };

        return this.httpClient.post<QueueEntry[]>(`${this.baseUrl}/queue_entries`, entry, {
          headers: { 'Prefer': 'return=representation' }
        }).pipe(map((newEntries: QueueEntry[]) => newEntries[0]));
      })
    );
  }

  updateQueueStatus(id: number, status: string): Observable<void> {
    const updates: any = { status };

    if (status === 'in_progress') {
      updates.called_time = new Date().toISOString();
    } else if (status === 'completed' || status === 'cancelled' || status === 'no_show') {
      updates.completed_time = new Date().toISOString();
    }

    return this.httpClient.patch<void>(`${this.baseUrl}/queue_entries?id=eq.${id}`, updates);
  }

  getDisplaySettings(): Observable<QueueDisplaySettings[]> {
    const params = new HttpParams().set('is_active', 'eq.true');
    return this.httpClient.get<QueueDisplaySettings[]>(`${this.baseUrl}/queue_display_settings`, { params });
  }
}
