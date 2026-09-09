-- Email capture for the TaskFlow marketing landing page.
create table if not exists public.signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null default 'landing',
  plan_interest text,
  created_at timestamptz not null default now()
);

-- Case-insensitive uniqueness so Foo@bar.com and foo@bar.com are one signup.
create unique index if not exists signups_email_lower_idx
  on public.signups (lower(email));

create index if not exists signups_created_at_idx
  on public.signups (created_at desc);

alter table public.signups enable row level security;

-- Deliberately NO policies. With RLS on and zero policies, the anon and
-- authenticated roles can neither read nor write. All access flows through the
-- `signup` Edge Function, which uses the service role key and bypasses RLS.
revoke all on public.signups from anon, authenticated;

comment on table public.signups is
  'Email capture from the TaskFlow landing page. Locked down by RLS with no policies; only the signup Edge Function (service role) may read or write.';
