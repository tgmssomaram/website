-- ==============================================================
-- TGMS Somaram | Comprehensive Supabase Database Schema
-- Production-Ready Schema for School Administration & Real-Time Sync
-- Run this script in your Supabase SQL Editor:
-- https://app.supabase.com/project/_/sql
-- ==============================================================

-- 1. Enable pgcrypto extension for UUID generation
create extension if not exists "pgcrypto";

-- Helper function for auto-updating timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- --------------------------------------------------------------
-- 2. School Profile / Master Configuration Table
-- --------------------------------------------------------------
create table if not exists public.school_profiles (
    id text primary key,
    profile_key text unique not null,
    values jsonb not null default '{}'::jsonb,
    revision integer not null default 1,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- --------------------------------------------------------------
-- 3. Principal's Message & Press Notes Table
-- --------------------------------------------------------------
create table if not exists public.principal_messages (
    id uuid default gen_random_uuid() primary key,
    title text not null default 'Principal’s Message',
    telugu_title text default 'ప్రిన్సిపాల్ సందేశం',
    message text not null,
    telugu_message text,
    important_title text default 'Principal Important Message',
    important_text text,
    image_url text,
    image_caption text,
    links jsonb default '[]'::jsonb,
    is_active boolean not null default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- --------------------------------------------------------------
-- 4. Student Enrolment & School Strength Table
-- --------------------------------------------------------------
create table if not exists public.student_strength (
    id uuid default gen_random_uuid() primary key,
    academic_year text not null default '2026–27',
    group_type text not null, -- 'high_school', 'intermediate_1', 'intermediate_2', 'sections'
    class_name text not null, -- 'VI', 'VII', 'VIII', 'IX', 'X', 'MPC', 'BiPC', 'CEC', 'ACE'
    boys integer not null default 0 check (boys >= 0),
    girls integer not null default 0 check (girls >= 0),
    order_index integer not null default 0,
    is_active boolean not null default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- --------------------------------------------------------------
-- 5. Campus & School Photo Gallery Table
-- --------------------------------------------------------------
create table if not exists public.gallery_items (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    image_url text not null,
    category text not null default 'Campus Gallery', -- 'Campus Gallery', 'School Photo Gallery', 'Achievements', 'Events', 'Sports'
    gallery_type text not null default 'campus',     -- 'campus' vs 'school'
    caption text,
    order_index integer not null default 0,
    is_active boolean not null default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- --------------------------------------------------------------
-- 6. Faculty Members Table
-- --------------------------------------------------------------
create table if not exists public.faculty (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    designation text,
    subject text,
    qualification text,
    photo_url text,
    order_index integer not null default 0,
    is_active boolean not null default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- --------------------------------------------------------------
-- 7. Flash News & Notices Table
-- --------------------------------------------------------------
create table if not exists public.notices (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    detail text,
    date text not null default to_char(current_date, 'YYYY-MM-DD'),
    is_active boolean not null default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- --------------------------------------------------------------
-- 8. Alumni Records Table
-- --------------------------------------------------------------
create table if not exists public.alumni (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    batch text,
    achievement text,
    photo_url text,
    approved boolean not null default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- --------------------------------------------------------------
-- 9. Inquiries & Feedback Table
-- --------------------------------------------------------------
create table if not exists public.feedback (
    id uuid default gen_random_uuid() primary key,
    request_id text,
    name text,
    role text,
    contact text,
    message text,
    website text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- --------------------------------------------------------------
-- 10. Admin Users Table
-- --------------------------------------------------------------
create table if not exists public.admin_users (
    id uuid default gen_random_uuid() primary key,
    email text unique not null,
    password_hash text not null,
    role text not null default 'admin',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- --------------------------------------------------------------
-- Row Level Security (RLS) Configuration
-- Optimized for Zero Linter Warnings (InitPlan & Single Permissive Policy)
-- --------------------------------------------------------------
alter table public.school_profiles enable row level security;
alter table public.principal_messages enable row level security;
alter table public.student_strength enable row level security;
alter table public.gallery_items enable row level security;
alter table public.faculty enable row level security;
alter table public.notices enable row level security;
alter table public.alumni enable row level security;
alter table public.feedback enable row level security;
alter table public.admin_users enable row level security;

-- Drop all legacy and previous policies to avoid collisions
drop policy if exists "Allow public read on school_profiles" on public.school_profiles;
drop policy if exists "Allow service role full access on school_profiles" on public.school_profiles;
drop policy if exists "school_profiles_select" on public.school_profiles;
drop policy if exists "school_profiles_insert" on public.school_profiles;
drop policy if exists "school_profiles_update" on public.school_profiles;
drop policy if exists "school_profiles_delete" on public.school_profiles;
drop policy if exists "school_profiles_service_role" on public.school_profiles;

drop policy if exists "Allow public read on principal_messages" on public.principal_messages;
drop policy if exists "Allow service role full access on principal_messages" on public.principal_messages;
drop policy if exists "principal_messages_select" on public.principal_messages;
drop policy if exists "principal_messages_insert" on public.principal_messages;
drop policy if exists "principal_messages_update" on public.principal_messages;
drop policy if exists "principal_messages_delete" on public.principal_messages;
drop policy if exists "principal_messages_service_role" on public.principal_messages;

drop policy if exists "Allow public read on student_strength" on public.student_strength;
drop policy if exists "Allow service role full access on student_strength" on public.student_strength;
drop policy if exists "student_strength_select" on public.student_strength;
drop policy if exists "student_strength_insert" on public.student_strength;
drop policy if exists "student_strength_update" on public.student_strength;
drop policy if exists "student_strength_delete" on public.student_strength;
drop policy if exists "student_strength_service_role" on public.student_strength;

drop policy if exists "Allow public read on gallery_items" on public.gallery_items;
drop policy if exists "Allow service role full access on gallery_items" on public.gallery_items;
drop policy if exists "gallery_items_select" on public.gallery_items;
drop policy if exists "gallery_items_insert" on public.gallery_items;
drop policy if exists "gallery_items_update" on public.gallery_items;
drop policy if exists "gallery_items_delete" on public.gallery_items;
drop policy if exists "gallery_items_service_role" on public.gallery_items;

drop policy if exists "Allow public read on faculty" on public.faculty;
drop policy if exists "Allow service role full access on faculty" on public.faculty;
drop policy if exists "faculty_select" on public.faculty;
drop policy if exists "faculty_insert" on public.faculty;
drop policy if exists "faculty_update" on public.faculty;
drop policy if exists "faculty_delete" on public.faculty;
drop policy if exists "faculty_service_role" on public.faculty;

drop policy if exists "Allow public read on notices" on public.notices;
drop policy if exists "Allow service role full access on notices" on public.notices;
drop policy if exists "notices_select" on public.notices;
drop policy if exists "notices_insert" on public.notices;
drop policy if exists "notices_update" on public.notices;
drop policy if exists "notices_delete" on public.notices;
drop policy if exists "notices_service_role" on public.notices;

drop policy if exists "Allow public read on alumni" on public.alumni;
drop policy if exists "Allow service role full access on alumni" on public.alumni;
drop policy if exists "alumni_select" on public.alumni;
drop policy if exists "alumni_insert" on public.alumni;
drop policy if exists "alumni_update" on public.alumni;
drop policy if exists "alumni_delete" on public.alumni;
drop policy if exists "alumni_service_role" on public.alumni;

drop policy if exists "Allow public insert on feedback" on public.feedback;
drop policy if exists "Allow admin read on feedback" on public.feedback;
drop policy if exists "Allow service role full access on feedback" on public.feedback;
drop policy if exists "feedback_insert" on public.feedback;
drop policy if exists "feedback_select" on public.feedback;
drop policy if exists "feedback_update" on public.feedback;
drop policy if exists "feedback_delete" on public.feedback;
drop policy if exists "feedback_service_role" on public.feedback;

drop policy if exists "Allow service role full access on admin_users" on public.admin_users;
drop policy if exists "admin_users_select" on public.admin_users;
drop policy if exists "admin_users_insert" on public.admin_users;
drop policy if exists "admin_users_update" on public.admin_users;
drop policy if exists "admin_users_delete" on public.admin_users;
drop policy if exists "admin_users_service_role" on public.admin_users;

-- ==============================================================
-- 1. School Profiles Policies
-- ==============================================================
create policy "school_profiles_select" on public.school_profiles
    for select to anon, authenticated
    using (true);

create policy "school_profiles_insert" on public.school_profiles
    for insert to authenticated
    with check ((select auth.role()) = 'authenticated');

create policy "school_profiles_update" on public.school_profiles
    for update to authenticated
    using ((select auth.role()) = 'authenticated')
    with check ((select auth.role()) = 'authenticated');

create policy "school_profiles_delete" on public.school_profiles
    for delete to authenticated
    using ((select auth.role()) = 'authenticated');

create policy "school_profiles_service_role" on public.school_profiles
    for all to service_role
    using (true)
    with check (true);

-- ==============================================================
-- 2. Principal Messages Policies
-- ==============================================================
create policy "principal_messages_select" on public.principal_messages
    for select to anon, authenticated
    using (is_active = true or (select auth.role()) = 'authenticated');

create policy "principal_messages_insert" on public.principal_messages
    for insert to authenticated
    with check ((select auth.role()) = 'authenticated');

create policy "principal_messages_update" on public.principal_messages
    for update to authenticated
    using ((select auth.role()) = 'authenticated')
    with check ((select auth.role()) = 'authenticated');

create policy "principal_messages_delete" on public.principal_messages
    for delete to authenticated
    using ((select auth.role()) = 'authenticated');

create policy "principal_messages_service_role" on public.principal_messages
    for all to service_role
    using (true)
    with check (true);

-- ==============================================================
-- 3. Student Strength Policies
-- ==============================================================
create policy "student_strength_select" on public.student_strength
    for select to anon, authenticated
    using (is_active = true or (select auth.role()) = 'authenticated');

create policy "student_strength_insert" on public.student_strength
    for insert to authenticated
    with check ((select auth.role()) = 'authenticated');

create policy "student_strength_update" on public.student_strength
    for update to authenticated
    using ((select auth.role()) = 'authenticated')
    with check ((select auth.role()) = 'authenticated');

create policy "student_strength_delete" on public.student_strength
    for delete to authenticated
    using ((select auth.role()) = 'authenticated');

create policy "student_strength_service_role" on public.student_strength
    for all to service_role
    using (true)
    with check (true);

-- ==============================================================
-- 4. Gallery Items Policies
-- ==============================================================
create policy "gallery_items_select" on public.gallery_items
    for select to anon, authenticated
    using (is_active = true or (select auth.role()) = 'authenticated');

create policy "gallery_items_insert" on public.gallery_items
    for insert to authenticated
    with check ((select auth.role()) = 'authenticated');

create policy "gallery_items_update" on public.gallery_items
    for update to authenticated
    using ((select auth.role()) = 'authenticated')
    with check ((select auth.role()) = 'authenticated');

create policy "gallery_items_delete" on public.gallery_items
    for delete to authenticated
    using ((select auth.role()) = 'authenticated');

create policy "gallery_items_service_role" on public.gallery_items
    for all to service_role
    using (true)
    with check (true);

-- ==============================================================
-- 5. Faculty Policies
-- ==============================================================
create policy "faculty_select" on public.faculty
    for select to anon, authenticated
    using (is_active = true or (select auth.role()) = 'authenticated');

create policy "faculty_insert" on public.faculty
    for insert to authenticated
    with check ((select auth.role()) = 'authenticated');

create policy "faculty_update" on public.faculty
    for update to authenticated
    using ((select auth.role()) = 'authenticated')
    with check ((select auth.role()) = 'authenticated');

create policy "faculty_delete" on public.faculty
    for delete to authenticated
    using ((select auth.role()) = 'authenticated');

create policy "faculty_service_role" on public.faculty
    for all to service_role
    using (true)
    with check (true);

-- ==============================================================
-- 6. Notices Policies
-- ==============================================================
create policy "notices_select" on public.notices
    for select to anon, authenticated
    using (is_active = true or (select auth.role()) = 'authenticated');

create policy "notices_insert" on public.notices
    for insert to authenticated
    with check ((select auth.role()) = 'authenticated');

create policy "notices_update" on public.notices
    for update to authenticated
    using ((select auth.role()) = 'authenticated')
    with check ((select auth.role()) = 'authenticated');

create policy "notices_delete" on public.notices
    for delete to authenticated
    using ((select auth.role()) = 'authenticated');

create policy "notices_service_role" on public.notices
    for all to service_role
    using (true)
    with check (true);

-- ==============================================================
-- 7. Alumni Policies
-- ==============================================================
create policy "alumni_select" on public.alumni
    for select to anon, authenticated
    using (approved = true or (select auth.role()) = 'authenticated');

create policy "alumni_insert" on public.alumni
    for insert to authenticated
    with check ((select auth.role()) = 'authenticated');

create policy "alumni_update" on public.alumni
    for update to authenticated
    using ((select auth.role()) = 'authenticated')
    with check ((select auth.role()) = 'authenticated');

create policy "alumni_delete" on public.alumni
    for delete to authenticated
    using ((select auth.role()) = 'authenticated');

create policy "alumni_service_role" on public.alumni
    for all to service_role
    using (true)
    with check (true);

-- ==============================================================
-- 8. Feedback & Inquiries Policies
-- ==============================================================
create policy "feedback_insert" on public.feedback
    for insert to anon, authenticated
    with check (true);

create policy "feedback_select" on public.feedback
    for select to authenticated
    using ((select auth.role()) = 'authenticated');

create policy "feedback_update" on public.feedback
    for update to authenticated
    using ((select auth.role()) = 'authenticated')
    with check ((select auth.role()) = 'authenticated');

create policy "feedback_delete" on public.feedback
    for delete to authenticated
    using ((select auth.role()) = 'authenticated');

create policy "feedback_service_role" on public.feedback
    for all to service_role
    using (true)
    with check (true);

-- ==============================================================
-- 9. Admin Users Policies
-- ==============================================================
create policy "admin_users_select" on public.admin_users
    for select to authenticated
    using ((select auth.role()) = 'authenticated');

create policy "admin_users_insert" on public.admin_users
    for insert to authenticated
    with check ((select auth.role()) = 'authenticated');

create policy "admin_users_update" on public.admin_users
    for update to authenticated
    using ((select auth.role()) = 'authenticated')
    with check ((select auth.role()) = 'authenticated');

create policy "admin_users_delete" on public.admin_users
    for delete to authenticated
    using ((select auth.role()) = 'authenticated');

create policy "admin_users_service_role" on public.admin_users
    for all to service_role
    using (true)
    with check (true);

-- --------------------------------------------------------------
-- Indexes for Performance
-- --------------------------------------------------------------
create index if not exists idx_gallery_type_active on public.gallery_items (gallery_type, is_active);
create index if not exists idx_gallery_category on public.gallery_items (category);
create index if not exists idx_student_strength_year on public.student_strength (academic_year, group_type);
create index if not exists idx_faculty_order on public.faculty (order_index);
create index if not exists idx_notices_date on public.notices (date desc);

-- --------------------------------------------------------------
-- Seed Default Data for TGMS Somaram
-- --------------------------------------------------------------

-- Seed Principal Message
insert into public.principal_messages (title, telugu_title, message, telugu_message, important_title, important_text, image_url, image_caption)
values (
    'Principal’s Message',
    'ప్రిన్సిపాల్ సందేశం',
    'Welcome to Telangana Model School & Junior College, Somaram. Our institution is dedicated to nurturing young minds with high-quality English medium education, modern scientific inquiry, and strong ethical values. With modern laboratories, digital classrooms, and 100% free education provided by the Government of Telangana, we empower every student to achieve excellence.',
    'సోమారం తెలంగాణ మోడల్ స్కూల్ & జూనియర్ కళాశాలకు స్వాగతం. నాణ్యమైన ఆంగ్ల మాధ్యమ విద్య, నైతిక విలువలు, శాస్త్రీయ దృక్పథాన్ని పెంపొందించడమే మా లక్ష్యం. అత్యాధునిక ప్రయోగశాలలు, డిజిటల్ తరగతులు మరియు రాష్ట్ర ప్రభుత్వ 100% ఉచిత విద్యా సదుపాయాలతో విద్యార్థులను భావి భారత పౌరులుగా తీర్చిదిద్దుతున్నాము.',
    'Principal FAC · Dr. Bandari Sampath Kumar',
    'Admissions for Classes VI to XII are conducted through the state CGG entrance portal. Textbooks, uniforms, and mid-day meals are 100% free.',
    'images/parents-meeting.jpg',
    'Dr. Bandari Sampath Kumar, Principal FAC addressing parents and students.'
) on conflict do nothing;

-- Seed Student Strength
insert into public.student_strength (academic_year, group_type, class_name, boys, girls, order_index) values
    ('2026–27', 'high_school', 'VI', 48, 33, 1),
    ('2026–27', 'high_school', 'VII', 55, 21, 2),
    ('2026–27', 'high_school', 'VIII', 63, 34, 3),
    ('2026–27', 'high_school', 'IX', 51, 46, 4),
    ('2026–27', 'high_school', 'X', 55, 39, 5),
    ('2026–27', 'intermediate_1', 'MPC', 18, 28, 6),
    ('2026–27', 'intermediate_1', 'BiPC', 4, 37, 7),
    ('2026–27', 'intermediate_1', 'CEC', 15, 16, 8),
    ('2026–27', 'intermediate_1', 'ACE', 7, 10, 9),
    ('2026–27', 'intermediate_2', 'MPC', 16, 33, 10),
    ('2026–27', 'intermediate_2', 'BiPC', 0, 39, 11),
    ('2026–27', 'intermediate_2', 'CEC', 15, 11, 12)
on conflict do nothing;

-- Seed Gallery Items (Campus Gallery vs School Photo Gallery)
insert into public.gallery_items (title, image_url, category, gallery_type, caption, order_index, is_active) values
    ('TGMS Somaram Campus Main Building', 'images/munagala-campus-blue-sky.jpg', 'Campus Gallery', 'campus', 'State-of-the-art Model School building and campus grounds at Somaram.', 1, true),
    ('Parent–Teacher Orientation Meeting', 'images/parents-meeting.jpg', 'School Photo Gallery', 'school', 'Interactive session with parents discussing academic development.', 2, true),
    ('Annual Yoga & Wellness Session', 'images/yoga-session.jpg', 'School Photo Gallery', 'school', 'Students participating in morning yoga and physical well-being activities.', 3, true),
    ('Interactive Classroom & Staff Discussion', 'images/meeting-address.jpg', 'School Photo Gallery', 'school', 'Faculty and leadership addressing parents during the term review.', 4, true),
    ('Community & Parent Participation', 'images/parents-participation.jpg', 'School Photo Gallery', 'school', 'Parents engaging actively in school community initiatives.', 5, true)
on conflict do nothing;

-- Seed Default Admin User
insert into public.admin_users (email, password_hash, role)
values ('tgmssomaram.knr@gmail.com', 'admin@123', 'superadmin')
on conflict (email) do nothing;
