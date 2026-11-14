import { useCallback, useEffect, useMemo, useState } from 'react'
import { Download, LogOut, RefreshCw, Search } from 'lucide-react'
import { getSupabase, supabaseConfigured } from '../lib/supabase'

/* Enquiries viewer (Task 2, query management).
   Staff sign in with Supabase Auth (email + password). Row level security only returns rows to
   emails on the `admins` allowlist, so the page itself holds no secrets. Not linked from the site
   and marked noindex. */

const STATUSES = [
  { id: 'new', label: 'New' },
  { id: 'in_progress', label: 'In progress' },
  { id: 'resolved', label: 'Resolved' },
  { id: 'spam', label: 'Spam' },
]
const INTENT_LABEL = { general: 'General', sample: 'Sample', supply: 'Supply', application: 'Application' }
const fmt = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' })

function toCsv(rows) {
  const cols = ['created_at', 'name', 'email', 'phone', 'intent', 'status', 'source_page', 'message', 'notes']
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n')
}

function SignIn({ onSignedIn }) {
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setBusy(true)
    setErr('')
    const sb = await getSupabase()
    const { error } = await sb.auth.signInWithPassword({ email: f.get('email'), password: f.get('password') })
    setBusy(false)
    if (error) setErr('Sign-in failed. Check the email and password.')
    else onSignedIn()
  }
  return (
    <form onSubmit={submit} className="mx-auto mt-10 max-w-sm space-y-4 rounded-3xl border border-line bg-bg p-8">
      <h2 className="text-xl font-semibold text-ink">Staff sign-in</h2>
      <div>
        <label htmlFor="adm-email" className="text-sm font-medium text-ink">Email</label>
        <input id="adm-email" name="email" type="email" required autoComplete="username" className="mt-2 h-11 w-full rounded-xl border border-line bg-bg px-4 text-ink focus:border-ink focus:outline-none" />
      </div>
      <div>
        <label htmlFor="adm-pass" className="text-sm font-medium text-ink">Password</label>
        <input id="adm-pass" name="password" type="password" required autoComplete="current-password" className="mt-2 h-11 w-full rounded-xl border border-line bg-bg px-4 text-ink focus:border-ink focus:outline-none" />
      </div>
      <button type="submit" disabled={busy} className="btn-primary w-full justify-center disabled:opacity-60">
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
      <p role="alert" className="min-h-5 text-sm text-[#b42318]">{err}</p>
    </form>
  )
}

function Row({ r, onStatus, onNotes }) {
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState(r.notes ?? '')
  return (
    <>
      <tr className="border-t border-line align-top">
        <td className="whitespace-nowrap py-4 pr-4 text-sm text-muted">{fmt.format(new Date(r.created_at))}</td>
        <td className="py-4 pr-4">
          <p className="font-semibold text-ink">{r.name}</p>
          <a href={`mailto:${r.email}`} className="text-sm text-accent hover:underline">{r.email}</a>
          {r.phone && <p className="text-sm text-muted">{r.phone}</p>}
        </td>
        <td className="py-4 pr-4 text-sm text-ink">{INTENT_LABEL[r.intent] ?? r.intent}</td>
        <td className="max-w-md py-4 pr-4 text-sm text-ink">
          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="text-left">
            <span className={open ? 'whitespace-pre-wrap' : 'line-clamp-2'}>{r.message}</span>
            <span className="mt-1 block font-mono text-xs uppercase tracking-[0.08em] text-muted">{open ? 'Hide' : 'Details'}</span>
          </button>
        </td>
        <td className="py-4">
          <label className="sr-only" htmlFor={`st-${r.id}`}>Status for {r.name}</label>
          <select
            id={`st-${r.id}`}
            value={r.status}
            onChange={(e) => onStatus(r.id, e.target.value)}
            className="h-9 rounded-lg border border-line bg-bg px-2 text-sm text-ink"
          >
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </td>
      </tr>
      {open && (
        <tr>
          <td />
          <td colSpan={4} className="pb-5">
            <p className="text-xs text-muted">From page: {r.source_page || 'unknown'} · ID {r.id.slice(0, 8)}</p>
            <label htmlFor={`nt-${r.id}`} className="mt-3 block text-sm font-medium text-ink">Internal notes</label>
            <textarea id={`nt-${r.id}`} value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="mt-1 w-full max-w-2xl rounded-xl border border-line bg-bg p-3 text-sm text-ink" />
            <button type="button" onClick={() => onNotes(r.id, notes)} className="mt-2 text-sm font-semibold text-accent">Save notes</button>
          </td>
        </tr>
      )}
    </>
  )
}

export default function Admin() {
  const [session, setSession] = useState(null)
  const [ready, setReady] = useState(false)
  const [rows, setRows] = useState([])
  const [isAdmin, setIsAdmin] = useState(true)
  const [filter, setFilter] = useState('all')
  const [q, setQ] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  const load = useCallback(async () => {
    const sb = await getSupabase()
    const [{ data, error }, admin] = await Promise.all([
      sb.from('enquiries').select('*').order('created_at', { ascending: false }).limit(1000),
      sb.rpc('is_admin'),
    ])
    setIsAdmin(Boolean(admin.data))
    if (error) setMsg('Could not load enquiries.')
    else {
      setRows(data)
      setMsg(`Updated ${new Date().toLocaleTimeString('en-IN')}`)
    }
  }, [])

  useEffect(() => {
    if (!supabaseConfigured) {
      setReady(true)
      return
    }
    let sub
    getSupabase().then(async (sb) => {
      const { data } = await sb.auth.getSession()
      setSession(data.session)
      setReady(true)
      sub = sb.auth.onAuthStateChange((_e, s) => setSession(s)).data.subscription
    })
    return () => sub?.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) load()
  }, [session, load])

  const update = async (id, patch) => {
    const sb = await getSupabase()
    const { error } = await sb.from('enquiries').update(patch).eq('id', id)
    if (error) setMsg('Update failed.')
    else setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  const counts = useMemo(() => Object.fromEntries(STATUSES.map((s) => [s.id, rows.filter((r) => r.status === s.id).length])), [rows])
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase()
    return rows.filter(
      (r) =>
        (filter === 'all' || r.status === filter) &&
        (!t || [r.name, r.email, r.phone, r.message].some((v) => v?.toLowerCase().includes(t))),
    )
  }, [rows, filter, q])

  const exportCsv = () => {
    const blob = new Blob([toCsv(shown)], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `velcoris-enquiries-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const signOut = async () => {
    const sb = await getSupabase()
    await sb.auth.signOut()
    setRows([])
  }

  return (
    <section aria-labelledby="admin-title" className="min-h-[70vh] bg-surface pb-16 pt-[calc(72px+3rem)]">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Admin</p>
            <h1 id="admin-title" className="mt-3 text-[clamp(1.9rem,3vw,2.6rem)] font-semibold text-ink">Website enquiries</h1>
          </div>
          {session && (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-muted sm:inline">{session.user.email}</span>
              <button type="button" onClick={signOut} className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-bg px-4 text-sm font-medium text-ink">
                <LogOut className="size-4" aria-hidden="true" /> Sign out
              </button>
            </div>
          )}
        </div>

        {!ready ? null : !supabaseConfigured ? (
          <p className="mt-8 max-w-xl text-muted">The enquiries database isn&apos;t connected in this build. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.</p>
        ) : !session ? (
          <SignIn onSignedIn={() => {}} />
        ) : !isAdmin ? (
          <p className="mt-8 max-w-xl text-muted">You&apos;re signed in, but this account isn&apos;t on the admin list, so no enquiries are shown.</p>
        ) : (
          <>
            <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
              {[{ id: 'all', label: 'All', n: rows.length }, ...STATUSES.map((s) => ({ ...s, n: counts[s.id] }))].map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setFilter(s.id)}
                    aria-pressed={filter === s.id}
                    className={`w-full rounded-2xl border p-4 text-left transition-colors ${filter === s.id ? 'border-ink bg-bg' : 'border-line bg-bg/60 hover:border-ink/40'}`}
                  >
                    <span className="block font-[family-name:var(--font-num)] text-2xl font-semibold text-ink tabular-nums">{s.n}</span>
                    <span className="text-sm text-muted">{s.label}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <label className="relative flex-1 min-w-56">
                <span className="sr-only">Search enquiries</span>
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, phone or message" className="h-11 w-full rounded-xl border border-line bg-bg pl-10 pr-4 text-sm text-ink focus:border-ink focus:outline-none" />
              </label>
              <button type="button" onClick={load} className="inline-flex h-11 items-center gap-2 rounded-xl border border-line bg-bg px-4 text-sm font-medium text-ink">
                <RefreshCw className="size-4" aria-hidden="true" /> Refresh
              </button>
              <button type="button" onClick={exportCsv} className="inline-flex h-11 items-center gap-2 rounded-xl border border-line bg-bg px-4 text-sm font-medium text-ink">
                <Download className="size-4" aria-hidden="true" /> Export CSV
              </button>
              <span role="status" className="text-xs text-muted">{msg}</span>
            </div>

            <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-bg px-5">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
                    <th scope="col" className="py-3 pr-4 font-normal">Received</th>
                    <th scope="col" className="py-3 pr-4 font-normal">From</th>
                    <th scope="col" className="py-3 pr-4 font-normal">Intent</th>
                    <th scope="col" className="py-3 pr-4 font-normal">Message</th>
                    <th scope="col" className="py-3 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((r) => (
                    <Row key={r.id} r={r} onStatus={(id, status) => update(id, { status })} onNotes={(id, notes) => update(id, { notes })} />
                  ))}
                </tbody>
              </table>
              {shown.length === 0 && <p className="py-10 text-center text-sm text-muted">No enquiries match.</p>}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
