-- ==============================================================
-- TGMS Somaram | Migration Script: Fix Supabase RLS Linter Warnings
-- Resolves:
--   1. auth_rls_initplan (re-evaluation of auth.role() per row)
--   2. multiple_permissive_policies (overlapping permissive policies for same role/action)
--
-- Instructions:
-- Run this entire script in Supabase SQL Editor:
-- https://app.supabase.com/project/_/sql
-- ==============================================================

-- 1. Ensure RLS is active on all tables
alter table if exists public.school_profiles enable row level security;
alter table if exists public.principal_messages enable row level security;
alter table if exists public.student_strength enable row level security;
alter table if exists public.gallery_items enable row level security;
alter table if exists public.faculty enable row level security;
alter table if exists public.notices enable row level security;
alter table if exists public.alumni enable row level security;
alter table if exists public.feedback enable row level security;
alter table if exists public.admin_users enable row level security;

-- 2. Drop all legacy policies
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
-- 3. Create cleanly scoped, warning-free RLS policies
-- ==============================================================

-- --------------------------------------------------------------
-- Table: school_profiles
-- --------------------------------------------------------------
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

-- --------------------------------------------------------------
-- Table: principal_messages
-- --------------------------------------------------------------
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

-- --------------------------------------------------------------
-- Table: student_strength
-- --------------------------------------------------------------
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

-- --------------------------------------------------------------
-- Table: gallery_items
-- --------------------------------------------------------------
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

-- --------------------------------------------------------------
-- Table: faculty
-- --------------------------------------------------------------
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

-- --------------------------------------------------------------
-- Table: notices
-- --------------------------------------------------------------
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

-- --------------------------------------------------------------
-- Table: alumni
-- --------------------------------------------------------------
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

-- --------------------------------------------------------------
-- Table: feedback
-- --------------------------------------------------------------
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

-- --------------------------------------------------------------
-- Table: admin_users
-- --------------------------------------------------------------
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
