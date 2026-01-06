/*
  # Electronic Prescriptions Module

  ## Overview
  This migration creates the electronic prescription system for managing patient medications and prescriptions.

  ## New Tables
  
  ### `medications`
  Medication catalog
  - `id` (serial, primary key)
  - `name` (text) - Medication name
  - `generic_name` (text) - Generic/chemical name
  - `description` (text) - Medication description
  - `form` (text) - Tablet, capsule, syrup, injection, etc.
  - `strength` (text) - Dosage strength (e.g., "500mg")
  - `manufacturer` (text) - Manufacturer name
  - `contraindications` (text) - Contraindications
  - `side_effects` (text) - Common side effects
  - `is_active` (boolean) - Active status
  - `requires_prescription` (boolean) - Prescription required flag
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `prescriptions`
  Prescription orders
  - `id` (serial, primary key)
  - `patient_id` (integer, foreign key) - Reference to patients
  - `doctor_id` (integer, foreign key) - Prescribing doctor
  - `appointment_id` (integer, foreign key, nullable) - Related appointment
  - `prescription_number` (text, unique) - Prescription tracking number
  - `diagnosis` (text) - Diagnosis for prescription
  - `notes` (text) - Additional notes
  - `status` (text) - active, completed, cancelled
  - `issued_at` (timestamptz) - Issue date
  - `expires_at` (timestamptz) - Expiration date
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `prescription_items`
  Individual medications in a prescription
  - `id` (serial, primary key)
  - `prescription_id` (integer, foreign key) - Reference to prescriptions
  - `medication_id` (integer, foreign key) - Reference to medications
  - `dosage` (text) - Dosage instructions (e.g., "2 tablets")
  - `frequency` (text) - Frequency (e.g., "3 times daily")
  - `duration_days` (integer) - Treatment duration in days
  - `quantity` (integer) - Total quantity to dispense
  - `instructions` (text) - Special instructions
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Authenticated users can read and manage prescription data
*/

-- Medications Table
CREATE TABLE IF NOT EXISTS medications (
  id serial PRIMARY KEY,
  name text NOT NULL,
  generic_name text,
  description text,
  form text NOT NULL DEFAULT 'tablet',
  strength text,
  manufacturer text,
  contraindications text,
  side_effects text,
  is_active boolean DEFAULT true,
  requires_prescription boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index on medication name for faster search
CREATE INDEX IF NOT EXISTS idx_medications_name ON medications(name);

-- Prescriptions Table
CREATE TABLE IF NOT EXISTS prescriptions (
  id serial PRIMARY KEY,
  patient_id integer NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id integer NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
  appointment_id integer REFERENCES appointments(id) ON DELETE SET NULL,
  prescription_number text UNIQUE NOT NULL,
  diagnosis text,
  notes text,
  status text NOT NULL DEFAULT 'active',
  issued_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_prescription_status CHECK (status IN ('active', 'completed', 'cancelled'))
);

-- Prescription Items Table
CREATE TABLE IF NOT EXISTS prescription_items (
  id serial PRIMARY KEY,
  prescription_id integer NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  medication_id integer NOT NULL REFERENCES medications(id) ON DELETE RESTRICT,
  dosage text NOT NULL,
  frequency text NOT NULL,
  duration_days integer NOT NULL,
  quantity integer NOT NULL,
  instructions text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor ON prescriptions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_status ON prescriptions(status);
CREATE INDEX IF NOT EXISTS idx_prescriptions_issued_at ON prescriptions(issued_at);
CREATE INDEX IF NOT EXISTS idx_prescription_items_prescription ON prescription_items(prescription_id);

-- Enable Row Level Security
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for medications
CREATE POLICY "Anyone can view active medications"
  ON medications FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage medications"
  ON medications FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for prescriptions
CREATE POLICY "Users can view prescriptions"
  ON prescriptions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create prescriptions"
  ON prescriptions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update prescriptions"
  ON prescriptions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete prescriptions"
  ON prescriptions FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for prescription_items
CREATE POLICY "Users can view prescription items"
  ON prescription_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage prescription items"
  ON prescription_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample medications
INSERT INTO medications (name, generic_name, description, form, strength, manufacturer, contraindications, side_effects) VALUES
('Paracetamol', 'Acetaminophen', 'Pain reliever and fever reducer', 'tablet', '500mg', 'Various', 'Severe liver disease', 'Nausea, rash'),
('Ibuprofen', 'Ibuprofen', 'Anti-inflammatory pain reliever', 'tablet', '400mg', 'Various', 'Stomach ulcers, kidney disease', 'Stomach upset, dizziness'),
('Amoxicillin', 'Amoxicillin', 'Antibiotic for bacterial infections', 'capsule', '500mg', 'Various', 'Penicillin allergy', 'Diarrhea, nausea'),
('Omeprazole', 'Omeprazole', 'Reduces stomach acid', 'capsule', '20mg', 'Various', 'Severe liver disease', 'Headache, diarrhea'),
('Metformin', 'Metformin', 'Diabetes medication', 'tablet', '500mg', 'Various', 'Kidney disease, severe heart failure', 'Nausea, diarrhea'),
('Atorvastatin', 'Atorvastatin', 'Cholesterol-lowering medication', 'tablet', '20mg', 'Various', 'Active liver disease, pregnancy', 'Muscle pain, headache'),
('Lisinopril', 'Lisinopril', 'Blood pressure medication', 'tablet', '10mg', 'Various', 'Pregnancy, history of angioedema', 'Dizziness, cough'),
('Levothyroxine', 'Levothyroxine', 'Thyroid hormone replacement', 'tablet', '50mcg', 'Various', 'Untreated adrenal insufficiency', 'Palpitations, weight loss'),
('Salbutamol', 'Albuterol', 'Bronchodilator for asthma', 'inhaler', '100mcg', 'Various', 'Hypersensitivity to albuterol', 'Tremor, nervousness'),
('Cetirizine', 'Cetirizine', 'Antihistamine for allergies', 'tablet', '10mg', 'Various', 'Severe kidney disease', 'Drowsiness, dry mouth')
ON CONFLICT DO NOTHING;