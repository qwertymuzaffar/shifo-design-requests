export interface Medication {
  id: number;
  name: string;
  generic_name?: string;
  description?: string;
  form: string;
  strength?: string;
  manufacturer?: string;
  contraindications?: string;
  side_effects?: string;
  is_active: boolean;
  requires_prescription: boolean;
  created_at: string;
  updated_at: string;
}

export interface Prescription {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_id?: number;
  prescription_number: string;
  diagnosis?: string;
  notes?: string;
  status: 'active' | 'completed' | 'cancelled';
  issued_at: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  patient?: any;
  doctor?: any;
  items?: PrescriptionItem[];
}

export interface PrescriptionItem {
  id: number;
  prescription_id: number;
  medication_id: number;
  dosage: string;
  frequency: string;
  duration_days: number;
  quantity: number;
  instructions?: string;
  created_at: string;
  medication?: Medication;
}

export interface CreatePrescriptionRequest {
  patient_id: number;
  doctor_id: number;
  appointment_id?: number;
  diagnosis?: string;
  notes?: string;
  items: {
    medication_id: number;
    dosage: string;
    frequency: string;
    duration_days: number;
    quantity: number;
    instructions?: string;
  }[];
}
