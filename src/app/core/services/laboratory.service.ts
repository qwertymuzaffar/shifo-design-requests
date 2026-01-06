import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LabTestType,
  LabOrder,
  LabOrderItem,
  LabResult,
  CreateLabOrderRequest,
  UpdateLabResultRequest
} from '@models/laboratory.model';

@Injectable({
  providedIn: 'root',
})
export class LaboratoryService {
  private httpClient = inject(HttpClient);
  private baseUrl = '/api';

  getTestTypes(): Observable<LabTestType[]> {
    return this.httpClient.get<LabTestType[]>(`${this.baseUrl}/lab_test_types`);
  }

  getActiveTestTypes(): Observable<LabTestType[]> {
    const params = new HttpParams().set('is_active', 'eq.true');
    return this.httpClient.get<LabTestType[]>(`${this.baseUrl}/lab_test_types`, { params });
  }

  getLabOrders(patientId?: number, status?: string): Observable<LabOrder[]> {
    let params = new HttpParams();
    if (patientId) {
      params = params.set('patient_id', `eq.${patientId}`);
    }
    if (status) {
      params = params.set('status', `eq.${status}`);
    }
    params = params.set('select', '*,patient:patients(*),doctor:doctors(*),items:lab_order_items(*,test_type:lab_test_types(*),result:lab_results(*))');
    params = params.set('order', 'ordered_at.desc');
    return this.httpClient.get<LabOrder[]>(`${this.baseUrl}/lab_orders`, { params });
  }

  getLabOrder(id: number): Observable<LabOrder> {
    const params = new HttpParams()
      .set('select', '*,patient:patients(*),doctor:doctors(*),items:lab_order_items(*,test_type:lab_test_types(*),result:lab_results(*))');
    return this.httpClient.get<LabOrder[]>(`${this.baseUrl}/lab_orders?id=eq.${id}`, { params })
      .pipe(map((orders: LabOrder[]) => orders[0]));
  }

  createLabOrder(request: CreateLabOrderRequest): Observable<LabOrder> {
    const orderNumber = `LAB-${Date.now()}`;
    const order = {
      patient_id: request.patient_id,
      doctor_id: request.doctor_id,
      appointment_id: request.appointment_id,
      order_number: orderNumber,
      notes: request.notes,
      status: 'pending'
    };

    return new Observable(observer => {
      this.httpClient.post<LabOrder[]>(`${this.baseUrl}/lab_orders`, order, {
        headers: { 'Prefer': 'return=representation' }
      }).subscribe({
        next: (orders) => {
          const createdOrder = orders[0];
          const items = request.test_type_ids.map(testTypeId => ({
            order_id: createdOrder.id,
            test_type_id: testTypeId,
            status: 'pending'
          }));

          this.httpClient.post(`${this.baseUrl}/lab_order_items`, items).subscribe({
            next: () => {
              this.getLabOrder(createdOrder.id).subscribe(fullOrder => {
                observer.next(fullOrder);
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

  updateLabOrderStatus(id: number, status: string): Observable<void> {
    const updates: any = { status };
    if (status === 'collected') {
      updates.collected_at = new Date().toISOString();
    } else if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }
    return this.httpClient.patch<void>(`${this.baseUrl}/lab_orders?id=eq.${id}`, updates);
  }

  updateLabResult(result: UpdateLabResultRequest): Observable<LabResult> {
    return this.httpClient.post<LabResult[]>(`${this.baseUrl}/lab_results`, {
      ...result,
      verified_at: new Date().toISOString()
    }, {
      headers: { 'Prefer': 'return=representation' }
    }).pipe(map((results: LabResult[]) => results[0]));
  }

  deleteLabOrder(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/lab_orders?id=eq.${id}`);
  }
}
