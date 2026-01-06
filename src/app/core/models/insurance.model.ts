export interface InsuranceCompany {
  id: number;
  name: string;
  code: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  coverage_percentage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InsurancePlan {
  id: number;
  company_id: number;
  plan_name: string;
  plan_code: string;
  coverage_percentage: number;
  max_coverage_amount?: number;
  deductible: number;
  copay: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  company?: InsuranceCompany;
}

export interface PatientInsurance {
  id: number;
  patient_id: number;
  plan_id: number;
  policy_number: string;
  group_number?: string;
  start_date: string;
  end_date?: string;
  is_primary: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  plan?: InsurancePlan;
}

export interface InsuranceClaim {
  id: number;
  appointment_id: number;
  patient_insurance_id: number;
  claim_number: string;
  claim_amount: number;
  approved_amount?: number;
  status: 'submitted' | 'processing' | 'approved' | 'rejected' | 'paid';
  submitted_at: string;
  processed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  appointment?: any;
  patient_insurance?: PatientInsurance;
}
