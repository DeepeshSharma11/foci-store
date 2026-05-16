import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

const initialForm = {
  type: 'app',
  name: '',
  slug: '',
  description: '',
  category_id: '',
  image_url: '',
  file_url: '',
  external_download_url: '',
  size: '',
  version: '',
  rating: '0',
  popularity: '0',
  downloads: '0',
  badge: '',
  is_featured: false,
  is_published: false,
  release_date: '',
}

const defaultCategories = [
  { name: 'Social Media', slug: 'social', type: 'app' },
  { name: 'Media', slug: 'media', type: 'app' },
  { name: 'Tools', slug: 'tools', type: 'app' },
  { name: 'Productivity', slug: 'productivity', type: 'app' },
  { name: 'Action', slug: 'action', type: 'game' },
  { name: 'Racing', slug: 'racing', type: 'game' },
  { name: 'Puzzle', slug: 'puzzle', type: 'game' },
  { name: 'Adventure', slug: 'adventure', type: 'game' },
  { name: 'Sports', slug: 'sports', type: 'game' },
  { name: 'Strategy', slug: 'strategy', type: 'game' },
]

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [admin, setAdmin] = useState(null)
  const [categories, setCategories] = useState([])
  const [apps, setApps] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [status, setStatus] = useState({ type: 'info', text: 'Checking admin access...' })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const filteredCategories = useMemo(
    () => categories.filter(category => category.type === form.type),
    [categories, form.type]
  )

  useEffect(() => {
    async function loadAdmin() {
      if (!supabase) {
        setStatus({ type: 'error', text: 'Supabase env keys missing in frontend/.env' })
        return
      }

      setLoading(true)
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData.user) {
        router.replace('/login?next=/admin')
        return
      }

      setUser(userData.user)

      const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_admin')

      if (adminCheckError || !isAdmin) {
        setStatus({
          type: 'error',
          text: `Access denied. Logged user id: ${userData.user.id}. Add this exact id in public.admin_users.`,
        })
        setLoading(false)
        return
      }

      const { data: adminData } = await supabase
        .from('admin_users')
        .select('id,email,role')
        .eq('id', userData.user.id)
        .maybeSingle()

      setAdmin(adminData)
      await Promise.all([loadCategories(), loadApps()])
      setStatus({ type: '', text: '' })
      setLoading(false)
    }

    loadAdmin()
  }, [router])

  async function loadCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('id,name,slug,type')
      .order('name', { ascending: true })

    if (!error) setCategories(data || [])
  }

  async function loadApps() {
    const { data, error } = await supabase
      .from('apps')
      .select('id,type,name,slug,description,category_id,image_url,file_url,external_download_url,size,version,rating,popularity,downloads,badge,is_published,is_featured,release_date,created_at')
      .order('created_at', { ascending: false })
      .limit(20)

    if (!error) setApps(data || [])
  }

  function updateField(name, value) {
    setForm(current => {
      const next = { ...current, [name]: value }
      if (name === 'name' && !current.slug) next.slug = slugify(value)
      if (name === 'type') next.category_id = ''
      return next
    })
  }

  async function handleCreateCategory(event) {
    event.preventDefault()
    const name = window.prompt(`New ${form.type} category name`)
    if (!name) return

    const slug = slugify(name)
    const { data, error } = await supabase
      .from('categories')
      .insert({ name, slug, type: form.type })
      .select('id,name,slug,type')
      .single()

    if (error) {
      setStatus({ type: 'error', text: error.message })
      return
    }

    setCategories(current => [...current, data].sort((a, b) => a.name.localeCompare(b.name)))
    setForm(current => ({ ...current, category_id: data.id }))
    setStatus({ type: 'success', text: 'Category added.' })
  }

  async function handleSeedCategories() {
    setStatus({ type: '', text: '' })
    const { error } = await supabase
      .from('categories')
      .upsert(defaultCategories, { onConflict: 'slug' })

    if (error) {
      setStatus({ type: 'error', text: error.message })
      return
    }

    await loadCategories()
    setStatus({ type: 'success', text: 'Default categories added.' })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus({ type: '', text: '' })
    setSaving(true)

    const payload = {
      ...form,
      category_id: form.category_id || null,
      rating: Number(form.rating || 0),
      popularity: Number(form.popularity || 0),
      release_date: form.release_date || null,
      file_url: form.file_url || null,
      image_url: form.image_url || null,
      external_download_url: form.external_download_url || null,
      badge: form.badge || null,
      size: form.size || null,
      version: form.version || null,
      slug: form.slug || slugify(form.name),
    }

    const query = editingId
      ? supabase.from('apps').update(payload).eq('id', editingId)
      : supabase.from('apps').insert(payload)

    const { error } = await query
    setSaving(false)

    if (error) {
      setStatus({ type: 'error', text: error.message })
      return
    }

    setForm(initialForm)
    setEditingId(null)
    await loadApps()
    setStatus({ type: 'success', text: editingId ? 'App/game updated successfully.' : 'App/game added successfully.' })
  }

  function handleEdit(item) {
    setEditingId(item.id)
    setForm({
      type: item.type || 'app',
      name: item.name || '',
      slug: item.slug || '',
      description: item.description || '',
      category_id: item.category_id || '',
      image_url: item.image_url || '',
      file_url: item.file_url || '',
      external_download_url: item.external_download_url || '',
      size: item.size || '',
      version: item.version || '',
      rating: String(item.rating ?? 0),
      popularity: String(item.popularity ?? 0),
      downloads: item.downloads || '0',
      badge: item.badge || '',
      is_featured: Boolean(item.is_featured),
      is_published: Boolean(item.is_published),
      release_date: item.release_date || '',
    })
    setStatus({ type: 'info', text: `Editing ${item.name}.` })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCancelEdit() {
    setEditingId(null)
    setForm(initialForm)
    setStatus({ type: '', text: '' })
  }

  async function handleDelete(item) {
    const ok = window.confirm(`Delete ${item.name}?`)
    if (!ok) return

    const { error } = await supabase.from('apps').delete().eq('id', item.id)

    if (error) {
      setStatus({ type: 'error', text: error.message })
      return
    }

    if (editingId === item.id) handleCancelEdit()
    await loadApps()
    setStatus({ type: 'success', text: 'App/game deleted successfully.' })
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <main className="admin-page">
      <header className="admin-topbar">
        <div>
          <Link href="/" className="admin-brand">FociStore</Link>
          <span>Admin Panel</span>
        </div>
        <nav>
          <Link href="/account">Account</Link>
          <button type="button" onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      <section className="admin-layout">
        <div className="admin-panel admin-intro">
          <h1>Add Apps & Games</h1>
          <p>{user?.email || 'Admin'} {admin?.role ? `(${admin.role})` : ''}</p>
          {status.text ? <div className={`admin-message admin-message-${status.type}`}>{status.text}</div> : null}
        </div>

        {admin && !loading ? (
          <>
            <form className="admin-panel admin-form" onSubmit={handleSubmit}>
              <div className="admin-grid two">
                <label>
                  Type
                  <select value={form.type} onChange={e => updateField('type', e.target.value)}>
                    <option value="app">App</option>
                    <option value="game">Game</option>
                  </select>
                </label>
                <label>
                  Category
                  <div className="admin-inline">
                    <select value={form.category_id} onChange={e => updateField('category_id', e.target.value)}>
                      <option value="">No category</option>
                      {filteredCategories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                    <button type="button" onClick={handleCreateCategory}>Add</button>
                  </div>
                  {!filteredCategories.length ? (
                    <button className="admin-link-button" type="button" onClick={handleSeedCategories}>
                      Add default categories
                    </button>
                  ) : null}
                </label>
              </div>

              <div className="admin-grid two">
                <label>
                  Name
                  <input value={form.name} onChange={e => updateField('name', e.target.value)} required />
                </label>
                <label>
                  Slug
                  <input value={form.slug} onChange={e => updateField('slug', slugify(e.target.value))} required />
                </label>
              </div>

              <label>
                Description
                <textarea value={form.description} onChange={e => updateField('description', e.target.value)} required rows={4} />
              </label>

              <div className="admin-grid two">
                <label>
                  Image URL
                  <input value={form.image_url} onChange={e => updateField('image_url', e.target.value)} placeholder="/assets/images/app.png" />
                </label>
                <label>
                  Download URL
                  <input value={form.external_download_url} onChange={e => updateField('external_download_url', e.target.value)} placeholder="https://..." />
                </label>
              </div>

              <div className="admin-grid four">
                <label>
                  Size
                  <input value={form.size} onChange={e => updateField('size', e.target.value)} placeholder="95 MB" />
                </label>
                <label>
                  Version
                  <input value={form.version} onChange={e => updateField('version', e.target.value)} placeholder="v1.0" />
                </label>
                <label>
                  Rating
                  <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => updateField('rating', e.target.value)} />
                </label>
                <label>
                  Popularity
                  <input type="number" min="0" value={form.popularity} onChange={e => updateField('popularity', e.target.value)} />
                </label>
              </div>

              <div className="admin-grid four">
                <label>
                  Downloads
                  <input value={form.downloads} onChange={e => updateField('downloads', e.target.value)} placeholder="10K+" />
                </label>
                <label>
                  Badge
                  <input value={form.badge} onChange={e => updateField('badge', e.target.value)} placeholder="New" />
                </label>
                <label>
                  Release Date
                  <input type="date" value={form.release_date} onChange={e => updateField('release_date', e.target.value)} />
                </label>
                <label>
                  File URL
                  <input value={form.file_url} onChange={e => updateField('file_url', e.target.value)} />
                </label>
              </div>

              <div className="admin-checks">
                <label><input type="checkbox" checked={form.is_featured} onChange={e => updateField('is_featured', e.target.checked)} /> Featured</label>
                <label><input type="checkbox" checked={form.is_published} onChange={e => updateField('is_published', e.target.checked)} /> Published</label>
              </div>

              <div className="admin-actions">
                <button className="admin-submit" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update App/Game' : 'Add App/Game'}
                </button>
                {editingId ? (
                  <button className="admin-secondary" type="button" onClick={handleCancelEdit}>
                    Cancel Edit
                  </button>
                ) : null}
              </div>
            </form>

            <section className="admin-panel">
              <h2>Latest Items</h2>
              <div className="admin-table">
                {apps.map(item => (
                  <div className="admin-row" key={item.id}>
                    <strong>{item.name}</strong>
                    <span>{item.type}</span>
                    <span>{item.is_published ? 'Published' : 'Draft'}</span>
                    <span>{item.is_featured ? 'Featured' : '-'}</span>
                    <div className="admin-row-actions">
                      <button type="button" onClick={() => handleEdit(item)}>Edit</button>
                      <button className="danger" type="button" onClick={() => handleDelete(item)}>Delete</button>
                    </div>
                  </div>
                ))}
                {!apps.length ? <p>No items found.</p> : null}
              </div>
            </section>
          </>
        ) : null}
      </section>
    </main>
  )
}
