export interface ICD10Code {
  id: number;
  code: string;
  title: string;
  description?: string;
  category: string;
  is_active: boolean;
  created_at: string;
}

export interface PatientDiagnosis {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_id?: number;
  icd10_id: number;
  diagnosis_type: 'primary' | 'secondary' | 'provisional';
  diagnosed_at: string;
  notes?: string;
  status: 'active' | 'resolved' | 'chronic';
  resolved_at?: string;
  created_at: string;
  updated_at: string;
  patient?: any;
  doctor?: any;
  icd10_code?: ICD10Code;
}

export interface MedicalTemplate {
  id: number;
  name: string;
  category: string;
  content: string;
  fields: TemplateField[];
  created_by?: number;
  is_public: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TemplateField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'select';
  options?: string[];
}

export interface ExaminationRecord {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_id?: number;
  template_id?: number;
  content: string;
  data: Record<string, any>;
  examined_at: string;
  created_at: string;
  updated_at: string;
  patient?: any;
  doctor?: any;
  template?: MedicalTemplate;
}
