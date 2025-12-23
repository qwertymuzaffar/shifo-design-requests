/*
  # Create doctor schedules table

  1. New Tables
    - `doctor_schedules`
      - `id` (uuid, primary key)
      - `doctor_id` (integer, reference to external doctor system)
      - `day_of_week` (integer, 0-6 where 0 is Sunday, 6 is Saturday)
      - `is_working` (boolean, indicates if doctor works on this day)
      - `start_time` (time, start of working hours)
      - `end_time` (time, end of working hours)
      - `break_start` (time, optional break start time)
      - `break_end` (time, optional break end time)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `doctor_schedules` table
    - Add policy for authenticated users to read schedules
    - Add policy for authenticated users to manage schedules
  
  3. Indexes
    - Add index on doctor_id for faster lookups
    - Add unique constraint on doctor_id and day_of_week combination
*/

CREATE TABLE IF NOT EXISTS doctor_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id integer NOT NULL,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  is_working boolean DEFAULT true,
  start_time time DEFAULT '09:00:00',
  end_time time DEFAULT '18:00:00',
  break_start time,
  break_end time,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_doctor_day UNIQUE (doctor_id, day_of_week)
);

CREATE INDEX IF NOT EXISTS idx_doctor_schedules_doctor_id ON doctor_schedules(doctor_id);

ALTER TABLE doctor_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view schedules"
  ON doctor_schedules
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert schedules"
  ON doctor_schedules
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update schedules"
  ON doctor_schedules
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete schedules"
  ON doctor_schedules
  FOR DELETE
  TO authenticated
  USING (true);

CREATE OR REPLACE FUNCTION update_doctor_schedules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_doctor_schedules_updated_at'
  ) THEN
    CREATE TRIGGER update_doctor_schedules_updated_at
      BEFORE UPDATE ON doctor_schedules
      FOR EACH ROW
      EXECUTE FUNCTION update_doctor_schedules_updated_at();
  END IF;
END $$;