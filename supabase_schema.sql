-- ==============================================================
-- TGMS Somaram | Supabase Database Schema
-- Run this script in your Supabase SQL Editor:
-- https://app.supabase.com/project/_/sql
-- ==============================================================

-- 1. Enable pgcrypto extension for UUID generation
create extension if not exists "pgcrypto";

-- 2. School Profile / Content table
create table if not exists public.school_profiles (
    id text primary key,
    profile_key text unique not null,
    values jsonb not null default '{}'::jsonb,
    revision integer not null default 1,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Flash News & Announcements table
create table if not exists public.notices (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    detail text,
    date text not null default to_char(current_date, 'YYYY-MM-DD'),
    is_active boolean not null default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Inquiries & Feedback table (Contact form & Admission inquiries)
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

-- 5. Administrators table
create table if not exists public.admin_users (
    id uuid default gen_random_uuid() primary key,
    email text unique not null,
    password_hash text not null,
    role text not null default 'admin',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.school_profiles enable row level security;
alter table public.notices enable row level security;
alter table public.feedback enable row level security;
alter table public.admin_users enable row level security;

-- Policies for school_profiles
drop policy if exists "Allow public read on school_profiles" on public.school_profiles;
create policy "Allow public read on school_profiles"
    on public.school_profiles for select
    using (true);

drop policy if exists "Allow service role full access on school_profiles" on public.school_profiles;
create policy "Allow service role full access on school_profiles"
    on public.school_profiles for all
    using (auth.role() = 'service_role' or auth.role() = 'authenticated');

-- Policies for notices
drop policy if exists "Allow public read on notices" on public.notices;
create policy "Allow public read on notices"
    on public.notices for select
    using (is_active = true);

drop policy if exists "Allow service role full access on notices" on public.notices;
create policy "Allow service role full access on notices"
    on public.notices for all
    using (auth.role() = 'service_role' or auth.role() = 'authenticated');

-- Policies for feedback
drop policy if exists "Allow public insert on feedback" on public.feedback;
create policy "Allow public insert on feedback"
    on public.feedback for insert
    with check (true);

drop policy if exists "Allow admin read on feedback" on public.feedback;
create policy "Allow admin read on feedback"
    on public.feedback for select
    using (auth.role() = 'service_role' or auth.role() = 'authenticated');

-- Seed initial data for TGMS Somaram
insert into public.school_profiles (id, profile_key, values, revision)
values (
    'tgms_profile_tgms-somaram',
    'tgms_profile_tgms-somaram',
    '{"principal": {"name": "Farhana", "designation": "Principal FAC", "qualification": "M.Sc., B.Ed.", "phone": "08727-285222", "email": "tgmssomaram.knr@gmail.com"}, "address": "Somaram (Village), Saidapur Mandal, Karimnagar District, Telangana – 505490", "faculty": [["K. Veerababu", "PGT Mathematics / Principal FAC", "M.Sc., B.Ed."], ["Jamalapuram Ramakrishna", "PGT Economics", "M.Sc., Town Planning, SET"], ["Boora Saidaiah Goud", "PGT Civics", "M.A., B.Ed."], ["Bandi Saidulu", "PGT Botany", "M.Sc., B.Ed., SET"], ["Vutukuri Ravinder Reddy", "PGT Chemistry", "M.Sc., B.Ed."], ["Pokala Venkateswara Rao", "PGT Zoology", "M.Sc., B.Ed."], ["Shaik Sharief", "PGT Physics", "M.Sc., B.Ed."], ["Shaik Jani", "PGT English", "M.A., B.Ed."], ["Bommaganti Sushmitha", "PGT Mathematics", "M.Sc., B.Ed."], ["Chandala Vani Sree", "PGT Telugu", "M.A., B.Ed."], ["Shaik Jakir Hussain", "PGT Telugu", "M.A., B.Ed."], ["Kondeti Saidulu", "PGT English", "M.A., B.Ed."], ["Guttula G. S. Veera Subramaneswara Rao", "TGT Social Studies", "M.A., M.Ed."], ["Konkapaka Gayathri", "TGT Mathematics", "M.Sc., B.Ed."], ["Nagarjunapu Ramalinga Chary", "TGT Telugu", "M.A., B.Ed."], ["Shaik Ramjanbegam", "TGT Hindi", "M.A., HPT"]], "guest": [["Sk. Rajiya", "TGT Hindi", "M.A., HPT"], ["Ch. Ramesh", "TGT English", "M.A., B.Ed."], ["M. Venkateswarlu", "TGT Science", "M.Sc., B.Ed."], ["D. Renuka", "PGT Mathematics", "M.Sc., B.Ed."], ["Ch. Ramesh", "PGT Commerce", "M.Com., B.Ed."]], "vocational": [["K. Lakshmi", "Media and Entertainment", "B.Com. (Computers), DTP, PGDCA, Animation"], ["E. Vijaya Durga", "Health Care", "GNM Nursing"]], "support": [["Narra Kavitha", "Computer Operator"], ["Shaik Jan Pasha", "Physical Director (PD)"], ["Bobbili Padma", "Office Subordinate"], ["Kolukulapalli Pullaiah", "Night Watchman"]], "gallery": [{"src": "images/parents-meeting.jpg", "title": "Parent–teacher meeting", "te": "తల్లిదండ్రుల సమావేశం", "category": "School Activities"}, {"src": "images/yoga-session.jpg", "title": "Yoga and well-being", "te": "యోగా కార్యక్రమం", "category": "Well-being"}, {"src": "images/meeting-address.jpg", "title": "School–parent interaction", "te": "పాఠశాల–తల్లిదండ్రుల ముఖాముఖి", "category": "School Activities"}, {"src": "images/parents-participation.jpg", "title": "Parents participating in school activities", "te": "పాఠశాల కార్యక్రమంలో తల్లిదండ్రుల భాగస్వామ్యం", "category": "School Activities"}], "mapUrl": "https://maps.google.com/maps?q=18.240000,79.300000", "coordinates": {"lat": 18.24, "lng": 79.3}, "notices": [], "downloads": [], "calendarFeedUrl": "https://calendar.google.com/calendar/ical/9b6bd89b931449c6dab271ec3d5ec995dbb2a8235139220258a8161a39805386%40group.calendar.google.com/public/basic.ics", "udiseCode": "36131100206", "collegeCode": "15124", "showAdmissionSeats": true, "settings": {"schoolTitle": "Telangana Model School & Junior College, Somaram", "teluguTitle": "తెలంగాణ మోడల్ స్కూల్ & జూనియర్ కళాశాల, సోమారం", "authority": "School Education Department, Govt. of Telangana", "welcomeTitle": "Welcome to TGMS Somaram", "welcomeDescription": "A place to learn, explore and grow. Discover school information, educational resources and opportunities to connect with our learning community.", "gradientStart": "#fff0df", "gradientEnd": "#ff983f", "youtubeUrl": ""}, "flashNews": [{"id": "somaram-welcome-1", "title": "Welcome to Telangana Model School & Junior College, Somaram (Saidapur Mandal, Karimnagar Dist.)", "detail": "Welcome to Telangana Model School & Junior College, Somaram. High quality English medium education from Class VI to XII.", "date": "2026-11-01"}, {"id": "somaram-admissions-2", "title": "సోమారం తెలంగాణ మోడల్ స్కూల్ & జూనియర్ కళాశాలలో ప్రవేశాలు, విద్యా సమాచారం | Admissions & Academic updates for TGMS Somaram.", "detail": "సోమారం తెలంగాణ మోడల్ స్కూల్ & జూనియర్ కళాశాలలో ప్రవేశాలు, విద్యా సమాచారం | Admissions & Academic updates for TGMS Somaram.", "date": "2026-11-05"}, {"id": "somaram-exams-3", "title": "TGMSCET & INTERMEDIATE / SSC ACADEMIC CALENDAR & EXAMINATION UPDATES.", "detail": "TGMSCET & INTERMEDIATE / SSC ACADEMIC CALENDAR & EXAMINATION UPDATES.", "date": "2026-11-10"}]}'::jsonb,
    1
)
on conflict (profile_key) do update
set values = excluded.values,
    updated_at = timezone('utc'::text, now());

-- Seed initial flash notices
insert into public.notices (title, detail, date, is_active)
values
    ('Welcome to Telangana Model School & Junior College, Somaram (Saidapur Mandal, Karimnagar Dist.)', 'Welcome to Telangana Model School & Junior College, Somaram. High quality English medium education from Class VI to XII.', '2026-11-01', true),
    ('సోమారం తెలంగాణ మోడల్ స్కూల్ & జూనియర్ కళాశాలలో ప్రవేశాలు, విద్యా సమాచారం | Admissions & Academic updates for TGMS Somaram.', 'సోమారం తెలంగాణ మోడల్ స్కూల్ & జూనియర్ కళాశాలలో ప్రవేశాలు, విద్యా సమాచారం | Admissions & Academic updates for TGMS Somaram.', '2026-11-05', true),
    ('TGMSCET & INTERMEDIATE / SSC ACADEMIC CALENDAR & EXAMINATION UPDATES.', 'TGMSCET & INTERMEDIATE / SSC ACADEMIC CALENDAR & EXAMINATION UPDATES.', '2026-11-10', true)
on conflict do nothing;

-- ==============================================================
-- ADMIN PORTAL ADDITIONS
-- Run these statements after the initial schema above
-- ==============================================================

-- Faculty table
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

-- Gallery items table
create table if not exists public.gallery_items (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    image_url text not null,
    category text not null default 'School Activities',
    caption text,
    is_active boolean not null default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.faculty enable row level security;
alter table public.gallery_items enable row level security;

drop policy if exists "Allow public read on faculty" on public.faculty;
create policy "Allow public read on faculty" on public.faculty for select using (is_active = true);

drop policy if exists "Allow service role full access on faculty" on public.faculty;
create policy "Allow service role full access on faculty" on public.faculty for all
    using (auth.role() = 'service_role' or auth.role() = 'authenticated');

drop policy if exists "Allow public read on gallery_items" on public.gallery_items;
create policy "Allow public read on gallery_items" on public.gallery_items for select using (is_active = true);

drop policy if exists "Allow service role full access on gallery_items" on public.gallery_items;
create policy "Allow service role full access on gallery_items" on public.gallery_items for all
    using (auth.role() = 'service_role' or auth.role() = 'authenticated');

insert into public.faculty (name, designation, subject, qualification, order_index, is_active) values
    ('Farhana', 'Principal FAC', 'Administration', 'M.Sc., B.Ed.', 0, true),
    ('K. Veerababu', 'PGT Mathematics', 'Mathematics', 'M.Sc., B.Ed.', 1, true),
    ('Jamalapuram Ramakrishna', 'PGT Economics', 'Economics', 'M.Sc., Town Planning, SET', 2, true),
    ('Boora Saidaiah Goud', 'PGT Civics', 'Civics', 'M.A., B.Ed.', 3, true),
    ('Bandi Saidulu', 'PGT Botany', 'Botany', 'M.Sc., B.Ed., SET', 4, true),
    ('Vutukuri Ravinder Reddy', 'PGT Chemistry', 'Chemistry', 'M.Sc., B.Ed.', 5, true),
    ('Pokala Venkateswara Rao', 'PGT Zoology', 'Zoology', 'M.Sc., B.Ed.', 6, true),
    ('Shaik Sharief', 'PGT Physics', 'Physics', 'M.Sc., B.Ed.', 7, true),
    ('Shaik Jani', 'PGT English', 'English', 'M.A., B.Ed.', 8, true),
    ('Bommaganti Sushmitha', 'PGT Mathematics', 'Mathematics', 'M.Sc., B.Ed.', 9, true),
    ('Chandala Vani Sree', 'PGT Telugu', 'Telugu', 'M.A., B.Ed.', 10, true),
    ('Shaik Jakir Hussain', 'PGT Telugu', 'Telugu', 'M.A., B.Ed.', 11, true),
    ('Kondeti Saidulu', 'PGT English', 'English', 'M.A., B.Ed.', 12, true)
on conflict do nothing;
