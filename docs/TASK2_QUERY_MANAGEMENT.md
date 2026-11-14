# Task 2: Query management (enquiries database)

Full report (findings, improvements, tools, roadmap): Claude doc "Task 2: Backend & IT Infrastructure Analysis".

## What is built

- **Database:** Supabase project `velcoris-enquiries` (Postgres 17, region `ap-south-1` Mumbai).
- **Schema and rules:** `supabase/migrations/20261114120000_enquiries.sql`
  - `enquiries` table with validation (lengths, email format, intent values), email lower-cased,
    status forced to `new` on insert, max 5 enquiries per email per hour.
  - Row level security: the public (anon) may only INSERT the form columns; it cannot read,
    update, delete or set status/notes.
  - `admins` allowlist; signed-in staff whose email is listed can read enquiries and update
    status and notes. Supabase security advisor: no issues.
- **Contact form** (`src/pages/Contact.jsx`, `src/lib/supabase.js`): submits to Supabase; shows
  sending / sent / error states; falls back to the visitor's email app if the database is not
  configured. The Supabase library loads only on submit.
- **Admin viewer** (`/admin`, `src/pages/Admin.jsx`): staff sign-in (Supabase Auth), counts by
  status, search, status dropdown, internal notes, CSV export. Not linked from the site; noindex.
- **Config:** `.env.production` holds the project URL and publishable key (public by design;
  access is enforced by RLS). `.env.example` documents the variables.

## Verified (14 Nov 2026)

| Check | Result |
| --- | --- |
| Anonymous insert | allowed |
| Anonymous read / update / delete / set status | denied |
| Signed-in non-admin sees rows | 0 |
| Admin sees rows | yes |
| Live preview form submission stored | yes ("Demo Tester") |

## To finish

1. Supabase dashboard → velcoris-enquiries → Authentication → Users → **Add user** with the
   allowlisted email (`tamannaarora9313@gmail.com`), your own password, **Auto Confirm** ticked.
2. Sign in at `/admin` on the deployed site.
3. More staff: add their email with
   `insert into public.admins (email) values ('name@velcorisindustries.com');` and create their user.
