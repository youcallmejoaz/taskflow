const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const SIGNUP_ENDPOINT = `${SUPABASE_URL}/functions/v1/signup`

/**
 * POST an email to the `signup` Edge Function.
 *
 * The function owns all validation and persistence; this just carries the
 * payload and normalises whatever comes back into { ok, message } so callers
 * never have to distinguish a 400 from a network failure.
 *
 * @param {{ email: string, plan_interest?: string|null, source?: string, company?: string }} payload
 *   `company` is the honeypot field — always send it, always empty for humans.
 * @returns {Promise<{ ok: boolean, message: string, duplicate?: boolean }>}
 */
export async function submitSignup({ email, plan_interest = null, source = 'landing', company = '' }) {
  try {
    const res = await fetch(SIGNUP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ email, plan_interest, source, company }),
    })

    // A non-JSON body means something upstream failed before our function ran.
    let body
    try {
      body = await res.json()
    } catch {
      return { ok: false, message: "We couldn't reach the server. Please try again." }
    }

    if (!res.ok || body.ok === false) {
      return { ok: false, message: body.error ?? 'Something went wrong. Please try again.' }
    }

    return { ok: true, message: body.message ?? "You're on the list.", duplicate: body.duplicate }
  } catch {
    // Network-level failure: offline, DNS, CORS, request blocked.
    return { ok: false, message: 'Network error — check your connection and try again.' }
  }
}
