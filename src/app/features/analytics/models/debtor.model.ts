export interface DebtorModel {
  patientId: number;
  fullName: string;
  phone: string;
  totalDebt: number;
  unpaidServicesCount: number;
  lastVisitDate: string | null;
}

export interface DebtorsResponse {
  data: DebtorModel[];
  total: number;
}
