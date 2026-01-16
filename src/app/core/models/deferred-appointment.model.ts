import { PatientModel } from '@features/patients/models/patient.model';
import { Doctor } from '@features/doctor/models/doctor';

export interface DeferredAppointmentModel {
  id: string;
  patient_id: number;
  procedure_id?: number;
  procedure_name: string;
  notes?: string;
  status: 'pending' | 'taken' | 'cancelled';
  assigned_doctor_id?: number;
  created_at: string;
  updated_at: string;
  patient?: PatientModel;
  assigned_doctor?: Doctor;
}

export interface DeferredAppointmentCreateModel {
  patient_id: number;
  procedure_id?: number;
  procedure_name: string;
  notes?: string;
}

export interface DeferredAppointmentUpdateModel {
  status?: 'pending' | 'taken' | 'cancelled';
  assigned_doctor_id?: number;
  notes?: string;
}
