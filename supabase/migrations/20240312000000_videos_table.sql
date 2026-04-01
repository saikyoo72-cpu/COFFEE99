-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  creator TEXT,
  description TEXT,
  creator_avatar TEXT,
  video_url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('youtube', 'instagram', 'facebook', 'short', 'other')),
  views TEXT,
  posted_at TIMESTAMPTZ DEFAULT NOW(),
  author_uid UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Anyone can read videos
CREATE POLICY "Anyone can read videos" ON videos
  FOR SELECT USING (true);

-- Anyone can create videos (Public submission)
-- This allows anonymous users to submit videos
CREATE POLICY "Anyone can create videos" ON videos
  FOR INSERT WITH CHECK (true);

-- Users can update their own videos (if they have an author_uid)
CREATE POLICY "Users can update their own videos" ON videos
  FOR UPDATE USING (auth.uid() = author_uid);

-- Users can delete their own videos (if they have an author_uid)
CREATE POLICY "Users can delete their own videos" ON videos
  FOR DELETE USING (auth.uid() = author_uid);
