-- ============================================================
-- Gurmadka Deg Dega ee Gobolka Banadir
-- New Tables: shift_groups + shaqalaha
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Shift Groups Table
CREATE TABLE IF NOT EXISTS shift_groups (
  id SERIAL PRIMARY KEY,
  magaca VARCHAR(10) NOT NULL UNIQUE,
  sharax VARCHAR(100),
  waqtiga_bilowga VARCHAR(10),
  waqtiga_dhammaadka VARCHAR(10),
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert the 3 groups
INSERT INTO shift_groups (magaca, sharax, waqtiga_bilowga, waqtiga_dhammaadka, is_active) VALUES
('A', 'Kooxda Hore', '06:00', '14:00', true),
('B', 'Kooxda Dhexe', '14:00', '22:00', false),
('C', 'Kooxda Habeenka', '22:00', '06:00', false)
ON CONFLICT (magaca) DO NOTHING;

-- 2. Employees Table
CREATE TABLE IF NOT EXISTS shaqalaha (
  id SERIAL PRIMARY KEY,
  magaca_buuxa VARCHAR(150) NOT NULL,
  lambarka_shaqaale VARCHAR(30) UNIQUE NOT NULL,
  xirfadda VARCHAR(100) NOT NULL,
  telefoon VARCHAR(30),
  iimaylka VARCHAR(150),
  koox_id INTEGER REFERENCES shift_groups(id),
  xaaladda VARCHAR(30) DEFAULT 'firfircoon',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Enable Row Level Security
ALTER TABLE shift_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE shaqalaha ENABLE ROW LEVEL SECURITY;

-- 4. Policies — allow all for authenticated users
DROP POLICY IF EXISTS "Allow authenticated" ON shift_groups;
DROP POLICY IF EXISTS "Allow authenticated" ON shaqalaha;

CREATE POLICY "Allow authenticated" ON shift_groups
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated" ON shaqalaha
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. Also allow service_role (used by the API)
CREATE POLICY "Allow service_role" ON shift_groups
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow service_role" ON shaqalaha
  FOR ALL TO service_role USING (true) WITH CHECK (true);
