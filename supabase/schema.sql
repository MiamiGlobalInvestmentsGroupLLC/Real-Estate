-- DealEdge AI — Supabase Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor → New Query → Run

-- 1. Profiles table
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  name text not null default '',
  company text not null default '',
  phone text not null default '',
  plan text not null default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text default 'inactive',
  subscription_current_period_end timestamptz,
  subscription_validated boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Row Level Security
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 3. Auto-create profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $func$
begin
  insert into public.profiles (id, email, name)
  values (
    NEW.id,
    NEW.email,
    coalesce(NEW.raw_user_meta_data ->> 'name', '')
  );
  return NEW;
end;
$func$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
