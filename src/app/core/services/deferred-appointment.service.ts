import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DeferredAppointmentModel,
  DeferredAppointmentCreateModel,
  DeferredAppointmentUpdateModel
} from '@core/models/deferred-appointment.model';

@Injectable({
  providedIn: 'root'
})
export class DeferredAppointmentService {
  private httpClient = inject(HttpClient);

  getDeferredAppointments(status?: string): Observable<DeferredAppointmentModel[]> {
    const params = status ? { status } : undefined;
    return this.httpClient.get<DeferredAppointmentModel[]>('/deferred-appointments', { params });
  }

  getDeferredAppointmentById(id: string): Observable<DeferredAppointmentModel> {
    return this.httpClient.get<DeferredAppointmentModel>(`/deferred-appointments/${id}`);
  }

  createDeferredAppointment(data: DeferredAppointmentCreateModel): Observable<DeferredAppointmentModel> {
    return this.httpClient.post<DeferredAppointmentModel>('/deferred-appointments', data);
  }

  updateDeferredAppointment(id: string, data: DeferredAppointmentUpdateModel): Observable<DeferredAppointmentModel> {
    return this.httpClient.patch<DeferredAppointmentModel>(`/deferred-appointments/${id}`, data);
  }

  takeAppointment(id: string, doctorId: number): Observable<DeferredAppointmentModel> {
    return this.httpClient.patch<DeferredAppointmentModel>(`/deferred-appointments/${id}/take`, {
      assigned_doctor_id: doctorId,
      status: 'taken'
    });
  }

  cancelDeferredAppointment(id: string): Observable<void> {
    return this.httpClient.delete<void>(`/deferred-appointments/${id}`);
  }
}
