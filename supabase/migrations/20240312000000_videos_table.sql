-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  embed_url TEXT NOT NULL,
  creator_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist if table was created with old schema
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='videos' AND column_name='embed_url') THEN
        ALTER TABLE videos ADD COLUMN embed_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='videos' AND column_name='creator_name') THEN
        ALTER TABLE videos ADD COLUMN creator_name TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='videos' AND column_name='created_at') THEN
        ALTER TABLE videos ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Enable RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Anyone can read videos
CREATE POLICY "Anyone can read videos" ON videos
  FOR SELECT USING (true);

-- Anyone can create videos
CREATE POLICY "Anyone can create videos" ON videos
  FOR INSERT WITH CHECK (true);

-- Anyone can update videos
CREATE POLICY "Anyone can update videos" ON videos
  FOR UPDATE USING (true);
