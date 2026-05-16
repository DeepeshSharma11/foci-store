insert into public.categories (name, slug, type)
values
  ('Social Media', 'social', 'app'),
  ('Media', 'media', 'app'),
  ('Tools', 'tools', 'app'),
  ('Productivity', 'productivity', 'app'),
  ('Action', 'action', 'game'),
  ('Racing', 'racing', 'game'),
  ('Puzzle', 'puzzle', 'game'),
  ('Adventure', 'adventure', 'game'),
  ('Sports', 'sports', 'game'),
  ('Strategy', 'strategy', 'game')
on conflict (slug) do update
set
  name = excluded.name,
  type = excluded.type;
