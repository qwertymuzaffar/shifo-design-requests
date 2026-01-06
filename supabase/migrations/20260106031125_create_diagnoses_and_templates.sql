/*
  # ICD-10 Diagnoses and Medical Templates Module

  ## Overview
  This migration creates:
  1. ICD-10 diagnosis codes catalog
  2. Patient diagnoses history
  3. Medical examination templates for doctors

  ## New Tables
  
  ### `icd10_codes`
  International Classification of Diseases (ICD-10) codes
  - `id` (serial, primary key)
  - `code` (text, unique) - ICD-10 code (e.g., "A00.0")
  - `title` (text) - Short title
  - `description` (text) - Full description
  - `category` (text) - Disease category
  - `is_active` (boolean) - Active status
  - `created_at` (timestamptz)

  ### `patient_diagnoses`
  Patient diagnosis history
  - `id` (serial, primary key)
  - `patient_id` (integer, foreign key) - Reference to patients
  - `doctor_id` (integer, foreign key) - Diagnosing doctor
  - `appointment_id` (integer, foreign key, nullable) - Related appointment
  - `icd10_id` (integer, foreign key) - Reference to ICD-10 code
  - `diagnosis_type` (text) - primary, secondary, provisional
  - `diagnosed_at` (timestamptz) - Diagnosis date
  - `notes` (text) - Additional notes
  - `status` (text) - active, resolved, chronic
  - `resolved_at` (timestamptz, nullable) - Resolution date
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `medical_templates`
  Pre-defined templates for medical examinations
  - `id` (serial, primary key)
  - `name` (text) - Template name
  - `category` (text) - Template category
  - `content` (text) - Template content/structure
  - `fields` (jsonb) - Dynamic fields configuration
  - `created_by` (integer, foreign key) - Creator doctor
  - `is_public` (boolean) - Available to all doctors
  - `is_active` (boolean) - Active status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `examination_records`
  Completed examination records using templates
  - `id` (serial, primary key)
  - `patient_id` (integer, foreign key) - Reference to patients
  - `doctor_id` (integer, foreign key) - Examining doctor
  - `appointment_id` (integer, foreign key) - Related appointment
  - `template_id` (integer, foreign key, nullable) - Used template
  - `content` (text) - Examination findings
  - `data` (jsonb) - Structured data from template fields
  - `examined_at` (timestamptz) - Examination date
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Authenticated users can read and manage data
*/

-- ICD-10 Codes Table
CREATE TABLE IF NOT EXISTS icd10_codes (
  id serial PRIMARY KEY,
  code text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster search
CREATE INDEX IF NOT EXISTS idx_icd10_codes_code ON icd10_codes(code);
CREATE INDEX IF NOT EXISTS idx_icd10_codes_title ON icd10_codes(title);
CREATE INDEX IF NOT EXISTS idx_icd10_codes_category ON icd10_codes(category);

-- Patient Diagnoses Table
CREATE TABLE IF NOT EXISTS patient_diagnoses (
  id serial PRIMARY KEY,
  patient_id integer NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id integer NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
  appointment_id integer REFERENCES appointments(id) ON DELETE SET NULL,
  icd10_id integer NOT NULL REFERENCES icd10_codes(id) ON DELETE RESTRICT,
  diagnosis_type text NOT NULL DEFAULT 'primary',
  diagnosed_at timestamptz DEFAULT now(),
  notes text,
  status text NOT NULL DEFAULT 'active',
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_diagnosis_type CHECK (diagnosis_type IN ('primary', 'secondary', 'provisional')),
  CONSTRAINT valid_diagnosis_status CHECK (status IN ('active', 'resolved', 'chronic'))
);

-- Medical Templates Table
CREATE TABLE IF NOT EXISTS medical_templates (
  id serial PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  content text NOT NULL,
  fields jsonb DEFAULT '[]'::jsonb,
  created_by integer REFERENCES doctors(id) ON DELETE SET NULL,
  is_public boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Examination Records Table
CREATE TABLE IF NOT EXISTS examination_records (
  id serial PRIMARY KEY,
  patient_id integer NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id integer NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
  appointment_id integer REFERENCES appointments(id) ON DELETE SET NULL,
  template_id integer REFERENCES medical_templates(id) ON DELETE SET NULL,
  content text NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  examined_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_patient_diagnoses_patient ON patient_diagnoses(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_diagnoses_doctor ON patient_diagnoses(doctor_id);
CREATE INDEX IF NOT EXISTS idx_patient_diagnoses_status ON patient_diagnoses(status);
CREATE INDEX IF NOT EXISTS idx_medical_templates_category ON medical_templates(category);
CREATE INDEX IF NOT EXISTS idx_medical_templates_created_by ON medical_templates(created_by);
CREATE INDEX IF NOT EXISTS idx_examination_records_patient ON examination_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_examination_records_doctor ON examination_records(doctor_id);

-- Enable Row Level Security
ALTER TABLE icd10_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE examination_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for icd10_codes
CREATE POLICY "Anyone can view active ICD-10 codes"
  ON icd10_codes FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage ICD-10 codes"
  ON icd10_codes FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for patient_diagnoses
CREATE POLICY "Users can view patient diagnoses"
  ON patient_diagnoses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage patient diagnoses"
  ON patient_diagnoses FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for medical_templates
CREATE POLICY "Users can view active templates"
  ON medical_templates FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Users can manage templates"
  ON medical_templates FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for examination_records
CREATE POLICY "Users can view examination records"
  ON examination_records FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage examination records"
  ON examination_records FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample ICD-10 codes (common diagnoses)
INSERT INTO icd10_codes (code, title, description, category) VALUES
('J00', 'Acute nasopharyngitis (common cold)', 'Common cold, acute upper respiratory infection', 'Respiratory'),
('J06.9', 'Acute upper respiratory infection', 'Upper respiratory infection, unspecified', 'Respiratory'),
('I10', 'Essential hypertension', 'High blood pressure', 'Cardiovascular'),
('E11', 'Type 2 diabetes mellitus', 'Non-insulin-dependent diabetes', 'Endocrine'),
('M54.5', 'Low back pain', 'Lumbar pain', 'Musculoskeletal'),
('K21.9', 'Gastro-esophageal reflux disease', 'GERD without esophagitis', 'Digestive'),
('F41.9', 'Anxiety disorder, unspecified', 'Anxiety disorder', 'Mental'),
('J45.9', 'Asthma, unspecified', 'Bronchial asthma', 'Respiratory'),
('E78.5', 'Hyperlipidemia, unspecified', 'High cholesterol', 'Endocrine'),
('R51', 'Headache', 'Pain in head', 'Symptoms'),
('A09', 'Gastroenteritis', 'Diarrhea and gastroenteritis', 'Infectious'),
('J18.9', 'Pneumonia, unspecified', 'Lung infection', 'Respiratory'),
('N39.0', 'Urinary tract infection', 'UTI, site not specified', 'Genitourinary'),
('L20.9', 'Atopic dermatitis', 'Eczema', 'Skin'),
('H10.9', 'Conjunctivitis', 'Pink eye', 'Eye')
ON CONFLICT (code) DO NOTHING;

-- Insert sample medical templates
INSERT INTO medical_templates (name, category, content, fields, is_public) VALUES
(
  'General Physical Examination',
  'General',
  'GENERAL APPEARANCE: [general_appearance]
VITAL SIGNS: BP: [bp], Pulse: [pulse], Temp: [temperature], RR: [respiratory_rate]
HEAD & NECK: [head_neck]
CARDIOVASCULAR: [cardiovascular]
RESPIRATORY: [respiratory]
ABDOMEN: [abdomen]
EXTREMITIES: [extremities]
NEUROLOGICAL: [neurological]
ASSESSMENT: [assessment]
PLAN: [plan]',
  '[
    {"name": "general_appearance", "label": "General Appearance", "type": "text"},
    {"name": "bp", "label": "Blood Pressure", "type": "text"},
    {"name": "pulse", "label": "Pulse", "type": "text"},
    {"name": "temperature", "label": "Temperature", "type": "text"},
    {"name": "respiratory_rate", "label": "Respiratory Rate", "type": "text"},
    {"name": "head_neck", "label": "Head & Neck", "type": "text"},
    {"name": "cardiovascular", "label": "Cardiovascular", "type": "text"},
    {"name": "respiratory", "label": "Respiratory", "type": "text"},
    {"name": "abdomen", "label": "Abdomen", "type": "text"},
    {"name": "extremities", "label": "Extremities", "type": "text"},
    {"name": "neurological", "label": "Neurological", "type": "text"},
    {"name": "assessment", "label": "Assessment", "type": "textarea"},
    {"name": "plan", "label": "Plan", "type": "textarea"}
  ]'::jsonb,
  true
),
(
  'Pediatric Examination',
  'Pediatrics',
  'CHIEF COMPLAINT: [chief_complaint]
GROWTH: Height: [height] cm, Weight: [weight] kg
DEVELOPMENT: [development]
GENERAL: [general]
HEENT: [heent]
CHEST: [chest]
CARDIOVASCULAR: [cardiovascular]
ABDOMEN: [abdomen]
SKIN: [skin]
ASSESSMENT: [assessment]
RECOMMENDATIONS: [recommendations]',
  '[
    {"name": "chief_complaint", "label": "Chief Complaint", "type": "text"},
    {"name": "height", "label": "Height (cm)", "type": "number"},
    {"name": "weight", "label": "Weight (kg)", "type": "number"},
    {"name": "development", "label": "Development", "type": "text"},
    {"name": "general", "label": "General", "type": "text"},
    {"name": "heent", "label": "HEENT", "type": "text"},
    {"name": "chest", "label": "Chest", "type": "text"},
    {"name": "cardiovascular", "label": "Cardiovascular", "type": "text"},
    {"name": "abdomen", "label": "Abdomen", "type": "text"},
    {"name": "skin", "label": "Skin", "type": "text"},
    {"name": "assessment", "label": "Assessment", "type": "textarea"},
    {"name": "recommendations", "label": "Recommendations", "type": "textarea"}
  ]'::jsonb,
  true
),
(
  'Dental Examination',
  'Dentistry',
  'DENTAL EXAMINATION
Chief Complaint: [chief_complaint]
Oral Hygiene: [oral_hygiene]
Gingiva: [gingiva]
Teeth Status: [teeth_status]
Occlusion: [occlusion]
Radiographic Findings: [radiographic]
Diagnosis: [diagnosis]
Treatment Plan: [treatment_plan]',
  '[
    {"name": "chief_complaint", "label": "Chief Complaint", "type": "text"},
    {"name": "oral_hygiene", "label": "Oral Hygiene", "type": "text"},
    {"name": "gingiva", "label": "Gingiva", "type": "text"},
    {"name": "teeth_status", "label": "Teeth Status", "type": "textarea"},
    {"name": "occlusion", "label": "Occlusion", "type": "text"},
    {"name": "radiographic", "label": "Radiographic Findings", "type": "textarea"},
    {"name": "diagnosis", "label": "Diagnosis", "type": "textarea"},
    {"name": "treatment_plan", "label": "Treatment Plan", "type": "textarea"}
  ]'::jsonb,
  true
)
ON CONFLICT DO NOTHING;