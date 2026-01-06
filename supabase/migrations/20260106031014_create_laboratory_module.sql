/*
  # Laboratory Tests Module

  ## Overview
  This migration creates the laboratory tests management system for tracking test orders, results, and history.

  ## New Tables
  
  ### `lab_test_types`
  Catalog of available laboratory tests
  - `id` (serial, primary key)
  - `name` (text) - Test name
  - `code` (text) - Test code/identifier
  - `description` (text) - Test description
  - `normal_range` (text) - Normal values range
  - `unit` (text) - Measurement unit
  - `price` (numeric) - Test price
  - `preparation_instructions` (text) - Patient preparation instructions
  - `turnaround_time_hours` (integer) - Expected result time in hours
  - `category` (text) - Test category (blood, urine, etc.)
  - `is_active` (boolean) - Active status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `lab_orders`
  Laboratory test orders
  - `id` (serial, primary key)
  - `patient_id` (integer, foreign key) - Reference to patients
  - `doctor_id` (integer, foreign key) - Ordering doctor
  - `appointment_id` (integer, foreign key, nullable) - Related appointment
  - `order_number` (text, unique) - Order tracking number
  - `status` (text) - pending, collected, processing, completed, cancelled
  - `ordered_at` (timestamptz) - Order date
  - `collected_at` (timestamptz, nullable) - Sample collection date
  - `completed_at` (timestamptz, nullable) - Results completion date
  - `notes` (text) - Additional notes
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `lab_order_items`
  Individual tests in an order
  - `id` (serial, primary key)
  - `order_id` (integer, foreign key) - Reference to lab_orders
  - `test_type_id` (integer, foreign key) - Reference to lab_test_types
  - `status` (text) - pending, processing, completed
  - `created_at` (timestamptz)

  ### `lab_results`
  Test results
  - `id` (serial, primary key)
  - `order_item_id` (integer, foreign key) - Reference to lab_order_items
  - `value` (text) - Result value
  - `is_abnormal` (boolean) - Flag for abnormal results
  - `notes` (text) - Technician notes
  - `verified_by` (integer, nullable) - Verifying doctor
  - `verified_at` (timestamptz, nullable)
  - `file_url` (text, nullable) - PDF/image of results
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Authenticated users can read and manage lab data
*/

-- Lab Test Types Table
CREATE TABLE IF NOT EXISTS lab_test_types (
  id serial PRIMARY KEY,
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  description text,
  normal_range text,
  unit text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  preparation_instructions text,
  turnaround_time_hours integer DEFAULT 24,
  category text NOT NULL DEFAULT 'general',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Lab Orders Table
CREATE TABLE IF NOT EXISTS lab_orders (
  id serial PRIMARY KEY,
  patient_id integer NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id integer NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
  appointment_id integer REFERENCES appointments(id) ON DELETE SET NULL,
  order_number text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  ordered_at timestamptz DEFAULT now(),
  collected_at timestamptz,
  completed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'collected', 'processing', 'completed', 'cancelled'))
);

-- Lab Order Items Table
CREATE TABLE IF NOT EXISTS lab_order_items (
  id serial PRIMARY KEY,
  order_id integer NOT NULL REFERENCES lab_orders(id) ON DELETE CASCADE,
  test_type_id integer NOT NULL REFERENCES lab_test_types(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_item_status CHECK (status IN ('pending', 'processing', 'completed'))
);

-- Lab Results Table
CREATE TABLE IF NOT EXISTS lab_results (
  id serial PRIMARY KEY,
  order_item_id integer NOT NULL REFERENCES lab_order_items(id) ON DELETE CASCADE,
  value text NOT NULL,
  is_abnormal boolean DEFAULT false,
  notes text,
  verified_by integer REFERENCES doctors(id) ON DELETE SET NULL,
  verified_at timestamptz,
  file_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_lab_orders_patient ON lab_orders(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_orders_doctor ON lab_orders(doctor_id);
CREATE INDEX IF NOT EXISTS idx_lab_orders_status ON lab_orders(status);
CREATE INDEX IF NOT EXISTS idx_lab_orders_ordered_at ON lab_orders(ordered_at);
CREATE INDEX IF NOT EXISTS idx_lab_order_items_order ON lab_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_lab_results_order_item ON lab_results(order_item_id);

-- Enable Row Level Security
ALTER TABLE lab_test_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lab_test_types
CREATE POLICY "Anyone can view active test types"
  ON lab_test_types FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage test types"
  ON lab_test_types FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for lab_orders
CREATE POLICY "Users can view lab orders"
  ON lab_orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create lab orders"
  ON lab_orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update lab orders"
  ON lab_orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete lab orders"
  ON lab_orders FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for lab_order_items
CREATE POLICY "Users can view lab order items"
  ON lab_order_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage lab order items"
  ON lab_order_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for lab_results
CREATE POLICY "Users can view lab results"
  ON lab_results FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage lab results"
  ON lab_results FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample lab test types
INSERT INTO lab_test_types (name, code, description, normal_range, unit, price, category) VALUES
('Complete Blood Count', 'CBC', 'Full blood analysis including RBC, WBC, platelets', 'See detailed ranges', 'cells/mcL', 250.00, 'blood'),
('Blood Glucose', 'GLU', 'Fasting blood sugar test', '70-100 mg/dL', 'mg/dL', 100.00, 'blood'),
('Lipid Panel', 'LIPID', 'Cholesterol and triglycerides', 'Total: <200 mg/dL', 'mg/dL', 350.00, 'blood'),
('Thyroid Panel', 'TSH', 'Thyroid function tests', 'TSH: 0.4-4.0 mIU/L', 'mIU/L', 450.00, 'blood'),
('Urinalysis', 'UA', 'Complete urine analysis', 'pH 5-8', 'various', 150.00, 'urine'),
('Liver Function', 'LFT', 'Liver enzymes panel', 'ALT <40 U/L, AST <40 U/L', 'U/L', 400.00, 'blood'),
('Kidney Function', 'RFT', 'Creatinine and urea', 'Creatinine 0.6-1.2 mg/dL', 'mg/dL', 300.00, 'blood'),
('Vitamin D', 'VIT-D', '25-Hydroxyvitamin D', '30-100 ng/mL', 'ng/mL', 500.00, 'blood'),
('Hemoglobin A1C', 'HBA1C', 'Average blood sugar over 3 months', '<5.7%', '%', 350.00, 'blood'),
('C-Reactive Protein', 'CRP', 'Inflammation marker', '<3.0 mg/L', 'mg/L', 300.00, 'blood')
ON CONFLICT (code) DO NOTHING;