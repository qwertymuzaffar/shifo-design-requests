import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  LoyaltyTier,
  PatientLoyalty,
  LoyaltyTransaction
} from '@models/loyalty.model';

@Injectable({
  providedIn: 'root',
})
export class LoyaltyService {
  private httpClient = inject(HttpClient);
  private baseUrl = '/api';

  getTiers(): Observable<LoyaltyTier[]> {
    const params = new HttpParams()
      .set('is_active', 'eq.true')
      .set('order', 'required_points.asc');
    return this.httpClient.get<LoyaltyTier[]>(`${this.baseUrl}/loyalty_tiers`, { params });
  }

  getPatientLoyalty(patientId: number): Observable<PatientLoyalty> {
    const params = new HttpParams()
      .set('patient_id', `eq.${patientId}`)
      .set('select', '*,tier:loyalty_tiers(*)');

    return this.httpClient.get<PatientLoyalty[]>(`${this.baseUrl}/patient_loyalty`, { params })
      .pipe(map((loyalties: PatientLoyalty[]) => loyalties[0]));
  }

  createPatientLoyalty(patientId: number): Observable<PatientLoyalty> {
    return this.getTiers().pipe(
      switchMap((tiers: LoyaltyTier[]) => {
        const bronzeTier = tiers.find(t => t.name === 'Bronze') || tiers[0];

        return this.httpClient.post<PatientLoyalty[]>(`${this.baseUrl}/patient_loyalty`, {
          patient_id: patientId,
          tier_id: bronzeTier?.id,
          total_points: 0,
          available_points: 0,
          lifetime_spending: 0
        }, {
          headers: { 'Prefer': 'return=representation' }
        }).pipe(map((loyalties: PatientLoyalty[]) => loyalties[0]));
      })
    );
  }

  addPoints(patientLoyaltyId: number, points: number, description: string, referenceId?: number, referenceType?: string): Observable<void> {
    const transaction = {
      patient_loyalty_id: patientLoyaltyId,
      transaction_type: 'earned',
      points,
      description,
      reference_id: referenceId,
      reference_type: referenceType
    };

    return new Observable(observer => {
      this.httpClient.post(`${this.baseUrl}/loyalty_transactions`, transaction).subscribe({
        next: () => {
          this.httpClient.get<PatientLoyalty[]>(`${this.baseUrl}/patient_loyalty?id=eq.${patientLoyaltyId}`)
            .subscribe((loyalties: PatientLoyalty[]) => {
              const loyalty = loyalties[0];
              const newTotal = loyalty.total_points + points;
              const newAvailable = loyalty.available_points + points;

              this.httpClient.patch(`${this.baseUrl}/patient_loyalty?id=eq.${patientLoyaltyId}`, {
                total_points: newTotal,
                available_points: newAvailable
              }).subscribe({
                next: () => {
                  observer.next();
                  observer.complete();
                },
                error: (err) => observer.error(err)
              });
            });
        },
        error: (err) => observer.error(err)
      });
    });
  }

  redeemPoints(patientLoyaltyId: number, points: number, description: string): Observable<void> {
    const transaction = {
      patient_loyalty_id: patientLoyaltyId,
      transaction_type: 'redeemed',
      points: -points,
      description
    };

    return new Observable(observer => {
      this.httpClient.post(`${this.baseUrl}/loyalty_transactions`, transaction).subscribe({
        next: () => {
          this.httpClient.get<PatientLoyalty[]>(`${this.baseUrl}/patient_loyalty?id=eq.${patientLoyaltyId}`)
            .subscribe((loyalties: PatientLoyalty[]) => {
              const loyalty = loyalties[0];
              const newAvailable = loyalty.available_points - points;

              this.httpClient.patch(`${this.baseUrl}/patient_loyalty?id=eq.${patientLoyaltyId}`, {
                available_points: newAvailable
              }).subscribe({
                next: () => {
                  observer.next();
                  observer.complete();
                },
                error: (err) => observer.error(err)
              });
            });
        },
        error: (err) => observer.error(err)
      });
    });
  }

  getTransactions(patientLoyaltyId: number): Observable<LoyaltyTransaction[]> {
    const params = new HttpParams()
      .set('patient_loyalty_id', `eq.${patientLoyaltyId}`)
      .set('order', 'created_at.desc');
    return this.httpClient.get<LoyaltyTransaction[]>(`${this.baseUrl}/loyalty_transactions`, { params });
  }
}

import { switchMap } from 'rxjs/operators';
