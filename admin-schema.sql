-- ============================================================
-- Gurmadka Deg Dega ee Gobolka Banadir
-- New Table: audit_logs
-- Run this in your Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  action VARCHAR(150) NOT NULL,
  user_email VARCHAR(150) NOT NULL,
  user_role VARCHAR(50),
  details TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to insert (to log actions)
CREATE POLICY "Allow authenticated insert" ON audit_logs
  FOR INSERT TO authenticated WITH CHECK (true);

-- Allow authenticated users to read (or restrict to admins later)
CREATE POLICY "Allow authenticated select" ON audit_logs
  FOR SELECT TO authenticated USING (true);

-- Allow service_role
CREATE POLICY "Allow service_role" ON audit_logs
  FOR ALL TO service_role USING (true) WITH CHECK (true);
