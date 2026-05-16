import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(_req, res) {
  if (!supabaseAdmin) {
    res.status(500).json({
      ok: false,
      supabaseReachable: false,
      message: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY',
    })
    return
  }

  const { error } = await supabaseAdmin.storage.listBuckets()

  res.status(200).json({
    ok: !error,
    supabaseReachable: !error,
    message: error?.message || 'Supabase client initialized',
  })
}
