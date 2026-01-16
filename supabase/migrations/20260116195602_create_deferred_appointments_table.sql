/*
  # Create deferred_appointments table

  1. New Tables
    - `deferred_appointments`
      - `id` (uuid, primary key) - Unique identifier
      - `patient_id` (integer) - Reference to patient
      - `procedure_id` (integer, nullable) - Reference to procedure
      - `procedure_name` (text) - Name of requested procedure
      - `notes` (text, nullable) - Additional notes
      - `status` (text, default 'pending') - Status: pending, taken, cancelled
      - `assigned_doctor_id` (integer, nullable) - Doctor who took the appointment
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Update timestamp

  2. Security
    - Enable RLS on `deferred_appointments` table
    - Add policies for authenticated users to view and manage deferred appointments
*/

CREATE TABLE IF NOT EXISTS deferred_appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id integer NOT NULL,
  procedure_id integer,
  procedure_name text NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  assigned_doctor_id integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE deferred_appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view deferred appointments"
  ON deferred_appointments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert deferred appointments"
  ON deferred_appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update deferred appointments"
  ON deferred_appointments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete deferred appointments"
  ON deferred_appointments
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_deferred_appointments_status ON deferred_appointments(status);
CREATE INDEX IF NOT EXISTS idx_deferred_appointments_patient_id ON deferred_appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_deferred_appointments_doctor_id ON deferred_appointments(assigned_doctor_id);
CREATE INDEX IF NOT EXISTS idx_deferred_appointments_created_at ON deferred_appointments(created_at DESC);
