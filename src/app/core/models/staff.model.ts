export interface StaffRole {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface StaffMember {
  id: number;
  user_id: number;
  role_id: number;
  employee_number: string;
  department?: string;
  hire_date: string;
  salary?: number;
  emergency_contact: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user?: any;
  role?: StaffRole;
  schedules?: StaffSchedule[];
}

export interface StaffSchedule {
  id: number;
  staff_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StaffTimeOff {
  id: number;
  staff_id: number;
  leave_type: 'vacation' | 'sick_leave' | 'personal' | 'unpaid' | 'maternity' | 'paternity';
  start_date: string;
  end_date: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approved_by?: number;
  approved_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  staff?: StaffMember;
  approver?: any;
}

export interface StaffAttendance {
  id: number;
  staff_id: number;
  date: string;
  check_in: string;
  check_out?: string;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave';
  notes?: string;
  created_at: string;
  staff?: StaffMember;
}
