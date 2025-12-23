/*
  # Create Core Tables and Add Mock Data
  
  ## New Tables
  
  ### 1. roles
    - `id` (integer, primary key)
    - `name` (text, unique)
    - `description` (text)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
  
  ### 2. users
    - `id` (integer, primary key)
    - `username` (text, unique)
    - `email` (text, unique)
    - `phone` (text)
    - `first_name` (text)
    - `last_name` (text)
    - `password` (text)
    - `role_id` (integer, foreign key to roles)
    - `is_active` (boolean, default true)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
  
  ### 3. specializations
    - `id` (integer, primary key)
    - `name` (text, unique)
    - `description` (text)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
  
  ### 4. procedures
    - `id` (integer, primary key)
    - `name` (text, unique)
    - `description` (text)
    - `price` (numeric)
    - `duration` (integer) - in minutes
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
  
  ### 5. doctors
    - `id` (integer, primary key)
    - `user_id` (integer, foreign key to users)
    - `specialization_id` (integer, foreign key to specializations)
    - `experience` (integer) - years of experience
    - `consultation_fee` (numeric)
    - `working_hours` (jsonb)
    - `is_active` (boolean, default true)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
  
  ### 6. patients
    - `id` (integer, primary key)
    - `full_name` (text)
    - `phone` (text)
    - `birth_date` (date)
    - `address` (jsonb)
    - `emergency_contact` (jsonb)
    - `allergies` (text)
    - `medical_history` (text)
    - `phone_insurance` (text)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
  
  ### 7. appointments
    - `id` (integer, primary key)
    - `patient_id` (integer, foreign key to patients)
    - `doctor_id` (integer, foreign key to doctors)
    - `date` (date)
    - `time` (time)
    - `duration` (integer) - in minutes
    - `type` (text) - consultation, followup, procedure, emergency
    - `status` (text) - SCHEDULED, COMPLETED, CANCELLED, TEMPORARY, CANCELLED_FOREVER
    - `symptoms` (text)
    - `notes` (text)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
  
  ### 8. payments
    - `id` (integer, primary key)
    - `appointment_id` (integer, foreign key to appointments)
    - `patient_id` (integer, foreign key to patients)
    - `amount` (numeric)
    - `payment_type` (text) - cash, card, eskhata, eskhata_bank, alif
    - `status` (text) - pending, completed, refunded
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
  
  ### 9. transaction_categories
    - `id` (integer, primary key)
    - `name` (text, unique)
    - `type` (text) - income, expense
    - `description` (text)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
  
  ### 10. transactions
    - `id` (integer, primary key)
    - `category_id` (integer, foreign key to transaction_categories)
    - `amount` (numeric)
    - `description` (text)
    - `transaction_date` (date)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
  
  ## Security
    - Enable RLS on all tables
    - Add policies for authenticated users
  
  ## Mock Data
    - Add sample roles, users, specializations, procedures
    - Add sample doctors and patients
    - Add sample appointments with various statuses
    - Add sample payments
*/

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  password TEXT NOT NULL,
  role_id INTEGER REFERENCES roles(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create specializations table
CREATE TABLE IF NOT EXISTS specializations (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create procedures table
CREATE TABLE IF NOT EXISTS procedures (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) DEFAULT 0,
  duration INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  specialization_id INTEGER REFERENCES specializations(id),
  experience INTEGER DEFAULT 0,
  consultation_fee NUMERIC(10, 2) DEFAULT 0,
  working_hours JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  birth_date DATE NOT NULL,
  address JSONB,
  emergency_contact JSONB,
  allergies TEXT,
  medical_history TEXT,
  phone_insurance TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(id),
  doctor_id INTEGER REFERENCES doctors(id),
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INTEGER DEFAULT 30,
  type TEXT DEFAULT 'consultation',
  status TEXT DEFAULT 'SCHEDULED',
  symptoms TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  appointment_id INTEGER REFERENCES appointments(id),
  patient_id INTEGER REFERENCES patients(id),
  amount NUMERIC(10, 2) NOT NULL,
  payment_type TEXT DEFAULT 'cash',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create transaction_categories table
CREATE TABLE IF NOT EXISTS transaction_categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES transaction_categories(id),
  amount NUMERIC(10, 2) NOT NULL,
  description TEXT,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
CREATE POLICY "Authenticated users can read roles"
  ON roles FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Authenticated users can read users"
  ON users FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Authenticated users can read specializations"
  ON specializations FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Authenticated users can manage specializations"
  ON specializations FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE POLICY "Authenticated users can read procedures"
  ON procedures FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Authenticated users can manage procedures"
  ON procedures FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE POLICY "Authenticated users can read doctors"
  ON doctors FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Authenticated users can manage doctors"
  ON doctors FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE POLICY "Authenticated users can read patients"
  ON patients FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Authenticated users can manage patients"
  ON patients FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE POLICY "Authenticated users can read appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Authenticated users can manage appointments"
  ON appointments FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE POLICY "Authenticated users can read payments"
  ON payments FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Authenticated users can manage payments"
  ON payments FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE POLICY "Authenticated users can read transaction_categories"
  ON transaction_categories FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Authenticated users can manage transaction_categories"
  ON transaction_categories FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE POLICY "Authenticated users can read transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Authenticated users can manage transactions"
  ON transactions FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- Insert mock data

-- Roles
INSERT INTO roles (name, description) VALUES
  ('admin', 'Administrator with full access'),
  ('doctor', 'Medical doctor'),
  ('receptionist', 'Front desk receptionist')
ON CONFLICT (name) DO NOTHING;

-- Users
INSERT INTO users (username, email, phone, first_name, last_name, password, role_id, is_active) VALUES
  ('admin', 'admin@clinic.com', '+992000000001', 'Admin', 'User', 'hashed_password', 1, TRUE),
  ('dr.smith', 'smith@clinic.com', '+992000000002', 'John', 'Smith', 'hashed_password', 2, TRUE),
  ('dr.jones', 'jones@clinic.com', '+992000000003', 'Sarah', 'Jones', 'hashed_password', 2, TRUE),
  ('dr.brown', 'brown@clinic.com', '+992000000004', 'Michael', 'Brown', 'hashed_password', 2, TRUE),
  ('dr.wilson', 'wilson@clinic.com', '+992000000005', 'Emily', 'Wilson', 'hashed_password', 2, TRUE)
ON CONFLICT (username) DO NOTHING;

-- Specializations
INSERT INTO specializations (name, description) VALUES
  ('Cardiology', 'Heart and cardiovascular system'),
  ('Dermatology', 'Skin, hair, and nails'),
  ('Pediatrics', 'Medical care of infants, children, and adolescents'),
  ('Orthopedics', 'Musculoskeletal system'),
  ('General Practice', 'Primary healthcare')
ON CONFLICT (name) DO NOTHING;

-- Procedures
INSERT INTO procedures (name, description, price, duration) VALUES
  ('General Consultation', 'Standard medical consultation', 50.00, 30),
  ('Follow-up Visit', 'Follow-up consultation', 30.00, 20),
  ('Blood Test', 'Complete blood count', 25.00, 15),
  ('X-Ray', 'Radiographic examination', 75.00, 30),
  ('ECG', 'Electrocardiogram', 40.00, 20)
ON CONFLICT (name) DO NOTHING;

-- Doctors
INSERT INTO doctors (user_id, specialization_id, experience, consultation_fee, working_hours, is_active)
SELECT u.id, s.id, 
  CASE u.username
    WHEN 'dr.smith' THEN 10
    WHEN 'dr.jones' THEN 8
    WHEN 'dr.brown' THEN 15
    WHEN 'dr.wilson' THEN 5
  END,
  CASE u.username
    WHEN 'dr.smith' THEN 100.00
    WHEN 'dr.jones' THEN 90.00
    WHEN 'dr.brown' THEN 120.00
    WHEN 'dr.wilson' THEN 80.00
  END,
  '{"start": "09:00", "end": "18:00", "workingDays": [1, 2, 3, 4, 5]}'::jsonb,
  TRUE
FROM users u
CROSS JOIN specializations s
WHERE u.username IN ('dr.smith', 'dr.jones', 'dr.brown', 'dr.wilson')
  AND s.name = CASE u.username
    WHEN 'dr.smith' THEN 'Cardiology'
    WHEN 'dr.jones' THEN 'Dermatology'
    WHEN 'dr.brown' THEN 'Orthopedics'
    WHEN 'dr.wilson' THEN 'General Practice'
  END
ON CONFLICT DO NOTHING;

-- Patients
INSERT INTO patients (full_name, phone, birth_date, address, emergency_contact, allergies, medical_history) VALUES
  ('Иван Петров', '+992901234567', '1985-03-15', 
   '{"street": "ул. Рудаки 45", "city": "Душанбе", "country": "Таджикистан"}'::jsonb,
   '{"name": "Мария Петрова", "phone": "+992901234568", "relation": "Супруга"}'::jsonb,
   'Пенициллин', 'Гипертония'),
  
  ('Ольга Иванова', '+992902345678', '1990-07-22',
   '{"street": "ул. Айни 12", "city": "Душанбе", "country": "Таджикистан"}'::jsonb,
   '{"name": "Сергей Иванов", "phone": "+992902345679", "relation": "Супруг"}'::jsonb,
   'Нет', 'Диабет 2 типа'),
  
  ('Дмитрий Сидоров', '+992903456789', '1978-11-08',
   '{"street": "пр. Исмоили Сомони 78", "city": "Душанбе", "country": "Таджикистан"}'::jsonb,
   '{"name": "Елена Сидорова", "phone": "+992903456790", "relation": "Мать"}'::jsonb,
   'Аспирин', 'Астма'),
  
  ('Анна Козлова', '+992904567890', '1995-05-30',
   '{"street": "ул. Шевченко 23", "city": "Душанбе", "country": "Таджикистан"}'::jsonb,
   '{"name": "Петр Козлов", "phone": "+992904567891", "relation": "Отец"}'::jsonb,
   'Нет', 'Нет'),
  
  ('Михаил Васильев', '+992905678901', '1982-09-12',
   '{"street": "ул. Фирдавси 56", "city": "Душанбе", "country": "Таджикистан"}'::jsonb,
   '{"name": "Наталья Васильева", "phone": "+992905678902", "relation": "Супруга"}'::jsonb,
   'Сульфаниламиды', 'Язва желудка'),
  
  ('Елена Смирнова', '+992906789012', '1988-12-25',
   '{"street": "ул. Лахути 34", "city": "Душанбе", "country": "Таджикистан"}'::jsonb,
   '{"name": "Игорь Смирнов", "phone": "+992906789013", "relation": "Супруг"}'::jsonb,
   'Нет', 'Мигрень'),
  
  ('Сергей Николаев', '+992907890123', '1970-04-18',
   '{"street": "ул. Бохтар 67", "city": "Душанбе", "country": "Таджикистан"}'::jsonb,
   '{"name": "Татьяна Николаева", "phone": "+992907890124", "relation": "Супруга"}'::jsonb,
   'Йод', 'Гипотиреоз'),
  
  ('Татьяна Федорова', '+992908901234', '1992-08-03',
   '{"street": "ул. Дружбы Народов 89", "city": "Душанбе", "country": "Таджикистан"}'::jsonb,
   '{"name": "Владимир Федоров", "phone": "+992908901235", "relation": "Отец"}'::jsonb,
   'Нет', 'Нет');

-- Appointments (various dates and statuses)
INSERT INTO appointments (patient_id, doctor_id, date, time, duration, type, status, symptoms, notes) VALUES
  -- Today's appointments
  (1, 1, CURRENT_DATE, '09:00', 30, 'consultation', 'SCHEDULED', 'Боль в груди', 'Первичная консультация'),
  (2, 2, CURRENT_DATE, '10:00', 30, 'consultation', 'SCHEDULED', 'Кожная сыпь', 'Аллергическая реакция'),
  (3, 3, CURRENT_DATE, '11:00', 45, 'procedure', 'SCHEDULED', 'Боль в колене', 'Требуется рентген'),
  (4, 4, CURRENT_DATE, '14:00', 30, 'followup', 'COMPLETED', 'Контрольный осмотр', 'Состояние улучшилось'),
  (5, 1, CURRENT_DATE, '15:00', 30, 'consultation', 'COMPLETED', 'Высокое давление', 'Скорректирована дозировка'),
  
  -- Tomorrow's appointments
  (6, 2, CURRENT_DATE + 1, '09:00', 30, 'consultation', 'SCHEDULED', 'Акне', 'Новый пациент'),
  (7, 3, CURRENT_DATE + 1, '10:30', 30, 'followup', 'SCHEDULED', 'Контроль после травмы', 'Восстановление после перелома'),
  (8, 4, CURRENT_DATE + 1, '11:00', 30, 'consultation', 'SCHEDULED', 'Общее недомогание', 'Слабость, температура'),
  (1, 1, CURRENT_DATE + 1, '14:00', 30, 'followup', 'SCHEDULED', 'Контроль давления', 'Повторный прием'),
  (2, 2, CURRENT_DATE + 1, '15:30', 30, 'procedure', 'SCHEDULED', 'Удаление родинки', 'Плановая процедура'),
  
  -- This week's appointments
  (3, 3, CURRENT_DATE + 2, '09:30', 30, 'consultation', 'SCHEDULED', 'Боль в спине', 'Возможна грыжа'),
  (4, 4, CURRENT_DATE + 2, '11:00', 30, 'consultation', 'SCHEDULED', 'Профилактический осмотр', 'Ежегодная проверка'),
  (5, 1, CURRENT_DATE + 3, '10:00', 30, 'followup', 'SCHEDULED', 'Контроль ЭКГ', 'Проверка работы сердца'),
  (6, 2, CURRENT_DATE + 3, '14:00', 30, 'consultation', 'SCHEDULED', 'Дерматит', 'Воспаление кожи'),
  (7, 3, CURRENT_DATE + 4, '09:00', 45, 'procedure', 'SCHEDULED', 'МРТ позвоночника', 'Детальное обследование'),
  
  -- Cancelled appointments
  (8, 4, CURRENT_DATE + 5, '10:00', 30, 'consultation', 'CANCELLED', 'Простуда', 'Пациент отменил'),
  (1, 1, CURRENT_DATE - 2, '11:00', 30, 'consultation', 'CANCELLED_FOREVER', 'Головная боль', 'Не пришел'),
  
  -- Past completed appointments
  (2, 2, CURRENT_DATE - 1, '09:00', 30, 'consultation', 'COMPLETED', 'Акне', 'Назначено лечение'),
  (3, 3, CURRENT_DATE - 1, '14:00', 30, 'consultation', 'COMPLETED', 'Растяжение', 'Наложена повязка'),
  (4, 4, CURRENT_DATE - 3, '10:00', 30, 'consultation', 'COMPLETED', 'Грипп', 'Выписаны медикаменты'),
  (5, 1, CURRENT_DATE - 5, '15:00', 30, 'consultation', 'COMPLETED', 'Боль в сердце', 'ЭКГ в норме'),
  (6, 2, CURRENT_DATE - 7, '11:00', 30, 'procedure', 'COMPLETED', 'Удаление бородавки', 'Успешно'),
  
  -- Next week's appointments
  (7, 3, CURRENT_DATE + 7, '09:00', 30, 'consultation', 'SCHEDULED', 'Боль в плече', 'Возможен тендинит'),
  (8, 4, CURRENT_DATE + 8, '10:30', 30, 'consultation', 'SCHEDULED', 'Хроническая усталость', 'Комплексное обследование'),
  (1, 1, CURRENT_DATE + 9, '14:00', 30, 'followup', 'SCHEDULED', 'Плановый осмотр', 'Контроль состояния');

-- Payments for completed appointments
INSERT INTO payments (appointment_id, patient_id, amount, payment_type, status)
SELECT a.id, a.patient_id, d.consultation_fee, 
  CASE (RANDOM() * 4)::INT
    WHEN 0 THEN 'cash'
    WHEN 1 THEN 'card'
    WHEN 2 THEN 'eskhata'
    WHEN 3 THEN 'eskhata_bank'
    ELSE 'alif'
  END,
  'completed'
FROM appointments a
JOIN doctors d ON a.doctor_id = d.id
WHERE a.status = 'COMPLETED';

-- Transaction categories
INSERT INTO transaction_categories (name, type, description) VALUES
  ('Зарплата персонала', 'expense', 'Оплата труда сотрудников'),
  ('Медикаменты', 'expense', 'Закупка лекарств и медикаментов'),
  ('Аренда помещения', 'expense', 'Арендная плата'),
  ('Коммунальные услуги', 'expense', 'Электричество, вода, отопление'),
  ('Медицинское оборудование', 'expense', 'Покупка и обслуживание оборудования'),
  ('Консультации', 'income', 'Доход от консультаций'),
  ('Процедуры', 'income', 'Доход от медицинских процедур')
ON CONFLICT (name) DO NOTHING;

-- Sample transactions
INSERT INTO transactions (category_id, amount, description, transaction_date)
SELECT c.id, 
  CASE c.type
    WHEN 'expense' THEN -(RANDOM() * 5000 + 1000)
    ELSE (RANDOM() * 2000 + 500)
  END,
  c.description,
  CURRENT_DATE - (RANDOM() * 30)::INT
FROM transaction_categories c
LIMIT 20;
