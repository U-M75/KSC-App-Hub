import { neon } from '@neondatabase/serverless'

function clean(value) { return String(value ?? '').trim() }
function db() {
  const url = clean(process.env.DATABASE_URL)
  if (!url) throw new Error('DATABASE_URL is not configured.')
  return neon(url)
}
function validUrl(value) {
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) } catch { return false }
}

export default async function handler(req, res) {
  try {
    const sql = db()
    if (req.method === 'GET') {
      const rows = await sql`select id, title, summary, app_url, icon, sort_order, created_at, updated_at from ksc_app_launcher_apps where active = true order by sort_order asc, title asc`
      return res.status(200).json({ apps: rows })
    }

    const body = req.body || {}
    if (req.method === 'POST') {
      const title = clean(body.title)
      const summary = clean(body.summary)
      const appUrl = clean(body.app_url)
      const icon = clean(body.icon) || '✨'
      if (!title || !summary || !appUrl) return res.status(400).json({ error: 'Title, summary and app link are required.' })
      if (!validUrl(appUrl)) return res.status(400).json({ error: 'App link must be a valid http or https URL.' })
      const rows = await sql`
        insert into ksc_app_launcher_apps (title, summary, app_url, icon, sort_order)
        values (${title}, ${summary}, ${appUrl}, ${icon}, ${Number(body.sort_order || 0)})
        returning *
      `
      return res.status(201).json({ success: true, app: rows[0] })
    }

    if (req.method === 'PATCH') {
      const id = clean(body.id)
      if (!id) return res.status(400).json({ error: 'App id is required.' })
      const title = clean(body.title)
      const summary = clean(body.summary)
      const appUrl = clean(body.app_url)
      const icon = clean(body.icon) || '✨'
      if (!title || !summary || !appUrl) return res.status(400).json({ error: 'Title, summary and app link are required.' })
      if (!validUrl(appUrl)) return res.status(400).json({ error: 'App link must be a valid http or https URL.' })
      const rows = await sql`
        update ksc_app_launcher_apps
        set title = ${title}, summary = ${summary}, app_url = ${appUrl}, icon = ${icon}, sort_order = ${Number(body.sort_order || 0)}, updated_at = now()
        where id = ${id}::uuid
        returning *
      `
      if (!rows.length) return res.status(404).json({ error: 'App not found.' })
      return res.status(200).json({ success: true, app: rows[0] })
    }

    if (req.method === 'DELETE') {
      const id = clean(body.id)
      if (!id) return res.status(400).json({ error: 'App id is required.' })
      const rows = await sql`update ksc_app_launcher_apps set active = false, updated_at = now() where id = ${id}::uuid returning id`
      if (!rows.length) return res.status(404).json({ error: 'App not found.' })
      return res.status(200).json({ success: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Neon App Hub API error:', error)
    return res.status(500).json({ error: error.message || 'App launcher request failed.' })
  }
}
