export interface OverpaymentModel {
  patientId: number;
  fullName: string;
  phone: string;
  totalOverpayment: number;
  prepaidServicesCount: number;
  lastPrepaymentDate: string | null;
}

export interface OverpaymentsResponse {
  data: OverpaymentModel[];
  total: number;
}
