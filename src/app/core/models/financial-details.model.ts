export interface FinancialDetailsModel {
  totalServicesAmount: number;
  servicesCount: number;
  cashReceived: number;
  paidServicesCount: number;
  debtAmount: number;
  debtCount: number;
  prepaymentBalance: number;
  prepaymentCount: number;
  paidServicesAmount: number;
  paidServicesAmountCount: number;
}

export interface ClientBalances {
  clientDebt: number;
  clientOverpayments: number;
}
