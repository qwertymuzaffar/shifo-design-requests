/*
  # Add SMS Notifications Field

  ## Changes
  1. Add `sms_notifications_enabled` column to `patients` table
     - Type: boolean
     - Default: false
     - Description: Controls whether SMS notifications are sent to patient's phone number

  2. Add `sms_notifications_enabled` column to `users` table
     - Type: boolean
     - Default: false
     - Description: Controls whether SMS notifications are sent to user's (doctor's) phone number

  ## Notes
  - Both fields default to false to ensure notifications are opt-in
  - Can be toggled via patient and doctor edit forms
*/

-- Add SMS notifications field to patients table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'patients' AND column_name = 'sms_notifications_enabled'
  ) THEN
    ALTER TABLE patients ADD COLUMN sms_notifications_enabled boolean DEFAULT false;
  END IF;
END $$;

-- Add SMS notifications field to users table (for doctors)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'sms_notifications_enabled'
  ) THEN
    ALTER TABLE users ADD COLUMN sms_notifications_enabled boolean DEFAULT false;
  END IF;
END $$;
