-- Supabase SQL Migration for Class Routine Document Management System
-- Storage bucket for routine images and PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('routine-files', 'routine-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Public Read Access for Routine Files"
ON storage.objects FOR SELECT
USING (bucket_id = 'routine-files');

CREATE POLICY "Admin Upload Access for Routine Files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'routine-files');

CREATE POLICY "Admin Delete Access for Routine Files"
ON storage.objects FOR DELETE
USING (bucket_id = 'routine-files');

-- Table for Class Routines
CREATE TABLE IF NOT EXISTS public.routines (
  id TEXT PRIMARY KEY DEFAULT 'rt_' || extract(epoch from now())::text,
  title TEXT NOT NULL,
  class_level TEXT NOT NULL,
  academic_session TEXT DEFAULT '2026 Academic Session',
  description TEXT,
  effective_date DATE DEFAULT CURRENT_DATE,
  google_sheet_url TEXT,
  status TEXT DEFAULT 'Published' CHECK (status IN ('Published', 'Draft', 'Archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for Routine Attachments (Images & PDFs)
CREATE TABLE IF NOT EXISTS public.routine_attachments (
  id TEXT PRIMARY KEY DEFAULT 'att_' || extract(epoch from now())::text,
  routine_id TEXT REFERENCES public.routines(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'pdf')),
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access for Published Routines"
ON public.routines FOR SELECT
USING (status = 'Published' OR auth.role() = 'authenticated');

CREATE POLICY "Admin Manage Routines"
ON public.routines FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Public Read Access for Attachments"
ON public.routine_attachments FOR SELECT
USING (true);

CREATE POLICY "Admin Manage Attachments"
ON public.routine_attachments FOR ALL
USING (auth.role() = 'authenticated');
