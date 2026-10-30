-- Supabase Postgres Schema for Mintesnot Leliso's Portfolio

-- 1. Table for global site content (JSON store for instant ISR revalidation)
CREATE TABLE IF NOT EXISTS site_content (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table for contact form messages
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Row Level Security (RLS)
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to site_content
CREATE POLICY "Allow public read access to site_content"
  ON site_content FOR SELECT
  USING (true);

-- Allow authenticated/service role full access to site_content
CREATE POLICY "Allow full access to site_content for authenticated users"
  ON site_content FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow public insert into messages (contact form submissions)
CREATE POLICY "Allow public insert into messages"
  ON messages FOR INSERT
  WITH CHECK (true);

-- Allow authenticated/service role full access to messages
CREATE POLICY "Allow authenticated read/manage messages"
  ON messages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Storage Bucket Setup
-- Run in Supabase SQL editor:
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage public read policy
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-assets');

-- Storage authenticated upload policy
CREATE POLICY "Authenticated Upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-assets');
