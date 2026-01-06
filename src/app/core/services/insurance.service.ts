import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  InsuranceCompany,
  InsurancePlan,
  PatientInsurance,
  InsuranceClaim
} from '@core/models/insurance.model';

@Injectable({
  providedIn: 'root',
})
export class InsuranceService {
  private httpClient = inject(HttpClient);
  private baseUrl = '/api';

  getCompanies(): Observable<InsuranceCompany[]> {
    const params = new HttpParams()
      .set('is_active', 'eq.true')
      .set('order', 'name.asc');
    return this.httpClient.get<InsuranceCompany[]>(`${this.baseUrl}/insurance_companies`, { params });
  }

  getPlans(companyId?: number): Observable<InsurancePlan[]> {
    let params = new HttpParams()
      .set('is_active', 'eq.true')
      .set('select', '*,company:insurance_companies(*)');

    if (companyId) {
      params = params.set('company_id', `eq.${companyId}`);
    }

    return this.httpClient.get<InsurancePlan[]>(`${this.baseUrl}/insurance_plans`, { params });
  }

  getPatientInsurance(patientId: number): Observable<PatientInsurance[]> {
    const params = new HttpParams()
      .set('patient_id', `eq.${patientId}`)
      .set('is_active', 'eq.true')
      .set('select', '*,plan:insurance_plans(*,company:insurance_companies(*))');

    return this.httpClient.get<PatientInsurance[]>(`${this.baseUrl}/patient_insurance`, { params });
  }

  addPatientInsurance(insurance: Partial<PatientInsurance>): Observable<PatientInsurance> {
    return this.httpClient.post<PatientInsurance[]>(`${this.baseUrl}/patient_insurance`, insurance, {
      headers: { 'Prefer': 'return=representation' }
    }).pipe(map((insurances: PatientInsurance[]) => insurances[0]));
  }

  updatePatientInsurance(id: number, insurance: Partial<PatientInsurance>): Observable<void> {
    return this.httpClient.patch<void>(`${this.baseUrl}/patient_insurance?id=eq.${id}`, insurance);
  }

  getClaims(appointmentId?: number, status?: string): Observable<InsuranceClaim[]> {
    let params = new HttpParams()
      .set('select', '*,appointment:appointments(*),patient_insurance:patient_insurance(*,plan:insurance_plans(*,company:insurance_companies(*)))')
      .set('order', 'submitted_at.desc');

    if (appointmentId) {
      params = params.set('appointment_id', `eq.${appointmentId}`);
    }
    if (status) {
      params = params.set('status', `eq.${status}`);
    }

    return this.httpClient.get<InsuranceClaim[]>(`${this.baseUrl}/insurance_claims`, { params });
  }

  createClaim(claim: Partial<InsuranceClaim>): Observable<InsuranceClaim> {
    const claimNumber = `CLM-${Date.now()}`;
    return this.httpClient.post<InsuranceClaim[]>(`${this.baseUrl}/insurance_claims`, {
      ...claim,
      claim_number: claimNumber
    }, {
      headers: { 'Prefer': 'return=representation' }
    }).pipe(map((claims: InsuranceClaim[]) => claims[0]));
  }

  updateClaimStatus(id: number, status: string, approvedAmount?: number): Observable<void> {
    const updates: any = { status };

    if (approvedAmount !== undefined) {
      updates.approved_amount = approvedAmount;
    }

    if (status === 'approved' || status === 'rejected') {
      updates.processed_at = new Date().toISOString();
    }

    return this.httpClient.patch<void>(`${this.baseUrl}/insurance_claims?id=eq.${id}`, updates);
  }
}
