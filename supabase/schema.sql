-- Wecare tables (prefixed) — isolated from existing stock-screener schema

create extension if not exists "pgcrypto";

do $$ begin
  create type public.wecare_user_role as enum ('user', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.wecare_campaign_status as enum ('active', 'paused', 'completed');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.wecare_donation_status as enum ('completed', 'pending', 'failed');
exception when duplicate_object then null;
end $$;

create table if not exists public.wecare_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text not null,
  phone text,
  avatar_url text,
  location text,
  bio text,
  date_of_birth date,
  role public.wecare_user_role not null default 'user',
  created_at timestamptz not null default now()
);

create table if not exists public.wecare_campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null,
  image_url text not null,
  goal_amount numeric(12,2) not null,
  raised_amount numeric(12,2) not null default 0,
  donors_count integer not null default 0,
  status public.wecare_campaign_status not null default 'active',
  created_by uuid references public.wecare_profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.wecare_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text not null,
  event_date date not null,
  event_time text not null,
  image_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.wecare_donations (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.wecare_campaigns(id) on delete cascade,
  donor_id uuid references public.wecare_profiles(id),
  donor_name text not null,
  amount numeric(12,2) not null,
  status public.wecare_donation_status not null default 'completed',
  stripe_payment_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.wecare_activities (
  id uuid primary key default gen_random_uuid(),
  user_name text not null,
  action text not null,
  avatar_color text default '#28C76F',
  created_at timestamptz not null default now()
);

create table if not exists public.wecare_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.wecare_profiles(id) on delete cascade,
  title text not null,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.wecare_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.wecare_profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'wecare_role')::public.wecare_user_role, 'user')
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.wecare_profiles.full_name);
  return new;
end;
$$;

drop trigger if exists wecare_on_auth_user_created on auth.users;
create trigger wecare_on_auth_user_created
  after insert on auth.users
  for each row execute function public.wecare_handle_new_user();

create or replace function public.wecare_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.wecare_profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.wecare_profiles enable row level security;
alter table public.wecare_campaigns enable row level security;
alter table public.wecare_donations enable row level security;
alter table public.wecare_events enable row level security;
alter table public.wecare_activities enable row level security;
alter table public.wecare_notifications enable row level security;

drop policy if exists "wecare profiles select" on public.wecare_profiles;
drop policy if exists "wecare profiles update" on public.wecare_profiles;
drop policy if exists "wecare profiles insert" on public.wecare_profiles;
drop policy if exists "wecare campaigns select" on public.wecare_campaigns;
drop policy if exists "wecare campaigns insert" on public.wecare_campaigns;
drop policy if exists "wecare campaigns update" on public.wecare_campaigns;
drop policy if exists "wecare events select" on public.wecare_events;
drop policy if exists "wecare donations select" on public.wecare_donations;
drop policy if exists "wecare donations insert" on public.wecare_donations;
drop policy if exists "wecare activities select" on public.wecare_activities;
drop policy if exists "wecare notifications select" on public.wecare_notifications;

create policy "wecare profiles select"
  on public.wecare_profiles for select
  using (auth.uid() = id or public.wecare_is_admin());

create policy "wecare profiles update"
  on public.wecare_profiles for update
  using (auth.uid() = id or public.wecare_is_admin());

create policy "wecare profiles insert"
  on public.wecare_profiles for insert
  with check (auth.uid() = id or public.wecare_is_admin());

create policy "wecare campaigns select"
  on public.wecare_campaigns for select using (true);

create policy "wecare campaigns insert"
  on public.wecare_campaigns for insert
  with check (auth.role() = 'authenticated');

create policy "wecare campaigns update"
  on public.wecare_campaigns for update
  using (public.wecare_is_admin() or created_by = auth.uid());

create policy "wecare events select"
  on public.wecare_events for select using (true);

create policy "wecare donations select"
  on public.wecare_donations for select using (true);

create policy "wecare donations insert"
  on public.wecare_donations for insert
  with check (auth.role() = 'authenticated');

create policy "wecare activities select"
  on public.wecare_activities for select using (true);

create policy "wecare notifications select"
  on public.wecare_notifications for select
  using (user_id = auth.uid() or public.wecare_is_admin());

drop policy if exists "wecare notifications update" on public.wecare_notifications;
create policy "wecare notifications update"
  on public.wecare_notifications for update
  using (user_id = auth.uid() or public.wecare_is_admin());

-- Allow anon/authenticated read for demo listing (campaigns/events already public)
grant usage on schema public to anon, authenticated;
grant select on public.wecare_campaigns to anon, authenticated;
grant select on public.wecare_events to anon, authenticated;
grant select on public.wecare_donations to anon, authenticated;
grant select on public.wecare_activities to anon, authenticated;
grant select, insert, update on public.wecare_profiles to authenticated;
grant insert, update on public.wecare_campaigns to authenticated;
grant insert on public.wecare_donations to authenticated;
grant select, update on public.wecare_notifications to authenticated;
