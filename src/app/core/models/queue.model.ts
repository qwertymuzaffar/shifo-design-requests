export interface QueueEntry {
  id: number;
  patient_id: number;
  appointment_id?: number;
  doctor_id?: number;
  queue_number: number;
  status: 'waiting' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  priority: number;
  check_in_time: string;
  called_time?: string;
  completed_time?: string;
  estimated_wait_minutes?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  patient?: any;
  doctor?: any;
}

export interface QueueDisplaySettings {
  id: number;
  location: string;
  show_queue_numbers: boolean;
  show_doctor_names: boolean;
  show_estimated_time: boolean;
  refresh_interval_seconds: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
