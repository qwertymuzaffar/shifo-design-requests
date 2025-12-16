import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Params } from '@angular/router';
import { PatientRequest, PatientRequestUpdatePayload } from '../models/patient-request.model';
import { Pagination } from '@models/pagination.model';
import { PatientModel } from '../models/patient.model';

@Injectable({
  providedIn: 'root',
})
export class PatientRequestService {
  private http = inject(HttpClient);

  getRequests(params?: Params): Observable<Pagination<PatientRequest>> {
    return this.http.get<Pagination<PatientRequest>>('/patient-requests', { params });
  }

  getRequestById(id: string): Observable<PatientRequest> {
    return this.http.get<PatientRequest>(`/patient-requests/${id}`);
  }

  getPendingRequestsCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>('/patient-requests/pending/count');
  }

  updateRequest(id: string, payload: PatientRequestUpdatePayload): Observable<PatientRequest> {
    return this.http.patch<PatientRequest>(`/patient-requests/${id}`, payload);
  }

  approveRequest(id: string, reviewNotes?: string): Observable<PatientModel> {
    return this.http.post<PatientModel>(`/patient-requests/${id}/approve`, { reviewNotes });
  }

  rejectRequest(id: string, reviewNotes?: string): Observable<PatientRequest> {
    return this.http.post<PatientRequest>(`/patient-requests/${id}/reject`, { reviewNotes });
  }

  deleteRequest(id: string): Observable<void> {
    return this.http.delete<void>(`/patient-requests/${id}`);
  }

  createPatientFromRequest(id: string, patientData: Partial<PatientModel>): Observable<PatientModel> {
    return this.http.post<PatientModel>(`/patient-requests/${id}/convert`, patientData);
  }
}
