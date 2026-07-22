-- ============================================================
-- KeenKids Staging Schema
-- Paste this entire file into the Supabase SQL Editor
-- (the SAME Supabase project as production) and click Run.
-- All tables live in the 'staging' schema, leaving 'public' untouched.
-- ============================================================

create schema if not exists staging;

-- ── schools ──────────────────────────────────────────────────
create table if not exists staging.schools (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  created_at  timestamp not null default now()
);

-- ── school_schedule ──────────────────────────────────────────
create table if not exists staging.school_schedule (
  id          uuid primary key default gen_random_uuid(),
  school_id   uuid not null references staging.schools(id) on delete cascade,
  day_of_week integer not null,
  subject     text not null
);

-- ── classrooms ───────────────────────────────────────────────
create table if not exists staging.classrooms (
  id           uuid primary key default gen_random_uuid(),
  school_id    uuid references staging.schools(id),
  teacher_id   uuid,
  name         text not null,
  grade_level  text not null,
  grade_band   text not null,
  access_code  text not null unique,
  created_at   timestamp not null default now()
);

-- ── users ────────────────────────────────────────────────────
create table if not exists staging.users (
  id             uuid primary key default gen_random_uuid(),
  school_id      uuid references staging.schools(id) on delete set null,
  classroom_id   uuid references staging.classrooms(id) on delete set null,
  name           text not null,
  display_name   text,
  role           text not null,
  avatar_id      integer default 1,
  pin_hash       text,
  email          text unique,
  password_hash  text,
  created_at     timestamp not null default now(),
  last_active_at timestamp,
  deleted_at     timestamp,
  approved_at    timestamp
);

-- ── curriculum ───────────────────────────────────────────────
create table if not exists staging.curriculum (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  grade_band   text not null,
  week_number  integer not null,
  theme        text,
  is_active    boolean not null default true,
  created_at   timestamp not null default now()
);

-- ── classroom_curriculum ─────────────────────────────────────
create table if not exists staging.classroom_curriculum (
  id              uuid primary key default gen_random_uuid(),
  classroom_id    uuid not null references staging.classrooms(id) on delete cascade,
  curriculum_id   uuid not null references staging.curriculum(id),
  assigned_by     uuid references staging.users(id),
  week_start_date date not null,
  assigned_at     timestamp not null default now(),
  constraint uq_staging_classroom_week unique (classroom_id, week_start_date)
);

-- ── curriculum_days ──────────────────────────────────────────
create table if not exists staging.curriculum_days (
  id            uuid primary key default gen_random_uuid(),
  curriculum_id uuid not null references staging.curriculum(id) on delete cascade,
  day_of_week   integer not null,
  subject       text not null,
  theme         text
);

-- ── content_items ────────────────────────────────────────────
create table if not exists staging.content_items (
  id              uuid primary key default gen_random_uuid(),
  subject         text not null,
  type            text not null,
  title           text not null,
  description     text,
  thumbnail_url   text,
  content_url     text,
  duration_mins   integer,
  age_min         integer default 6,
  age_max         integer default 10,
  grade_band      text not null,
  difficulty      integer default 1,
  tags            text[],
  step_count      integer,
  metadata        jsonb,
  is_ai_generated boolean default false,
  created_at      timestamp not null default now()
);

-- ── curriculum_content ───────────────────────────────────────
create table if not exists staging.curriculum_content (
  id                   uuid primary key default gen_random_uuid(),
  curriculum_day_id    uuid not null references staging.curriculum_days(id) on delete cascade,
  content_item_id      uuid not null references staging.content_items(id),
  order_index          integer default 0
);

-- ── student_sessions ─────────────────────────────────────────
create table if not exists staging.student_sessions (
  id              uuid primary key default gen_random_uuid(),
  student_id      uuid not null references staging.users(id) on delete cascade,
  content_item_id uuid not null references staging.content_items(id),
  started_at      timestamp not null default now(),
  last_active_at  timestamp,
  progress_pct    integer default 0,
  last_step_index integer default 0,
  completed       boolean default false,
  completed_at    timestamp,
  session_data    jsonb,
  constraint uq_staging_student_content unique (student_id, content_item_id)
);

create index if not exists idx_staging_student_completed
  on staging.student_sessions(student_id, completed);

-- ── coding_projects ──────────────────────────────────────────
create table if not exists staging.coding_projects (
  id                    uuid primary key default gen_random_uuid(),
  student_id            uuid not null references staging.users(id) on delete cascade,
  curriculum_content_id uuid references staging.curriculum_content(id),
  title                 text default 'My Project',
  language              text not null,
  r2_key                text unique,
  project_data          text,
  thumbnail_r2_key      text,
  last_saved_at         timestamp not null default now(),
  created_at            timestamp not null default now()
);

create index if not exists idx_staging_student_projects
  on staging.coding_projects(student_id);

-- ── achievements ─────────────────────────────────────────────
create table if not exists staging.achievements (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references staging.users(id) on delete cascade,
  badge_type  text not null,
  earned_at   timestamp not null default now(),
  metadata    jsonb
);

-- ============================================================
-- Seed: demo school + 2 classrooms for immediate testing
-- ============================================================
insert into staging.schools (name, slug)
values ('Demo School', 'demo')
on conflict do nothing;

insert into staging.classrooms (name, grade_level, grade_band, access_code, school_id)
select 'Demo Class 1-2', '1', 'g1-2', 'STAGE1', id from staging.schools where slug = 'demo'
on conflict do nothing;

insert into staging.classrooms (name, grade_level, grade_band, access_code, school_id)
select 'Demo Class 3-4', '3', 'g3-4', 'STAGE2', id from staging.schools where slug = 'demo'
on conflict do nothing;
