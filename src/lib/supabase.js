// Supabase client, loaded on demand (only when a visitor submits the contact form or an admin
// opens /admin), so the library never weighs on normal page loads.
//
// Config comes from Vite env vars (Vercel → Project → Settings → Environment Variables):
//   VITE_SUPABASE_URL              https://<project-ref>.supabase.co
//   VITE_SUPABASE_PUBLISHABLE_KEY  sb_publishable_…  (safe in the browser; access is enforced by RLS)
// Without them the contact form falls back to opening the visitor's email app.

const SB_URL = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabaseConfigured = Boolean(SB_URL && KEY)

let clientPromise = null
export function getSupabase() {
  if (!supabaseConfigured) return Promise.resolve(null)
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(SB_URL, KEY, { auth: { persistSession: true, storageKey: 'velcoris-admin' } }),
    )
  }
  return clientPromise
}

/** Store one enquiry. Throws an Error with a readable message on failure. */
export async function submitEnquiry({ name, email, phone, message, intent, sourcePage }) {
  const sb = await getSupabase()
  if (!sb) throw new Error('not-configured')
  const { error } = await sb.from('enquiries').insert({
    name: name.trim(),
    email: email.trim(),
    phone: phone?.trim() || null,
    message: message.trim(),
    intent: ['sample', 'supply', 'application'].includes(intent) ? intent : 'general',
    source_page: sourcePage?.slice(0, 200) || null,
  })
  if (error) {
    if (error.code === 'P0001') throw new Error(error.message) // rate limit
    if (error.code === '23514') throw new Error('Please check the details you entered and try again.')
    throw new Error('We could not send your enquiry just now. Please try again, or email us directly.')
  }
}
