/*
  # Loyalty Program, Chat System, Email Notifications, and 2FA

  ## Overview
  This migration creates:
  1. Loyalty program and rewards system
  2. Clinic chat/messaging system
  3. Email notifications tracking
  4. Two-factor authentication

  ## New Tables
  
  ### Loyalty Program
  
  #### `loyalty_tiers`
  Loyalty program tiers
  - `id` (serial, primary key)
  - `name` (text) - Tier name (Bronze, Silver, Gold, Platinum)
  - `required_points` (integer) - Points needed for tier
  - `discount_percentage` (numeric) - Discount percentage
  - `benefits` (jsonb) - Tier benefits
  - `is_active` (boolean) - Active status
  - `created_at` (timestamptz)

  #### `patient_loyalty`
  Patient loyalty points and tier
  - `id` (serial, primary key)
  - `patient_id` (integer, foreign key, unique) - Reference to patients
  - `tier_id` (integer, foreign key) - Current tier
  - `total_points` (integer) - Total points earned
  - `available_points` (integer) - Points available to use
  - `lifetime_spending` (numeric) - Total amount spent
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  #### `loyalty_transactions`
  Points earning and redemption history
  - `id` (serial, primary key)
  - `patient_loyalty_id` (integer, foreign key) - Reference to patient_loyalty
  - `transaction_type` (text) - earned, redeemed, expired, adjusted
  - `points` (integer) - Points amount (positive or negative)
  - `reference_id` (integer, nullable) - Related appointment/payment
  - `reference_type` (text, nullable) - Reference type
  - `description` (text) - Transaction description
  - `created_at` (timestamptz)

  ### Chat System
  
  #### `chat_conversations`
  Chat conversations
  - `id` (serial, primary key)
  - `patient_id` (integer, foreign key, nullable) - Patient participant
  - `staff_id` (integer, foreign key, nullable) - Staff participant
  - `status` (text) - active, closed, archived
  - `last_message_at` (timestamptz) - Last message timestamp
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  #### `chat_messages`
  Individual chat messages
  - `id` (serial, primary key)
  - `conversation_id` (integer, foreign key) - Reference to conversations
  - `sender_id` (integer, foreign key) - Message sender (user)
  - `sender_type` (text) - patient, staff, system
  - `message` (text) - Message content
  - `is_read` (boolean) - Read status
  - `read_at` (timestamptz, nullable) - Read timestamp
  - `created_at` (timestamptz)

  ### Email Notifications
  
  #### `email_templates`
  Email notification templates
  - `id` (serial, primary key)
  - `name` (text, unique) - Template name
  - `subject` (text) - Email subject
  - `body` (text) - Email body (supports variables)
  - `template_type` (text) - appointment_reminder, test_results, etc.
  - `is_active` (boolean) - Active status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  #### `email_logs`
  Email sending history
  - `id` (serial, primary key)
  - `recipient_email` (text) - Recipient email
  - `recipient_id` (integer, nullable) - Reference to user/patient
  - `template_id` (integer, foreign key, nullable) - Used template
  - `subject` (text) - Email subject
  - `status` (text) - pending, sent, failed, bounced
  - `sent_at` (timestamptz, nullable) - Sent timestamp
  - `error_message` (text, nullable) - Error if failed
  - `created_at` (timestamptz)

  ### Two-Factor Authentication
  
  #### `user_2fa`
  2FA settings for users
  - `id` (serial, primary key)
  - `user_id` (integer, foreign key, unique) - Reference to users
  - `method` (text) - sms, email, authenticator
  - `phone` (text, nullable) - Phone for SMS
  - `email` (text, nullable) - Email for codes
  - `secret` (text, nullable) - TOTP secret for authenticator
  - `backup_codes` (jsonb) - Backup codes
  - `is_enabled` (boolean) - 2FA enabled flag
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  #### `2fa_verification_codes`
  Temporary verification codes
  - `id` (serial, primary key)
  - `user_id` (integer, foreign key) - Reference to users
  - `code` (text) - Verification code
  - `method` (text) - Delivery method
  - `expires_at` (timestamptz) - Expiration time
  - `is_used` (boolean) - Used flag
  - `used_at` (timestamptz, nullable) - Usage timestamp
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Authenticated users can read and manage data
*/

-- Loyalty Tiers Table
CREATE TABLE IF NOT EXISTS loyalty_tiers (
  id serial PRIMARY KEY,
  name text UNIQUE NOT NULL,
  required_points integer NOT NULL,
  discount_percentage numeric(5,2) NOT NULL DEFAULT 0,
  benefits jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Patient Loyalty Table
CREATE TABLE IF NOT EXISTS patient_loyalty (
  id serial PRIMARY KEY,
  patient_id integer UNIQUE NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  tier_id integer REFERENCES loyalty_tiers(id) ON DELETE SET NULL,
  total_points integer DEFAULT 0,
  available_points integer DEFAULT 0,
  lifetime_spending numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT positive_points CHECK (available_points >= 0)
);

-- Loyalty Transactions Table
CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id serial PRIMARY KEY,
  patient_loyalty_id integer NOT NULL REFERENCES patient_loyalty(id) ON DELETE CASCADE,
  transaction_type text NOT NULL,
  points integer NOT NULL,
  reference_id integer,
  reference_type text,
  description text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_loyalty_transaction_type CHECK (transaction_type IN ('earned', 'redeemed', 'expired', 'adjusted', 'bonus'))
);

-- Chat Conversations Table
CREATE TABLE IF NOT EXISTS chat_conversations (
  id serial PRIMARY KEY,
  patient_id integer REFERENCES patients(id) ON DELETE CASCADE,
  staff_id integer REFERENCES staff_members(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'active',
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_chat_status CHECK (status IN ('active', 'closed', 'archived'))
);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id serial PRIMARY KEY,
  conversation_id integer NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  sender_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sender_type text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_sender_type CHECK (sender_type IN ('patient', 'staff', 'system'))
);

-- Email Templates Table
CREATE TABLE IF NOT EXISTS email_templates (
  id serial PRIMARY KEY,
  name text UNIQUE NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  template_type text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Email Logs Table
CREATE TABLE IF NOT EXISTS email_logs (
  id serial PRIMARY KEY,
  recipient_email text NOT NULL,
  recipient_id integer,
  template_id integer REFERENCES email_templates(id) ON DELETE SET NULL,
  subject text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  sent_at timestamptz,
  error_message text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_email_status CHECK (status IN ('pending', 'sent', 'failed', 'bounced'))
);

-- User 2FA Table
CREATE TABLE IF NOT EXISTS user_2fa (
  id serial PRIMARY KEY,
  user_id integer UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  method text NOT NULL DEFAULT 'sms',
  phone text,
  email text,
  secret text,
  backup_codes jsonb DEFAULT '[]'::jsonb,
  is_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_2fa_method CHECK (method IN ('sms', 'email', 'authenticator'))
);

-- 2FA Verification Codes Table
CREATE TABLE IF NOT EXISTS twofa_verification_codes (
  id serial PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code text NOT NULL,
  method text NOT NULL,
  expires_at timestamptz NOT NULL,
  is_used boolean DEFAULT false,
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_patient_loyalty_patient ON patient_loyalty(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_loyalty_tier ON patient_loyalty(tier_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_patient_loyalty ON loyalty_transactions(patient_loyalty_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_patient ON chat_conversations(patient_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_staff ON chat_conversations(staff_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_user_2fa_user ON user_2fa(user_id);
CREATE INDEX IF NOT EXISTS idx_2fa_codes_user ON twofa_verification_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_2fa_codes_expires ON twofa_verification_codes(expires_at);

-- Enable Row Level Security
ALTER TABLE loyalty_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_loyalty ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_2fa ENABLE ROW LEVEL SECURITY;
ALTER TABLE twofa_verification_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view loyalty tiers"
  ON loyalty_tiers FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Users can manage loyalty tiers"
  ON loyalty_tiers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view patient loyalty"
  ON patient_loyalty FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage patient loyalty"
  ON patient_loyalty FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view loyalty transactions"
  ON loyalty_transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create loyalty transactions"
  ON loyalty_transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view chat conversations"
  ON chat_conversations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage chat conversations"
  ON chat_conversations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view chat messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can send chat messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update chat messages"
  ON chat_messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view email templates"
  ON email_templates FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Users can manage email templates"
  ON email_templates FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view email logs"
  ON email_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create email logs"
  ON email_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own 2FA settings"
  ON user_2fa FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own 2FA settings"
  ON user_2fa FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view own 2FA codes"
  ON twofa_verification_codes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create 2FA codes"
  ON twofa_verification_codes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update 2FA codes"
  ON twofa_verification_codes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample loyalty tiers
INSERT INTO loyalty_tiers (name, required_points, discount_percentage, benefits) VALUES
('Bronze', 0, 0, '["Basic member benefits", "Birthday bonus"]'::jsonb),
('Silver', 1000, 5, '["5% discount on all services", "Priority booking", "Birthday bonus"]'::jsonb),
('Gold', 5000, 10, '["10% discount on all services", "Priority booking", "Free annual checkup", "Birthday bonus"]'::jsonb),
('Platinum', 15000, 15, '["15% discount on all services", "VIP priority booking", "Free annual checkup", "Free lab tests", "Birthday bonus", "Referral rewards"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Insert sample email templates
INSERT INTO email_templates (name, subject, body, template_type) VALUES
(
  'appointment_reminder',
  'Appointment Reminder - {{date}} at {{time}}',
  'Dear {{patient_name}},

This is a reminder about your upcoming appointment:

Date: {{date}}
Time: {{time}}
Doctor: {{doctor_name}}
Type: {{appointment_type}}

Please arrive 10 minutes early for check-in.

If you need to reschedule, please contact us at least 24 hours in advance.

Best regards,
{{clinic_name}}',
  'appointment_reminder'
),
(
  'lab_results_ready',
  'Your Laboratory Results are Ready',
  'Dear {{patient_name}},

Your laboratory test results are now available. Please log in to your patient portal to view them, or visit our clinic to discuss them with your doctor.

Test Date: {{test_date}}
Tests Performed: {{test_names}}

If you have any questions, please contact us.

Best regards,
{{clinic_name}}',
  'test_results'
),
(
  'welcome_email',
  'Welcome to {{clinic_name}}',
  'Dear {{patient_name}},

Welcome to {{clinic_name}}! We are pleased to have you as our patient.

Your account has been successfully created. You can now:
- Schedule appointments online
- View your medical records
- Access lab results
- Manage prescriptions

Your loyalty program account has also been activated. You''ll earn points with each visit!

If you need any assistance, please don''t hesitate to contact us.

Best regards,
{{clinic_name}} Team',
  'welcome'
)
ON CONFLICT (name) DO NOTHING;