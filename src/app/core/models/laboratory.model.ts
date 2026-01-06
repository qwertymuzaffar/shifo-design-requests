export interface LabTestType {
  id: number;
  name: string;
  code: string;
  description?: string;
  normal_range?: string;
  unit?: string;
  price: number;
  preparation_instructions?: string;
  turnaround_time_hours: number;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LabOrder {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_id?: number;
  order_number: string;
  status: 'pending' | 'collected' | 'processing' | 'completed' | 'cancelled';
  ordered_at: string;
  collected_at?: string;
  completed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  patient?: any;
  doctor?: any;
  items?: LabOrderItem[];
}

export interface LabOrderItem {
  id: number;
  order_id: number;
  test_type_id: number;
  status: 'pending' | 'processing' | 'completed';
  created_at: string;
  test_type?: LabTestType;
  result?: LabResult;
}

export interface LabResult {
  id: number;
  order_item_id: number;
  value: string;
  is_abnormal: boolean;
  notes?: string;
  verified_by?: number;
  verified_at?: string;
  file_url?: string;
  created_at: string;
  updated_at: string;
  verifier?: any;
}

export interface CreateLabOrderRequest {
  patient_id: number;
  doctor_id: number;
  appointment_id?: number;
  test_type_ids: number[];
  notes?: string;
}

export interface UpdateLabResultRequest {
  order_item_id: number;
  value: string;
  is_abnormal: boolean;
  notes?: string;
  file_url?: string;
}
