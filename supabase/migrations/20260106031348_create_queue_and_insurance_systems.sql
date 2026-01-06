/*
  # Queue System and Insurance Module

  ## Overview
  This migration creates:
  1. Real-time queue management system
  2. Insurance companies and patient insurance tracking

  ## New Tables
  
  ### Queue System
  
  #### `queue_entries`
  Real-time patient queue
  - `id` (serial, primary key)
  - `patient_id` (integer, foreign key) - Reference to patients
  - `appointment_id` (integer, foreign key, nullable) - Related appointment
  - `doctor_id` (integer, foreign key, nullable) - Doctor to see
  - `queue_number` (integer) - Queue ticket number
  - `status` (text) - waiting, in_progress, completed, cancelled, no_show
  - `priority` (integer) - Priority level (1=highest)
  - `check_in_time` (timestamptz) - Check-in time
  - `called_time` (timestamptz, nullable) - Time patient was called
  - `completed_time` (timestamptz, nullable) - Completion time
  - `estimated_wait_minutes` (integer) - Estimated wait time
  - `notes` (text) - Notes
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  #### `queue_display_settings`
  Display board configuration
  - `id` (serial, primary key)
  - `location` (text) - Display location
  - `show_queue_numbers` (boolean) - Show queue numbers
  - `show_doctor_names` (boolean) - Show doctor names
  - `show_estimated_time` (boolean) - Show wait times
  - `refresh_interval_seconds` (integer) - Auto-refresh interval
  - `is_active` (boolean) - Active status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### Insurance System
  
  #### `insurance_companies`
  Insurance provider catalog
  - `id` (serial, primary key)
  - `name` (text) - Company name
  - `code` (text, unique) - Company code
  - `contact_email` (text) - Contact email
  - `contact_phone` (text) - Contact phone
  - `address` (text) - Company address
  - `coverage_percentage` (numeric) - Default coverage percentage
  - `is_active` (boolean) - Active status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  #### `insurance_plans`
  Insurance plans offered by companies
  - `id` (serial, primary key)
  - `company_id` (integer, foreign key) - Reference to insurance_companies
  - `plan_name` (text) - Plan name
  - `plan_code` (text) - Plan code
  - `coverage_percentage` (numeric) - Coverage percentage
  - `max_coverage_amount` (numeric) - Maximum coverage amount
  - `deductible` (numeric) - Deductible amount
  - `copay` (numeric) - Copay amount
  - `is_active` (boolean) - Active status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  #### `patient_insurance`
  Patient insurance information
  - `id` (serial, primary key)
  - `patient_id` (integer, foreign key) - Reference to patients
  - `plan_id` (integer, foreign key) - Reference to insurance_plans
  - `policy_number` (text) - Policy number
  - `group_number` (text, nullable) - Group number
  - `start_date` (date) - Coverage start date
  - `end_date` (date, nullable) - Coverage end date
  - `is_primary` (boolean) - Primary insurance flag
  - `is_active` (boolean) - Active status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  #### `insurance_claims`
  Insurance claims for appointments
  - `id` (serial, primary key)
  - `appointment_id` (integer, foreign key) - Reference to appointments
  - `patient_insurance_id` (integer, foreign key) - Patient insurance
  - `claim_number` (text, unique) - Claim tracking number
  - `claim_amount` (numeric) - Total claim amount
  - `approved_amount` (numeric, nullable) - Approved amount
  - `status` (text) - submitted, processing, approved, rejected, paid
  - `submitted_at` (timestamptz) - Submission date
  - `processed_at` (timestamptz, nullable) - Processing date
  - `notes` (text) - Notes
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Authenticated users can read and manage data
*/

-- Queue Entries Table
CREATE TABLE IF NOT EXISTS queue_entries (
  id serial PRIMARY KEY,
  patient_id integer NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id integer REFERENCES appointments(id) ON DELETE SET NULL,
  doctor_id integer REFERENCES doctors(id) ON DELETE SET NULL,
  queue_number integer NOT NULL,
  status text NOT NULL DEFAULT 'waiting',
  priority integer NOT NULL DEFAULT 5,
  check_in_time timestamptz DEFAULT now(),
  called_time timestamptz,
  completed_time timestamptz,
  estimated_wait_minutes integer,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_queue_status CHECK (status IN ('waiting', 'in_progress', 'completed', 'cancelled', 'no_show'))
);

-- Queue Display Settings Table
CREATE TABLE IF NOT EXISTS queue_display_settings (
  id serial PRIMARY KEY,
  location text NOT NULL,
  show_queue_numbers boolean DEFAULT true,
  show_doctor_names boolean DEFAULT true,
  show_estimated_time boolean DEFAULT true,
  refresh_interval_seconds integer DEFAULT 30,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insurance Companies Table
CREATE TABLE IF NOT EXISTS insurance_companies (
  id serial PRIMARY KEY,
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  contact_email text,
  contact_phone text,
  address text,
  coverage_percentage numeric(5,2) DEFAULT 80.00,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insurance Plans Table
CREATE TABLE IF NOT EXISTS insurance_plans (
  id serial PRIMARY KEY,
  company_id integer NOT NULL REFERENCES insurance_companies(id) ON DELETE CASCADE,
  plan_name text NOT NULL,
  plan_code text NOT NULL,
  coverage_percentage numeric(5,2) DEFAULT 80.00,
  max_coverage_amount numeric(10,2),
  deductible numeric(10,2) DEFAULT 0,
  copay numeric(10,2) DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Patient Insurance Table
CREATE TABLE IF NOT EXISTS patient_insurance (
  id serial PRIMARY KEY,
  patient_id integer NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  plan_id integer NOT NULL REFERENCES insurance_plans(id) ON DELETE RESTRICT,
  policy_number text NOT NULL,
  group_number text,
  start_date date NOT NULL,
  end_date date,
  is_primary boolean DEFAULT true,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insurance Claims Table
CREATE TABLE IF NOT EXISTS insurance_claims (
  id serial PRIMARY KEY,
  appointment_id integer NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  patient_insurance_id integer NOT NULL REFERENCES patient_insurance(id) ON DELETE RESTRICT,
  claim_number text UNIQUE NOT NULL,
  claim_amount numeric(10,2) NOT NULL,
  approved_amount numeric(10,2),
  status text NOT NULL DEFAULT 'submitted',
  submitted_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_claim_status CHECK (status IN ('submitted', 'processing', 'approved', 'rejected', 'paid'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_queue_entries_patient ON queue_entries(patient_id);
CREATE INDEX IF NOT EXISTS idx_queue_entries_doctor ON queue_entries(doctor_id);
CREATE INDEX IF NOT EXISTS idx_queue_entries_status ON queue_entries(status);
CREATE INDEX IF NOT EXISTS idx_queue_entries_check_in ON queue_entries(check_in_time);
CREATE INDEX IF NOT EXISTS idx_insurance_plans_company ON insurance_plans(company_id);
CREATE INDEX IF NOT EXISTS idx_patient_insurance_patient ON patient_insurance(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_insurance_plan ON patient_insurance(plan_id);
CREATE INDEX IF NOT EXISTS idx_insurance_claims_appointment ON insurance_claims(appointment_id);
CREATE INDEX IF NOT EXISTS idx_insurance_claims_status ON insurance_claims(status);

-- Enable Row Level Security
ALTER TABLE queue_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_display_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_insurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_claims ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view queue entries"
  ON queue_entries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage queue entries"
  ON queue_entries FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view display settings"
  ON queue_display_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage display settings"
  ON queue_display_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view insurance companies"
  ON insurance_companies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage insurance companies"
  ON insurance_companies FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view insurance plans"
  ON insurance_plans FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage insurance plans"
  ON insurance_plans FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view patient insurance"
  ON patient_insurance FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage patient insurance"
  ON patient_insurance FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view insurance claims"
  ON insurance_claims FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage insurance claims"
  ON insurance_claims FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample insurance companies
INSERT INTO insurance_companies (name, code, contact_email, contact_phone, coverage_percentage) VALUES
('National Health Insurance', 'NHI', 'info@nhi.tj', '+992-123-456-789', 80.00),
('State Insurance Company', 'SIC', 'contact@sic.tj', '+992-123-456-790', 70.00),
('Private Medical Insurance', 'PMI', 'support@pmi.tj', '+992-123-456-791', 90.00),
('Corporate Health Plan', 'CHP', 'service@chp.tj', '+992-123-456-792', 85.00),
('Family Care Insurance', 'FCI', 'hello@fci.tj', '+992-123-456-793', 75.00)
ON CONFLICT (code) DO NOTHING;

-- Insert sample insurance plans
INSERT INTO insurance_plans (company_id, plan_name, plan_code, coverage_percentage, max_coverage_amount, deductible, copay)
SELECT id, 'Basic Plan', 'BASIC', 70.00, 50000.00, 1000.00, 100.00
FROM insurance_companies WHERE code = 'NHI' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO insurance_plans (company_id, plan_name, plan_code, coverage_percentage, max_coverage_amount, deductible, copay)
SELECT id, 'Premium Plan', 'PREMIUM', 90.00, 100000.00, 500.00, 50.00
FROM insurance_companies WHERE code = 'PMI' LIMIT 1
ON CONFLICT DO NOTHING;

-- Insert sample queue display setting
INSERT INTO queue_display_settings (location, show_queue_numbers, show_doctor_names, show_estimated_time, refresh_interval_seconds)
VALUES ('Main Waiting Room', true, true, true, 30)
ON CONFLICT DO NOTHING;