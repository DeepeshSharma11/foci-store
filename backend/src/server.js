import 'dotenv/config'
import http from 'node:http'
import { supabaseAdmin } from './supabase.js'

const port = Number(process.env.PORT || 4000)
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000'

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': frontendOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  })
  res.end(JSON.stringify(data))
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 204, {})
  }

  if (req.url === '/health') {
    return sendJson(res, 200, { ok: true, service: 'focistore-backend' })
  }

  if (req.url === '/api/supabase/status') {
    const { error } = await supabaseAdmin.storage.listBuckets()
    return sendJson(res, 200, {
      ok: !error,
      supabaseReachable: !error,
      message: error?.message || 'Supabase client initialized',
    })
  }

  return sendJson(res, 404, { ok: false, error: 'Not found' })
})

server.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`)
})
