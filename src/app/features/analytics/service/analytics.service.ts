import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnalyticsResponse} from "@features/analytics/models/analytics.models";
import { DebtorsResponse } from '@features/analytics/models/debtor.model';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {

  private http = inject(HttpClient);

  getAnalytics(dateFrom: string, dateTo: string): Observable<AnalyticsResponse> {
    return this.http.get<AnalyticsResponse>('/analytics/dashboard', {
      params: { dateFrom, dateTo }
    });
  }

  getDebtors(): Observable<DebtorsResponse> {
    return this.http.get<DebtorsResponse>('/analytics/debtors');
  }
}
