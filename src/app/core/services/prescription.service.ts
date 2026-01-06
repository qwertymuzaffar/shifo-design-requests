import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Medication,
  Prescription,
  PrescriptionItem,
  CreatePrescriptionRequest
} from '@core/models/prescription.model';

@Injectable({
  providedIn: 'root',
})
export class PrescriptionService {
  private httpClient = inject(HttpClient);
  private baseUrl = '/api';

  getMedications(search?: string): Observable<Medication[]> {
    let params = new HttpParams().set('is_active', 'eq.true');
    if (search) {
      params = params.set('or', `(name.ilike.*${search}*,generic_name.ilike.*${search}*)`);
    }
    return this.httpClient.get<Medication[]>(`${this.baseUrl}/medications`, { params });
  }

  getPrescriptions(patientId?: number, status?: string): Observable<Prescription[]> {
    let params = new HttpParams();
    if (patientId) {
      params = params.set('patient_id', `eq.${patientId}`);
    }
    if (status) {
      params = params.set('status', `eq.${status}`);
    }
    params = params.set('select', '*,patient:patients(*),doctor:doctors(*),items:prescription_items(*,medication:medications(*))');
    params = params.set('order', 'issued_at.desc');
    return this.httpClient.get<Prescription[]>(`${this.baseUrl}/prescriptions`, { params });
  }

  getPrescription(id: number): Observable<Prescription> {
    const params = new HttpParams()
      .set('select', '*,patient:patients(*),doctor:doctors(*),items:prescription_items(*,medication:medications(*))');
    return this.httpClient.get<Prescription[]>(`${this.baseUrl}/prescriptions?id=eq.${id}`, { params })
      .pipe(map((prescriptions: Prescription[]) => prescriptions[0]));
  }

  createPrescription(request: CreatePrescriptionRequest): Observable<Prescription> {
    const prescriptionNumber = `RX-${Date.now()}`;
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 6);

    const prescription = {
      patient_id: request.patient_id,
      doctor_id: request.doctor_id,
      appointment_id: request.appointment_id,
      prescription_number: prescriptionNumber,
      diagnosis: request.diagnosis,
      notes: request.notes,
      status: 'active',
      expires_at: expiresAt.toISOString()
    };

    return new Observable(observer => {
      this.httpClient.post<Prescription[]>(`${this.baseUrl}/prescriptions`, prescription, {
        headers: { 'Prefer': 'return=representation' }
      }).subscribe({
        next: (prescriptions) => {
          const createdPrescription = prescriptions[0];
          const items = request.items.map((item: any) => ({
            prescription_id: createdPrescription.id,
            ...item
          }));

          this.httpClient.post(`${this.baseUrl}/prescription_items`, items).subscribe({
            next: () => {
              this.getPrescription(createdPrescription.id).subscribe(fullPrescription => {
                observer.next(fullPrescription);
                observer.complete();
              });
            },
            error: (err) => observer.error(err)
          });
        },
        error: (err) => observer.error(err)
      });
    });
  }

  updatePrescriptionStatus(id: number, status: 'active' | 'completed' | 'cancelled'): Observable<void> {
    return this.httpClient.patch<void>(`${this.baseUrl}/prescriptions?id=eq.${id}`, { status });
  }

  deletePrescription(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/prescriptions?id=eq.${id}`);
  }
}
