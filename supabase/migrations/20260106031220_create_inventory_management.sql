/*
  # Inventory Management Module

  ## Overview
  This migration creates the inventory management system for tracking medical equipment, supplies, and stock levels.

  ## New Tables
  
  ### `inventory_categories`
  Categories for inventory items
  - `id` (serial, primary key)
  - `name` (text) - Category name
  - `description` (text) - Category description
  - `parent_id` (integer, nullable) - Parent category for subcategories
  - `is_active` (boolean) - Active status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `inventory_items`
  Inventory items catalog
  - `id` (serial, primary key)
  - `name` (text) - Item name
  - `sku` (text, unique) - Stock keeping unit
  - `category_id` (integer, foreign key) - Reference to categories
  - `description` (text) - Item description
  - `unit` (text) - Unit of measurement (pieces, boxes, liters, etc.)
  - `reorder_level` (integer) - Minimum stock level before reorder
  - `unit_cost` (numeric) - Cost per unit
  - `supplier` (text) - Supplier name
  - `is_active` (boolean) - Active status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `inventory_stock`
  Current stock levels
  - `id` (serial, primary key)
  - `item_id` (integer, foreign key) - Reference to inventory_items
  - `quantity` (integer) - Current quantity
  - `location` (text) - Storage location
  - `expiry_date` (date, nullable) - Expiration date
  - `batch_number` (text, nullable) - Batch/lot number
  - `updated_at` (timestamptz)

  ### `inventory_transactions`
  Inventory movement history
  - `id` (serial, primary key)
  - `item_id` (integer, foreign key) - Reference to inventory_items
  - `transaction_type` (text) - purchase, usage, adjustment, disposal
  - `quantity` (integer) - Quantity (positive for in, negative for out)
  - `reference_id` (integer, nullable) - Reference to related record (appointment, order, etc.)
  - `reference_type` (text, nullable) - Type of reference (appointment, purchase_order, etc.)
  - `notes` (text) - Transaction notes
  - `performed_by` (integer, foreign key) - User who performed transaction
  - `transaction_date` (timestamptz) - Transaction date
  - `created_at` (timestamptz)

  ### `inventory_alerts`
  Stock alerts and notifications
  - `id` (serial, primary key)
  - `item_id` (integer, foreign key) - Reference to inventory_items
  - `alert_type` (text) - low_stock, expiring_soon, expired
  - `message` (text) - Alert message
  - `is_resolved` (boolean) - Resolution status
  - `resolved_at` (timestamptz, nullable)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Authenticated users can read and manage inventory data
*/

-- Inventory Categories Table
CREATE TABLE IF NOT EXISTS inventory_categories (
  id serial PRIMARY KEY,
  name text NOT NULL,
  description text,
  parent_id integer REFERENCES inventory_categories(id) ON DELETE SET NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Inventory Items Table
CREATE TABLE IF NOT EXISTS inventory_items (
  id serial PRIMARY KEY,
  name text NOT NULL,
  sku text UNIQUE NOT NULL,
  category_id integer REFERENCES inventory_categories(id) ON DELETE SET NULL,
  description text,
  unit text NOT NULL DEFAULT 'pieces',
  reorder_level integer NOT NULL DEFAULT 10,
  unit_cost numeric(10,2) DEFAULT 0,
  supplier text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Inventory Stock Table
CREATE TABLE IF NOT EXISTS inventory_stock (
  id serial PRIMARY KEY,
  item_id integer NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 0,
  location text NOT NULL DEFAULT 'main_storage',
  expiry_date date,
  batch_number text,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT positive_quantity CHECK (quantity >= 0)
);

-- Inventory Transactions Table
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id serial PRIMARY KEY,
  item_id integer NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,
  transaction_type text NOT NULL,
  quantity integer NOT NULL,
  reference_id integer,
  reference_type text,
  notes text,
  performed_by integer REFERENCES users(id) ON DELETE SET NULL,
  transaction_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_transaction_type CHECK (transaction_type IN ('purchase', 'usage', 'adjustment', 'disposal', 'return'))
);

-- Inventory Alerts Table
CREATE TABLE IF NOT EXISTS inventory_alerts (
  id serial PRIMARY KEY,
  item_id integer NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  alert_type text NOT NULL,
  message text NOT NULL,
  is_resolved boolean DEFAULT false,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_alert_type CHECK (alert_type IN ('low_stock', 'expiring_soon', 'expired', 'out_of_stock'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_inventory_items_category ON inventory_items(category_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_sku ON inventory_items(sku);
CREATE INDEX IF NOT EXISTS idx_inventory_stock_item ON inventory_stock(item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_stock_expiry ON inventory_stock(expiry_date);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_item ON inventory_transactions(item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_date ON inventory_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_item ON inventory_alerts(item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_resolved ON inventory_alerts(is_resolved);

-- Enable Row Level Security
ALTER TABLE inventory_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for inventory_categories
CREATE POLICY "Users can view active categories"
  ON inventory_categories FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Users can manage categories"
  ON inventory_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for inventory_items
CREATE POLICY "Users can view inventory items"
  ON inventory_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage inventory items"
  ON inventory_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for inventory_stock
CREATE POLICY "Users can view stock"
  ON inventory_stock FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage stock"
  ON inventory_stock FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for inventory_transactions
CREATE POLICY "Users can view transactions"
  ON inventory_transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create transactions"
  ON inventory_transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for inventory_alerts
CREATE POLICY "Users can view alerts"
  ON inventory_alerts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage alerts"
  ON inventory_alerts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample inventory categories
INSERT INTO inventory_categories (name, description) VALUES
('Medical Equipment', 'Medical devices and equipment'),
('Disposable Supplies', 'Single-use medical supplies'),
('Medications', 'Pharmaceutical supplies'),
('Laboratory Supplies', 'Lab testing materials'),
('Office Supplies', 'Administrative materials'),
('Cleaning Supplies', 'Sanitation and cleaning materials')
ON CONFLICT DO NOTHING;

-- Insert sample inventory items
INSERT INTO inventory_items (name, sku, category_id, description, unit, reorder_level, unit_cost, supplier) 
SELECT 
  'Disposable Gloves', 'GLV-001', id, 'Nitrile examination gloves', 'boxes', 20, 15.00, 'Medical Supply Co'
FROM inventory_categories WHERE name = 'Disposable Supplies' LIMIT 1
ON CONFLICT (sku) DO NOTHING;

INSERT INTO inventory_items (name, sku, category_id, description, unit, reorder_level, unit_cost, supplier) 
SELECT 
  'Face Masks', 'MSK-001', id, 'Surgical face masks', 'boxes', 30, 12.00, 'Medical Supply Co'
FROM inventory_categories WHERE name = 'Disposable Supplies' LIMIT 1
ON CONFLICT (sku) DO NOTHING;

INSERT INTO inventory_items (name, sku, category_id, description, unit, reorder_level, unit_cost, supplier) 
SELECT 
  'Syringes 5ml', 'SYR-005', id, 'Sterile syringes 5ml', 'pieces', 100, 0.50, 'Medical Supply Co'
FROM inventory_categories WHERE name = 'Disposable Supplies' LIMIT 1
ON CONFLICT (sku) DO NOTHING;

INSERT INTO inventory_items (name, sku, category_id, description, unit, reorder_level, unit_cost, supplier) 
SELECT 
  'Blood Test Tubes', 'BTT-001', id, 'Vacutainer blood collection tubes', 'pieces', 50, 1.20, 'Lab Supplies Inc'
FROM inventory_categories WHERE name = 'Laboratory Supplies' LIMIT 1
ON CONFLICT (sku) DO NOTHING;

INSERT INTO inventory_items (name, sku, category_id, description, unit, reorder_level, unit_cost, supplier) 
SELECT 
  'Alcohol Swabs', 'ALC-001', id, 'Alcohol prep pads', 'boxes', 25, 8.00, 'Medical Supply Co'
FROM inventory_categories WHERE name = 'Disposable Supplies' LIMIT 1
ON CONFLICT (sku) DO NOTHING;