export type PatientRequestStatus = 'pending' | 'approved' | 'rejected';

export interface PatientRequest {
  id: string;
  fullName: string;
  phone: string;
  birthDate: string;
  address?: any;
  emergencyContact?: any;
  allergies?: string;
  medicalHistory?: string;
  phoneInsurance?: string;
  telegramUserId?: string;
  status: PatientRequestStatus;
  reviewedBy?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientRequestUpdatePayload {
  status?: PatientRequestStatus;
  reviewedBy?: string;
  reviewNotes?: string;
  fullName?: string;
  phone?: string;
  birthDate?: string;
  address?: any;
  emergencyContact?: any;
  allergies?: string;
  medicalHistory?: string;
  phoneInsurance?: string;
}
