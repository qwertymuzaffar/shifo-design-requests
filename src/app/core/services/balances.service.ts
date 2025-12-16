import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Params } from "@angular/router";
import { BalancesSummaryModel } from "@core/models/balances.model";
import { Pagination } from "@models/pagination.model";
import { Observable } from 'rxjs';
import {
  ClientBalances,
  FinancialDetailsModel,
} from '@core/models/financial-details.model';

@Injectable({providedIn: "root"})
export class BalancesService {

  constructor(private http: HttpClient) {

  }

  getBalanceSummary(params: Params): Observable<BalancesSummaryModel> {
    return this.http.get<BalancesSummaryModel>(
      '/balances/analytics/financial',
      { params },
    );
  }

  getFinancialDetails(params: Params): Observable<FinancialDetailsModel> {
    return this.http.get<FinancialDetailsModel>('/analytics/financial-details', { params });
  }

  getClientBalances(): Observable<ClientBalances> {
    return this.http.get<ClientBalances>(
      '/analytics/client-balances',
    );
  }

  getBalances(params: Params): Observable<Pagination<any>> {
    return this.http.get<Pagination<any>>("/balances", {params})
  }

  getBalancesByEntity(entityId: number, entityType: string): Observable<Pagination<any>> {
    return this.http.get<Pagination<any>>(`/balances/entity/${entityId}/${entityType}`)
  }
}
