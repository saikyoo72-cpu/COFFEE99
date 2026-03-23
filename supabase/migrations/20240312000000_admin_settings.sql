-- Create admin_settings table for branch-specific configurations
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  branch_id TEXT UNIQUE NOT NULL,
  password TEXT,
  store_name TEXT,
  store_email TEXT,
  store_address TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Policies for admin_settings
CREATE POLICY "Anyone can view public store settings"
  ON admin_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can update their own branch settings"
  ON admin_settings FOR ALL
  USING (true); -- In a real app, this would be more restrictive, 
                -- but for this demo we're using a master password/service key approach.
