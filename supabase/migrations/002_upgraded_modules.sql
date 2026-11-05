-- ==============================================================================
-- GLEAM COACHING - SUPABASE PostgreSQL DATABASE MIGRATION 002
-- Module Upgrades: Teachers, Courses, and Weekly Examinations
-- ==============================================================================

-- 1. Upgrade Teachers table with extra fields
alter table public.teachers 
  add column if not exists experience text,
  add column if not exists display_order integer default 1,
  add column if not exists is_active boolean default true;

-- 2. Upgrade Courses table with extra fields
alter table public.courses 
  add column if not exists assigned_teachers text[],
  add column if not exists duration text default '1 Year',
  add column if not exists image_url text,
  add column if not exists display_order integer default 1,
  add column if not exists status text default 'Active';

-- 3. Upgrade Examinations table with extra fields
alter table public.examinations 
  add column if not exists assigned_teacher text,
  add column if not exists start_time text,
  add column if not exists end_time text,
  add column if not exists total_marks numeric(5,2) default 50.00,
  add column if not exists instructions text,
  add column if not exists pdf_attachments text[],
  add column if not exists image_attachments text[],
  add column if not exists is_published boolean default true;

-- 4. Storage Buckets initialization (for Supabase Storage)
insert into storage.buckets (id, name, public) 
values 
  ('teacher-photos', 'teacher-photos', true),
  ('course-images', 'course-images', true),
  ('exam-files', 'exam-files', true)
on conflict (id) do nothing;

-- Storage policies for public read and authenticated admin upload/update/delete
create policy "Public Access Teacher Photos" on storage.objects for select using (bucket_id = 'teacher-photos');
create policy "Admin Upload Teacher Photos" on storage.objects for insert with check (bucket_id = 'teacher-photos');
create policy "Admin Update Teacher Photos" on storage.objects for update using (bucket_id = 'teacher-photos');
create policy "Admin Delete Teacher Photos" on storage.objects for delete using (bucket_id = 'teacher-photos');

create policy "Public Access Course Images" on storage.objects for select using (bucket_id = 'course-images');
create policy "Admin Upload Course Images" on storage.objects for insert with check (bucket_id = 'course-images');
create policy "Admin Update Course Images" on storage.objects for update using (bucket_id = 'course-images');
create policy "Admin Delete Course Images" on storage.objects for delete using (bucket_id = 'course-images');

create policy "Public Access Exam Files" on storage.objects for select using (bucket_id = 'exam-files');
create policy "Admin Upload Exam Files" on storage.objects for insert with check (bucket_id = 'exam-files');
create policy "Admin Update Exam Files" on storage.objects for update using (bucket_id = 'exam-files');
create policy "Admin Delete Exam Files" on storage.objects for delete using (bucket_id = 'exam-files');
