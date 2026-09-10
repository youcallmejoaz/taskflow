# TaskFlow — marketing landing page

A responsive SaaS landing page with an email-capture form that writes to a real
backend. Built with React + Vite on the front end and Supabase (Postgres +
Edge Functions) on the back.

The form is not a mock. Submitting it hits a deployed HTTP endpoint, which
validates the address and inserts a row into Postgres.

## Stack

| Layer      | Choice                                        |
| ---------- | --------------------------------------------- |
| Front end  | React 19, Vite 6, hand-written CSS            |
| Backend    | Supabase Edge Function (Deno)                 |
| Database   | Supabase Postgres                             |
| Hosting    | GitHub Pages (built by GitHub Actions)        |

No CSS framework and no client-side Supabase SDK — the page posts to the
endpoint with `fetch`, which keeps the JS bundle at roughly 74 kB gzipped.

## Layout

```
src/
  App.jsx                  section order
  components/
    Nav.jsx                sticky header, collapses to logo + CTA on mobile
    Hero.jsx               headline, inline signup, social proof
    BoardMockup.jsx        pure-CSS product visual (no image assets)
    Features.jsx           six-card grid, 1 → 2 → 3 columns
    Pricing.jsx            three tiers, monthly/yearly toggle
    CtaBand.jsx            closing signup band
    Footer.jsx             four link columns
    SignupForm.jsx         the form; inline and stacked variants
  lib/signup.js            fetch wrapper for the endpoint
supabase/
  migrations/              signups table + RLS
  functions/signup/        the endpoint
```

## Running locally

```bash
npm install
npm run dev
```

`.env` is committed and already points at the live Supabase project, so the form
works straight after clone. Both values in it are publishable by design — see
[Security](#security).

```bash
npm run build     # → dist/
npm run preview   # serve the built output
```

## The signup endpoint

`POST https://ytmuhvnsazgwgjrrfzgj.supabase.co/functions/v1/signup`

```jsonc
// request
{
  "email": "you@company.com",   // required
  "plan_interest": "pro",       // optional: starter | pro | business | enterprise
  "source": "hero",             // optional, defaults to "landing"
  "company": ""                 // honeypot — must stay empty
}
```

| Status | Meaning                                                |
| ------ | ------------------------------------------------------ |
| 201    | Inserted                                               |
| 200    | Already subscribed (`duplicate: true`), or honeypot hit |
| 400    | Missing or malformed email                             |
| 405    | Not a POST                                             |
| 429    | Rate limited (5 requests per minute per IP)            |
| 500    | Insert failed                                          |

Try it:

```bash
curl -X POST https://ytmuhvnsazgwgjrrfzgj.supabase.co/functions/v1/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"you@company.com","source":"curl"}'
```

## Security

The `signups` table has row-level security **enabled with zero policies**, and
`anon`/`authenticated` are revoked from it. Neither role can read or write it
under any circumstances. The Edge Function is the only way in: it runs
server-side with the service role key, which never reaches the browser.

That is why the publishable key in `.env` is safe to commit and safe to ship in
the bundle — it identifies the project to Supabase's API gateway and grants no
data access on its own.

The endpoint also:

- validates the email shape and caps length at 254 characters (RFC 5321),
- lower-cases addresses and enforces uniqueness on `lower(email)`, so
  `Foo@bar.com` and `foo@bar.com` are one signup,
- rate-limits to 5 requests per minute per IP,
- screens bots with a hidden `company` field, answering 200 so a tripped bot
  gets no signal,
- allow-lists `plan_interest` rather than storing arbitrary strings.

## Responsive behaviour

Mobile-first, with breakpoints at 640, 900 and 1120 px.

- **< 640 px** — single column; signup input and button stack full width.
- **640–899 px** — form goes inline; features and footer move to 2 and 4 columns.
- **≥ 900 px** — nav links appear; hero splits into copy + board; three columns.
- **≥ 1120 px** — the board bleeds past the container for depth.

Type scales fluidly with `clamp()`, so there are no jumps between breakpoints.
`prefers-reduced-motion` is honoured.

## Deploying

Front end (from the repo root):

```bash
vercel --prod
```

Backend, if you fork this onto your own Supabase project:

```bash
supabase link --project-ref <your-ref>
supabase db push
supabase functions deploy signup --no-verify-jwt
```

Then point `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` at your own
project.

## Reading the signups

```sql
select email, source, plan_interest, created_at
from public.signups
order by created_at desc;
```

Run it from the Supabase SQL editor — the service role bypasses RLS, so the
dashboard can read the table even though no client can.

## Cloud-first workflow

Builds do not run on a laptop. GitHub Actions runs `npm ci`, the Vite build, and
the deploy, so a flaky local connection cannot block a release.

| Branch      | Pushed to freely | CI does            |
| ----------- | ---------------- | ------------------ |
| `cloud-wip` | yes              | build only         |
| `main`      | only on request  | build **+ deploy** |

Day-to-day work lands on `cloud-wip`, where every push is build-verified without
touching the live site. Publishing is a deliberate act:

```bash
git checkout main && git merge --ff-only cloud-wip && git push
```

That push is what deploys. Nothing reaches the live site by accident.

### Local folder stays current

`scripts/cloud-sync.sh` runs from a `SessionStart` hook in
`.claude/settings.json` and fast-forwards this folder from `origin/cloud-wip`
whenever the project is opened.

It cannot destroy local work. It fetches, then merges only when the tree is
clean, HEAD is `cloud-wip`, and the merge is a fast-forward. Anything else —
uncommitted edits, offline, diverged history, a different branch — prints a note
and changes nothing.

### Running locally (optional)

Not required; CI is the source of truth for builds.

```bash
npm install && npm run dev
```
