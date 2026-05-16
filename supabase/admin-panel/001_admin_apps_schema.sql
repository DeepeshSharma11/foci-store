create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  type text not null check (type in ('app', 'game')),
  created_at timestamptz not null default now()
);

create table if not exists public.apps (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('app', 'game')),
  name text not null,
  slug text not null unique,
  description text not null,
  category_id uuid references public.categories(id) on delete set null,
  image_url text,
  file_url text,
  external_download_url text,
  size text,
  version text,
  rating numeric(2,1) default 0 check (rating >= 0 and rating <= 5),
  popularity integer default 0 check (popularity >= 0),
  downloads text default '0',
  badge text,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  release_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists apps_set_updated_at on public.apps;

create trigger apps_set_updated_at
before update on public.apps
for each row
execute function public.set_updated_at();

drop function if exists public.is_admin();
drop function if exists public.is_admin(uuid);
drop function if exists public.is_admin(text);

create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1
    from public.admin_users
    where id = auth.uid()
  );
$$ language sql security definer set search_path = public;

grant execute on function public.is_admin() to anon, authenticated;

alter table public.categories enable row level security;
alter table public.apps enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "Public read published apps" on public.apps;
create policy "Public read published apps"
on public.apps
for select
using (is_published = true);

drop policy if exists "Public read categories" on public.categories;
create policy "Public read categories"
on public.categories
for select
using (true);

drop policy if exists "Admin manage apps" on public.apps;
create policy "Admin manage apps"
on public.apps
for all
using (public.is_admin() = true)
with check (public.is_admin() = true);

drop policy if exists "Admin manage categories" on public.categories;
create policy "Admin manage categories"
on public.categories
for all
using (public.is_admin() = true)
with check (public.is_admin() = true);

drop policy if exists "Admin read admin users" on public.admin_users;
create policy "Admin read admin users"
on public.admin_users
for select
using (public.is_admin() = true);

insert into storage.buckets (id, name, public)
values
  ('app-images', 'app-images', true),
  ('app-files', 'app-files', false)
on conflict (id) do nothing;
