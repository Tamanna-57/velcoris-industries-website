-- Velcoris Industries: website enquiries (Task 2, query management)
-- Public visitors can only INSERT an enquiry. Only allowlisted admins (signed in with
-- Supabase Auth) can read or update them. Nobody can delete through the API.

-- Status of an enquiry as it is handled
create type public.enquiry_status as enum ('new', 'in_progress', 'resolved', 'spam');

create table public.enquiries (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 2 and 120),
  email       text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone       text check (phone is null or char_length(phone) <= 32),
  message     text not null check (char_length(message) between 5 and 5000),
  intent      text not null default 'general' check (intent in ('general', 'sample', 'supply', 'application')),
  source_page text check (source_page is null or char_length(source_page) <= 200),
  status      public.enquiry_status not null default 'new',
  notes       text check (notes is null or char_length(notes) <= 5000)
);

comment on table public.enquiries is 'Enquiries submitted through the website contact form.';

create index enquiries_created_at_idx on public.enquiries (created_at desc);
create index enquiries_status_idx on public.enquiries (status);
create index enquiries_email_created_idx on public.enquiries (email, created_at desc);

-- Admin allowlist: emails of staff who may read enquiries. Not exposed through the API.
create table public.admins (
  email      text primary key check (email = lower(email)),
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

-- Staff can read only their own allowlist row, so is_admin() can run with the caller's rights.
revoke all on public.admins from anon, authenticated;
grant select on public.admins to authenticated;
create policy "Staff can see their own admin entry" on public.admins
  for select to authenticated
  using (email = lower(coalesce((select auth.jwt()) ->> 'email', '')));

create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1 from public.admins a where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Normalise input, keep updated_at fresh, and rate-limit per email (5 per hour)
create or replace function public.enquiries_before_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    new.email := lower(trim(new.email));
    new.name := trim(new.name);
    new.status := 'new';
    new.notes := null;
    if (select count(*) from public.enquiries e
        where e.email = new.email and e.created_at > now() - interval '1 hour') >= 5 then
      raise exception 'Too many enquiries from this email. Please try again later.' using errcode = 'P0001';
    end if;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

revoke execute on function public.enquiries_before_write() from public, anon, authenticated;

create trigger enquiries_before_write
before insert or update on public.enquiries
for each row execute function public.enquiries_before_write();

-- Row level security
alter table public.enquiries enable row level security;

create policy "Anyone can submit an enquiry"
  on public.enquiries for insert
  to anon, authenticated
  with check (true);

create policy "Admins can read enquiries"
  on public.enquiries for select
  to authenticated
  using ((select public.is_admin()));

create policy "Admins can update enquiries"
  on public.enquiries for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- Column-level privileges: the public may only set the form fields
revoke all on public.enquiries from anon, authenticated;
grant insert (name, email, phone, message, intent, source_page) on public.enquiries to anon, authenticated;
grant select on public.enquiries to authenticated;
grant update (status, notes) on public.enquiries to authenticated;

-- Add staff who may view enquiries (they also need a Supabase Auth user with the same email):
-- insert into public.admins (email) values ('name@velcorisindustries.com');
