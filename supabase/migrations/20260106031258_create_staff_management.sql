/*
  # Staff Management Module

  ## Overview
  This migration creates the staff management system for managing all clinic personnel including nurses, administrators, and other staff.

  ## New Tables
  
  ### `staff_roles`
  Staff roles catalog
  - `id` (serial, primary key)
  - `name` (text) - Role name (nurse, receptionist, lab_technician, etc.)
  - `description` (text) - Role description
  - `is_active` (boolean) - Active status
  - `created_at` (timestamptz)

  ### `staff_members`
  Staff members information
  - `id` (serial, primary key)
  - `user_id` (integer, foreign key) - Reference to users table
  - `role_id` (integer, foreign key) - Reference to staff_roles
  - `employee_number` (text, unique) - Employee ID
  - `department` (text) - Department name
  - `hire_date` (date) - Date of hiring
  - `salary` (numeric) - Monthly salary
  - `emergency_contact` (jsonb) - Emergency contact info
  - `is_active` (boolean) - Active status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `staff_schedules`
  Staff work schedules
  - `id` (serial, primary key)
  - `staff_id` (integer, foreign key) - Reference to staff_members
  - `day_of_week` (integer) - Day of week (0=Sunday, 6=Saturday)
  - `start_time` (time) - Shift start time
  - `end_time` (time) - Shift end time
  - `is_active` (boolean) - Active status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `staff_time_off`
  Staff leave and time off requests
  - `id` (serial, primary key)
  - `staff_id` (integer, foreign key) - Reference to staff_members
  - `leave_type` (text) - vacation, sick_leave, personal, unpaid
  - `start_date` (date) - Leave start date
  - `end_date` (date) - Leave end date
  - `reason` (text) - Reason for leave
  - `status` (text) - pending, approved, rejected
  - `approved_by` (integer, nullable) - Approving user
  - `approved_at` (timestamptz, nullable)
  - `notes` (text) - Additional notes
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `staff_attendance`
  Daily attendance tracking
  - `id` (serial, primary key)
  - `staff_id` (integer, foreign key) - Reference to staff_members
  - `date` (date) - Attendance date
  - `check_in` (timestamptz) - Check-in time
  - `check_out` (timestamptz, nullable) - Check-out time
  - `status` (text) - present, absent, late, half_day
  - `notes` (text) - Notes
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Authenticated users can read and manage staff data
*/

-- Staff Roles Table
CREATE TABLE IF NOT EXISTS staff_roles (
  id serial PRIMARY KEY,
  name text UNIQUE NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Staff Members Table
CREATE TABLE IF NOT EXISTS staff_members (
  id serial PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id integer NOT NULL REFERENCES staff_roles(id) ON DELETE RESTRICT,
  employee_number text UNIQUE NOT NULL,
  department text,
  hire_date date NOT NULL,
  salary numeric(10,2),
  emergency_contact jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Staff Schedules Table
CREATE TABLE IF NOT EXISTS staff_schedules (
  id serial PRIMARY KEY,
  staff_id integer NOT NULL REFERENCES staff_members(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_day_of_week CHECK (day_of_week >= 0 AND day_of_week <= 6),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Staff Time Off Table
CREATE TABLE IF NOT EXISTS staff_time_off (
  id serial PRIMARY KEY,
  staff_id integer NOT NULL REFERENCES staff_members(id) ON DELETE CASCADE,
  leave_type text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text,
  status text NOT NULL DEFAULT 'pending',
  approved_by integer REFERENCES users(id) ON DELETE SET NULL,
  approved_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_leave_type CHECK (leave_type IN ('vacation', 'sick_leave', 'personal', 'unpaid', 'maternity', 'paternity')),
  CONSTRAINT valid_time_off_status CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Staff Attendance Table
CREATE TABLE IF NOT EXISTS staff_attendance (
  id serial PRIMARY KEY,
  staff_id integer NOT NULL REFERENCES staff_members(id) ON DELETE CASCADE,
  date date NOT NULL,
  check_in timestamptz NOT NULL,
  check_out timestamptz,
  status text NOT NULL DEFAULT 'present',
  notes text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_attendance_status CHECK (status IN ('present', 'absent', 'late', 'half_day', 'on_leave')),
  CONSTRAINT unique_staff_date UNIQUE (staff_id, date)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_staff_members_user ON staff_members(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_members_role ON staff_members(role_id);
CREATE INDEX IF NOT EXISTS idx_staff_members_is_active ON staff_members(is_active);
CREATE INDEX IF NOT EXISTS idx_staff_schedules_staff ON staff_schedules(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_time_off_staff ON staff_time_off(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_time_off_dates ON staff_time_off(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_staff_time_off_status ON staff_time_off(status);
CREATE INDEX IF NOT EXISTS idx_staff_attendance_staff ON staff_attendance(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_attendance_date ON staff_attendance(date);

-- Enable Row Level Security
ALTER TABLE staff_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_time_off ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_attendance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for staff_roles
CREATE POLICY "Users can view active staff roles"
  ON staff_roles FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Users can manage staff roles"
  ON staff_roles FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for staff_members
CREATE POLICY "Users can view staff members"
  ON staff_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage staff members"
  ON staff_members FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for staff_schedules
CREATE POLICY "Users can view staff schedules"
  ON staff_schedules FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage staff schedules"
  ON staff_schedules FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for staff_time_off
CREATE POLICY "Users can view time off requests"
  ON staff_time_off FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage time off requests"
  ON staff_time_off FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for staff_attendance
CREATE POLICY "Users can view attendance"
  ON staff_attendance FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage attendance"
  ON staff_attendance FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample staff roles
INSERT INTO staff_roles (name, description) VALUES
('Nurse', 'Registered nurse providing patient care'),
('Receptionist', 'Front desk and patient registration'),
('Lab Technician', 'Laboratory testing and analysis'),
('Pharmacist', 'Medication dispensing and consultation'),
('Medical Assistant', 'Assists doctors with patient care'),
('Radiologist', 'Medical imaging specialist'),
('Cleaner', 'Facility cleaning and maintenance'),
('Administrator', 'Administrative and management staff'),
('Accountant', 'Financial management and bookkeeping'),
('IT Support', 'Technical support and system maintenance')
ON CONFLICT (name) DO NOTHING;