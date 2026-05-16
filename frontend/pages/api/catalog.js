import { createClient } from '@supabase/supabase-js'

function mapItem(item) {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    category: item.categories?.slug || item.type,
    image: item.image_url || 'https://placehold.co/300x200/667eea/ffffff?text=Image+N/A',
    size: item.size,
    version: item.version,
    rating: item.rating,
    popularity: item.popularity,
    releaseDate: item.release_date,
    downloads: item.downloads,
    downloadUrl: item.external_download_url || item.file_url || '#',
    badge: item.badge,
    isFeatured: item.is_featured,
  }
}

export default async function handler(_req, res) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    res.status(500).json({ ok: false, error: 'Supabase public env missing' })
    return
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const { data, error } = await supabase
    .from('apps')
    .select('id,type,name,slug,description,categories(slug),image_url,file_url,external_download_url,size,version,rating,popularity,downloads,badge,is_featured,release_date')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    res.status(500).json({ ok: false, error: error.message })
    return
  }

  const apps = []
  const games = []

  for (const item of data || []) {
    if (item.type === 'game') games.push(mapItem(item))
    else apps.push(mapItem(item))
  }

  res.status(200).json({ ok: true, apps, games })
}
