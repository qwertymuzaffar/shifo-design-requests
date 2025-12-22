/*
  # Create documents and document types tables

  ## New Tables
  
  ### `document_types`
  - `id` (integer, primary key, auto-increment)
  - `name` (text, unique, not null) - Name of the document type
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())
  
  ### `documents`
  - `id` (integer, primary key, auto-increment)
  - `patient_id` (integer, not null) - Reference to patient
  - `title` (text, not null) - Document title
  - `description` (text, nullable) - Document description
  - `document_type_id` (integer, nullable) - Reference to document_types
  - `file_url` (text, not null) - URL to the file
  - `file_size` (text, nullable) - File size
  - `status` (text, default 'pending') - Document status (pending, approved)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ## Security
  - Enable RLS on both tables
  - Add policies for authenticated users to manage document types
  - Add policies for authenticated users to manage documents
  
  ## Initial Data
  - Insert default document types
*/

-- Create document_types table
CREATE TABLE IF NOT EXISTS document_types (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  document_type_id INTEGER REFERENCES document_types(id) ON DELETE SET NULL,
  file_url TEXT NOT NULL,
  file_size TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policies for document_types
CREATE POLICY "Authenticated users can view document types"
  ON document_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create document types"
  ON document_types FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update document types"
  ON document_types FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete document types"
  ON document_types FOR DELETE
  TO authenticated
  USING (true);

-- Policies for documents
CREATE POLICY "Authenticated users can view documents"
  ON documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update documents"
  ON documents FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete documents"
  ON documents FOR DELETE
  TO authenticated
  USING (true);

-- Insert default document types
INSERT INTO document_types (name) VALUES
  ('Паспорт'),
  ('Водительское удостоверение'),
  ('Медицинская карта'),
  ('Анализ крови'),
  ('Рентген'),
  ('МРТ'),
  ('УЗИ'),
  ('Справка'),
  ('Рецепт'),
  ('Другое')
ON CONFLICT (name) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_documents_patient_id ON documents(patient_id);
CREATE INDEX IF NOT EXISTS idx_documents_document_type_id ON documents(document_type_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_document_types_name ON document_types(name);
