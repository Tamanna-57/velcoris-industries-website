import { useId, useState } from 'react'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { ArrowRight, ArrowUpRight } from '../components/icons'
import { submitEnquiry, supabaseConfigured } from '../lib/supabase'

/* Contact page: replicated from velcorisindustries.com/contact (copy, fields, order). */

const EMAIL = 'contact@velcorisindustries.com'
const PHONE = '+91 73028 32224'

const REACH = [
  { icon: Mail, label: 'Email', value: EMAIL, href: `mailto:${EMAIL}` },
  { icon: Phone, label: 'Phone', value: PHONE, href: 'tel:+917302832224' },
  { icon: MapPin, label: 'Headquarters', value: 'Greater Noida, India', note: 'Manufacturing & R&D facility in Greater Noida, UP.' },
  { icon: Clock, label: 'Response time', value: 'Within 24 hours', note: 'Sales, technical datasheets, and partnership inquiries handled directly by our engineering directors.' },
]

// Buttons across the site link here with ?intent=…; the message is prefilled to match.
const INTENTS = {
  sample: 'I would like to request a graphene sample for evaluation.',
  supply: 'I would like to discuss a supply partnership.',
  application: 'I would like to discuss a formulation for our application.',
}

function Field({ label, optional, required, children, id }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required && <span className="text-[#b42318]" aria-hidden="true"> *</span>}
        {optional && <span className="font-normal text-muted"> (Optional)</span>}
      </label>
      <div className="relative mt-2">{children}</div>
    </div>
  )
}

const inputCls =
  'h-12 w-full rounded-xl border border-line bg-bg px-4 text-ink placeholder:text-muted/80 transition-colors focus:border-ink focus:outline-none'

export default function Contact() {
  const uid = useId()
  const intent = new URLSearchParams(window.location.search).get('intent')
  const [state, setState] = useState({ status: 'idle', msg: '' }) // idle | sending | sent | error

  const mailto = (f) => {
    const body = `${f.get('message')}\n\nName: ${f.get('name')}\nEmail: ${f.get('email')}${f.get('phone') ? `\nPhone: ${f.get('phone')}` : ''}`
    return `mailto:${EMAIL}?subject=${encodeURIComponent(`Website inquiry from ${f.get('name')}`)}&body=${encodeURIComponent(body)}`
  }

  // Enquiries are stored in Supabase (table `enquiries`, insert-only for the public). If the
  // database isn't configured, the inquiry opens in the visitor's email app instead.
  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const f = new FormData(form)
    if (f.get('website')) return // honeypot, as on the original
    if (!supabaseConfigured) {
      window.location.href = mailto(f)
      setState({ status: 'sent', msg: `Your email app should open with the inquiry ready to send. If it doesn't, write to ${EMAIL}.` })
      return
    }
    setState({ status: 'sending', msg: 'Sending your enquiry…' })
    try {
      await submitEnquiry({
        name: f.get('name'),
        email: f.get('email'),
        phone: f.get('phone'),
        message: f.get('message'),
        intent,
        sourcePage: sessionStorage.getItem('vc-from') || null,
      })
      form.reset()
      setState({ status: 'sent', msg: "Thank you. Your enquiry has been received and we'll be in touch within 24 hours." })
    } catch (err) {
      setState({ status: 'error', msg: err.message, href: mailto(f) })
    }
  }

  return (
    <>
      <section aria-labelledby="contact-title" className="hex-pattern-light bg-bg pb-10 pt-[calc(72px+5rem)] md:pb-14 md:pt-[calc(72px+6rem)]">
        <div className="container-x">
          <p className="eyebrow">Contact</p>
          <h1 id="contact-title" className="mt-5 text-[clamp(2.5rem,5vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink">
            Let&apos;s build what comes <span className="font-light">next.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            Whether you need a sample, a technical datasheet, or a long-term supply partnership, share a few details and
            we&apos;ll be in touch within 24 hours.
          </p>
        </div>
      </section>

      <section aria-label="Contact form and details" className="bg-surface py-14 md:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="rounded-3xl border border-line bg-bg p-6 sm:p-8 lg:col-span-7 md:p-10">
            <h2 className="text-[clamp(1.6rem,2.4vw,2.1rem)] font-semibold text-ink">Have a question?</h2>
            <p className="mt-3 text-muted">
              Whether you need technical datasheets or a long-term supply partnership, share a few details and we&apos;ll be in touch.
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate={false}>
              {/* honeypot: hidden from people, filled by bots */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor={`${uid}-w`}>Website</label>
                <input id={`${uid}-w`} name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              <Field label="Name" required id={`${uid}-n`}>
                <input id={`${uid}-n`} name="name" type="text" required autoComplete="name" placeholder="John Doe" className={inputCls} />
              </Field>
              <Field label="Email ID" required id={`${uid}-e`}>
                <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input id={`${uid}-e`} name="email" type="email" required autoComplete="email" placeholder="you@company.com" className={`${inputCls} pl-11`} />
              </Field>
              <Field label="Phone number" optional id={`${uid}-p`}>
                <Phone className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input id={`${uid}-p`} name="phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" className={`${inputCls} pl-11`} />
              </Field>
              <Field label="Message" required id={`${uid}-m`}>
                <textarea
                  id={`${uid}-m`}
                  name="message"
                  required
                  rows={5}
                  placeholder="How can we help?"
                  defaultValue={INTENTS[intent] ?? ''}
                  className={`${inputCls} h-auto resize-y py-3`}
                />
              </Field>
              <button type="submit" className="btn-primary disabled:opacity-60" disabled={state.status === 'sending'}>
                {state.status === 'sending' ? 'Sending…' : 'Send Inquiry'} <ArrowRight />
              </button>
              <p role="status" aria-live="polite" className={`text-sm ${state.status === 'error' ? 'text-[#b42318]' : state.status === 'sent' ? 'font-medium text-ink' : 'text-muted'}`}>
                {state.msg}
                {state.status === 'error' && state.href && (
                  <>
                    {' '}
                    <a href={state.href} className="font-semibold text-accent underline">Send by email instead</a>
                  </>
                )}
              </p>
            </form>
          </div>

          <aside aria-labelledby="reach-title" className="lg:col-span-5 lg:pt-4">
            <p id="reach-title" className="eyebrow">Reach us</p>
            <ul className="mt-6 space-y-7">
              {REACH.map(({ icon: Icon, label, value, href, note }) => (
                <li key={label} className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-bg text-ink">
                    <Icon className="size-[1.125rem]" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">{label}</p>
                    {href ? (
                      <a href={href} className="mt-1 inline-block text-lg font-semibold text-accent hover:underline">{value}</a>
                    ) : (
                      <p className="mt-1 text-lg font-semibold text-ink">{value}</p>
                    )}
                    {note && <p className="mt-1 max-w-sm text-sm text-muted">{note}</p>}
                  </div>
                </li>
              ))}
            </ul>
            <a
              href="https://www.linkedin.com/company/velcoris-industries/"
              target="_blank"
              rel="noreferrer"
              className="mt-9 inline-flex items-center gap-1.5 font-semibold text-accent"
            >
              View us on LinkedIn <ArrowUpRight />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </aside>
        </div>
      </section>
    </>
  )
}
