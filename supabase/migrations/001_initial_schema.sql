-- ==============================================================================
-- GLEAM COACHING - SUPABASE PostgreSQL DATABASE MIGRATION
-- Location: Iqbal Road, Kotwali, Chattogram, Bangladesh
-- Architecture: Supabase for Academic Data & Admin Content | Google Sheets for Student Auth
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Admin & System Users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text not null,
  role text not null check (role in ('admin', 'staff')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. TEACHERS TABLE
create table if not exists public.teachers (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  designation text not null,
  subject text not null,
  bio text,
  image_url text,
  email text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. CLASSES TABLE (Classes 6 to 12)
create table if not exists public.classes (
  id uuid default uuid_generate_v4() primary key,
  class_name text unique not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. COURSES TABLE
create table if not exists public.courses (
  id uuid default uuid_generate_v4() primary key,
  class_id uuid references public.classes(id) on delete cascade,
  class_name text not null,
  title text not null,
  subjects text[] not null,
  description text,
  schedule text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. EXAMINATIONS TABLE (Weekly Exams)
create table if not exists public.examinations (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  class_level text not null,
  subject text not null,
  exam_date date not null,
  exam_time text not null,
  syllabus text,
  status text not null check (status in ('Upcoming', 'Ongoing', 'Completed', 'Cancelled')) default 'Upcoming',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. RESULTS TABLE
create table if not exists public.results (
  id uuid default uuid_generate_v4() primary key,
  student_id text not null, -- References Student ID from Google Sheets
  student_name text not null,
  class_level text not null,
  exam_title text not null,
  subject text not null,
  obtained_marks numeric(5,2) not null,
  total_marks numeric(5,2) not null,
  gpa numeric(3,2) not null,
  position text,
  remarks text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. CLASS ROUTINES TABLE
create table if not exists public.class_routines (
  id uuid default uuid_generate_v4() primary key,
  class_level text not null,
  day text not null,
  subject text not null,
  teacher text not null,
  start_time text not null,
  end_time text not null,
  room text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. NOTICES TABLE
create table if not exists public.notices (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  category text not null check (category in ('Examination', 'Results', 'Academic', 'General', 'Holiday')),
  date date default current_date not null,
  content text not null,
  is_pinned boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. TESTIMONIALS TABLE
create table if not exists public.testimonials (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  role text not null,
  comment text not null,
  rating integer check (rating between 1 and 5) default 5,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. WEBSITE SETTINGS TABLE
create table if not exists public.website_settings (
  id uuid default uuid_generate_v4() primary key,
  institute_name text not null default 'GLEAM COACHING',
  tagline text not null default 'Learn Today. Lead Tomorrow.',
  address text not null default 'Iqbal Road, Kotwali, Chattogram, Bangladesh',
  phone text not null default '+880 1812-345678',
  email text not null default 'info@gleamcoaching.edu.bd',
  facebook_url text not null default 'https://www.facebook.com/share/g/19cGwwjKXs/',
  about_text text,
  hero_headline text,
  hero_subheading text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. VERIFICATION LOGS TABLE (Audit trail for student portal requests)
create table if not exists public.verification_logs (
  id uuid default uuid_generate_v4() primary key,
  student_id text not null,
  status text not null check (status in ('SUCCESS', 'FAILED')),
  ip_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.teachers enable row level security;
alter table public.classes enable row level security;
alter table public.courses enable row level security;
alter table public.examinations enable row level security;
alter table public.results enable row level security;
alter table public.class_routines enable row level security;
alter table public.notices enable row level security;
alter table public.testimonials enable row level security;
alter table public.website_settings enable row level security;
alter table public.verification_logs enable row level security;

-- Helper function to check if user is admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Public read policies for institute academic data
create policy "Allow public read access on teachers" on public.teachers for select using (true);
create policy "Allow public read access on classes" on public.classes for select using (true);
create policy "Allow public read access on courses" on public.courses for select using (true);
create policy "Allow public read access on examinations" on public.examinations for select using (true);
create policy "Allow public read access on class_routines" on public.class_routines for select using (true);
create policy "Allow public read access on notices" on public.notices for select using (true);
create policy "Allow public read access on testimonials" on public.testimonials for select using (true);
create policy "Allow public read access on website_settings" on public.website_settings for select using (true);

-- Results read policy (students view via server API communicating with Google Sheets ID verification)
create policy "Allow public read on results" on public.results for select using (true);

-- Admin full CRUD policies
create policy "Admin full access on profiles" on public.profiles using (public.is_admin()) with check (public.is_admin());
create policy "Admin full access on teachers" on public.teachers using (public.is_admin()) with check (public.is_admin());
create policy "Admin full access on classes" on public.classes using (public.is_admin()) with check (public.is_admin());
create policy "Admin full access on courses" on public.courses using (public.is_admin()) with check (public.is_admin());
create policy "Admin full access on examinations" on public.examinations using (public.is_admin()) with check (public.is_admin());
create policy "Admin full access on results" on public.results using (public.is_admin()) with check (public.is_admin());
create policy "Admin full access on class_routines" on public.class_routines using (public.is_admin()) with check (public.is_admin());
create policy "Admin full access on notices" on public.notices using (public.is_admin()) with check (public.is_admin());
create policy "Admin full access on testimonials" on public.testimonials using (public.is_admin()) with check (public.is_admin());
create policy "Admin full access on website_settings" on public.website_settings using (public.is_admin()) with check (public.is_admin());
create policy "Admin full access on verification_logs" on public.verification_logs using (public.is_admin()) with check (public.is_admin());
