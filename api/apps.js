import { neon } from '@neondatabase/serverless'
import { verifyAdminToken } from './_lib/admin-auth.js'

function clean(value) { return String(value ?? '').trim() }
function db() {
  const url = clean(process.env.DATABASE_URL)
  if (!url) throw new Error('DATABASE_URL is not configured.')
  return neon(url)
}
const CATEGORIES = ['Slack', 'Operations', 'Finance & Payroll', 'Inventory & Warehouse', 'Purchasing', 'Sales & Quotation', 'Internal Tools', 'Other']
function validUrl(value) {
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) } catch { return false }
}

export default async function handler(req, res) {
  try {
    const sql = db()
    if (req.method === 'GET') {
      const category = clean(req.query?.category)
      const adminRequest = req.query?.admin === '1'
      if (adminRequest && !verifyAdminToken(req)) return res.status(401).json({ error: 'Admin authentication is required.' })
      let rows
      if (adminRequest) {
        rows = category && CATEGORIES.includes(category)
          ? await sql`select id, title, summary, app_url, icon, category, sort_order, created_at, updated_at from ksc_app_launcher_apps where active = true and category = ${category} order by sort_order asc, title asc`
          : await sql`select id, title, summary, app_url, icon, category, sort_order, created_at, updated_at from ksc_app_launcher_apps where active = true order by sort_order asc, title asc`
      } else {
        rows = category && CATEGORIES.includes(category)
          ? await sql`select id, title, summary, icon, category, sort_order, created_at, updated_at from ksc_app_launcher_apps where active = true and category = ${category} order by sort_order asc, title asc`
          : await sql`select id, title, summary, icon, category, sort_order, created_at, updated_at from ksc_app_launcher_apps where active = true order by sort_order asc, title asc`
      }
      return res.status(200).json({ apps: rows })
    }

    const body = req.body || {}
    if (!verifyAdminToken(req)) return res.status(401).json({ error: 'Admin authentication is required.' })
    if (req.method === 'POST') {
      const title = clean(body.title)
      const summary = clean(body.summary)
      const appUrl = clean(body.app_url)
      const icon = clean(body.icon) || '✨'
      const category = CATEGORIES.includes(clean(body.category)) ? clean(body.category) : 'Other'
      if (!title || !appUrl) return res.status(400).json({ error: 'Title and app link are required.' })
      if (!validUrl(appUrl)) return res.status(400).json({ error: 'App link must be a valid http or https URL.' })
      const rows = await sql`
        insert into ksc_app_launcher_apps (title, summary, app_url, icon, category, sort_order)
        values (${title}, ${summary}, ${appUrl}, ${workflowWebhookUrl}, ${icon}, ${category}, ${Number(body.sort_order || 0)})
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
      const category = CATEGORIES.includes(clean(body.category)) ? clean(body.category) : 'Other'
      if (!title || !appUrl) return res.status(400).json({ error: 'Title and app link are required.' })
      if (!validUrl(appUrl)) return res.status(400).json({ error: 'App link must be a valid http or https URL.' })
      const rows = await sql`
        update ksc_app_launcher_apps
        set title = ${title}, summary = ${summary}, app_url = ${appUrl} = ${workflowWebhookUrl}, icon = ${icon}, category = ${category}, sort_order = ${Number(body.sort_order || 0)}, updated_at = now()
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
