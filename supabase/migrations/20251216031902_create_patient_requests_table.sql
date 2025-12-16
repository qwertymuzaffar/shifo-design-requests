/*
  # Create patient_requests table for Telegram bot registrations

  1. New Tables
    - `patient_requests`
      - `id` (uuid, primary key) - Unique identifier for the request
      - `full_name` (text) - Patient's full name
      - `phone` (text) - Patient's phone number
      - `birth_date` (date) - Patient's birth date
      - `address` (jsonb, nullable) - Patient's address information
      - `emergency_contact` (jsonb, nullable) - Emergency contact information
      - `allergies` (text, nullable) - Patient's allergies
      - `medical_history` (text, nullable) - Patient's medical history
      - `phone_insurance` (text, nullable) - Insurance phone number
      - `telegram_user_id` (text, nullable) - Telegram user ID for reference
      - `status` (text, default 'pending') - Request status: pending, approved, rejected
      - `reviewed_by` (uuid, nullable) - ID of user who reviewed the request
      - `review_notes` (text, nullable) - Notes from the reviewer
      - `created_at` (timestamptz) - When the request was created
      - `updated_at` (timestamptz) - When the request was last updated

  2. Security
    - Enable RLS on `patient_requests` table
    - Add policy for authenticated users to read all requests
    - Add policy for authenticated users to update requests (for approval/rejection)
    - Add policy for authenticated users to delete requests
*/

CREATE TABLE IF NOT EXISTS patient_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  birth_date date NOT NULL,
  address jsonb,
  emergency_contact jsonb,
  allergies text,
  medical_history text,
  phone_insurance text,
  telegram_user_id text,
  status text NOT NULL DEFAULT 'pending',
  reviewed_by uuid,
  review_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE patient_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all patient requests"
  ON patient_requests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert patient requests"
  ON patient_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update patient requests"
  ON patient_requests
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete patient requests"
  ON patient_requests
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_patient_requests_status ON patient_requests(status);
CREATE INDEX IF NOT EXISTS idx_patient_requests_created_at ON patient_requests(created_at DESC);