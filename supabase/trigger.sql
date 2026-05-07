-- Run this in Supabase SQL Editor if the profiles table already exists
-- This only recreates the function and trigger

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

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
