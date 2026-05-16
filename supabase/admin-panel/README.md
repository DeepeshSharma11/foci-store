# Admin Panel Supabase Schema

Run `001_admin_apps_schema.sql` in Supabase SQL Editor.
Run `002_seed_categories.sql` to add default app/game categories.

If you previously created `public.is_admin` manually, this migration drops common overloads and recreates the no-argument helper used by the policies.

## Tables

- `categories` - app/game categories.
- `apps` - apps and games managed by admin panel.
- `admin_users` - allowed admin/editor users.

## Storage

- `app-images` - public images.
- `app-files` - private app files.

## Admin Setup

After creating a Supabase auth user, add that user id:

```sql
insert into public.admin_users (id, email, role)
values ('USER_AUTH_UUID', 'admin@example.com', 'admin');
```

Or insert by email:

```sql
insert into public.admin_users (id, email, role)
select id, email, 'admin'
from auth.users
where email = 'admin@example.com'
on conflict (id) do update
set email = excluded.email, role = 'admin';
```
