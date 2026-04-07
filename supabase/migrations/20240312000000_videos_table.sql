-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_url TEXT NOT NULL,
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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
