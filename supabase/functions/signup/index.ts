import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Public email-capture endpoint for the TaskFlow marketing site.
//
// JWT verification is intentionally off: anonymous visitors on a marketing page
// have no session to present. The endpoint defends itself instead through strict
// input validation, a honeypot field, a per-isolate rate limit, and the fact
// that it only ever writes one narrow row shape. The `signups` table has RLS on
// with zero policies, so this function's service-role client is the only path in.

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const JSON_HEADERS = { ...CORS, "Content-Type": "application/json" };

// Deliberately conservative: catches real typos without rejecting valid exotica.
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
const MAX_EMAIL_LEN = 254; // RFC 5321
const VALID_PLANS = new Set(["starter", "pro", "business", "enterprise"]);

// Best-effort throttle. Isolates are recycled and there may be several at once,
// so this blunts bursts rather than guaranteeing a global limit.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear(); // crude guard against unbounded growth
  return recent.length > RATE_LIMIT;
}

function reply(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") {
    return reply(405, { ok: false, error: "Method not allowed. Use POST." });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (rateLimited(ip)) {
    return reply(429, { ok: false, error: "Too many attempts. Try again in a minute." });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return reply(400, { ok: false, error: "Expected a JSON body." });
  }

  // Honeypot: a hidden field no human ever fills in. Answer 200 so bots that
  // trip it get no signal that they were caught.
  if (typeof payload.company === "string" && payload.company.trim() !== "") {
    return reply(200, { ok: true, message: "You're on the list." });
  }

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  if (!email) return reply(400, { ok: false, error: "Email is required." });
  if (email.length > MAX_EMAIL_LEN) {
    return reply(400, { ok: false, error: "That email address is too long." });
  }
  if (!EMAIL_RE.test(email)) {
    return reply(400, { ok: false, error: "That doesn't look like a valid email address." });
  }

  const rawPlan = typeof payload.plan_interest === "string" ? payload.plan_interest.toLowerCase() : "";
  const plan_interest = VALID_PLANS.has(rawPlan) ? rawPlan : null;

  const rawSource = typeof payload.source === "string" ? payload.source.trim() : "";
  const source = rawSource.slice(0, 64) || "landing";

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  const { error } = await supabase.from("signups").insert({ email, source, plan_interest });

  if (error) {
    // 23505 = unique violation. Re-submitting the same address is a no-op, not
    // an error the visitor should see.
    if (error.code === "23505") {
      return reply(200, { ok: true, message: "You're already on the list — we'll be in touch.", duplicate: true });
    }
    console.error("signup insert failed", { code: error.code, message: error.message });
    return reply(500, { ok: false, error: "Something went wrong on our end. Please try again." });
  }

  return reply(201, { ok: true, message: "You're on the list — check your inbox soon." });
});
