-- Migration: 004_farewell_gallery.sql
-- Description: Create tables and storage policies for Farewell Memories & Photo Gallery

-- Create Storage Bucket for Farewell Gallery
INSERT INTO storage.buckets (id, name, public)
VALUES ('farewell-gallery', 'farewell-gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Allow public read access to farewell-gallery bucket
CREATE POLICY "Public Read Farewell Gallery" ON storage.objects
FOR SELECT USING (bucket_id = 'farewell-gallery');

-- Storage Policy: Allow authenticated / admin upload access
CREATE POLICY "Admin Insert Farewell Gallery" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'farewell-gallery');

-- Storage Policy: Allow authenticated / admin delete access
CREATE POLICY "Admin Delete Farewell Gallery" ON storage.objects
FOR DELETE USING (bucket_id = 'farewell-gallery');

-- Table: farewell_albums
CREATE TABLE IF NOT EXISTS public.farewell_albums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(10) NOT NULL CHECK (category IN ('HSC', 'SSC')),
    year INTEGER NOT NULL CHECK (year BETWEEN 2017 AND 2030),
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    cover_image TEXT DEFAULT '',
    status VARCHAR(20) NOT NULL DEFAULT 'Published' CHECK (status IN ('Published', 'Draft', 'Archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_category_year UNIQUE (category, year)
);

-- Table: farewell_photos
CREATE TABLE IF NOT EXISTS public.farewell_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id UUID NOT NULL REFERENCES public.farewell_albums(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    storage_path TEXT DEFAULT '',
    caption TEXT DEFAULT '',
    display_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_farewell_albums_cat_year ON public.farewell_albums(category, year, status);
CREATE INDEX IF NOT EXISTS idx_farewell_photos_album_id ON public.farewell_photos(album_id, display_order);

-- Enable RLS
ALTER TABLE public.farewell_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farewell_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view published albums
CREATE POLICY "Public View Published Albums" ON public.farewell_albums
FOR SELECT USING (status = 'Published');

-- RLS Policy: Anyone can view photos belonging to published albums
CREATE POLICY "Public View Published Album Photos" ON public.farewell_photos
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.farewell_albums
        WHERE public.farewell_albums.id = farewell_photos.album_id
        AND public.farewell_albums.status = 'Published'
    )
);

-- RLS Policy: Admins have full CRUD on albums and photos
CREATE POLICY "Admin Full Access Albums" ON public.farewell_albums
FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Admin Full Access Photos" ON public.farewell_photos
FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
