const FEATURES = [
  {
    title: 'Boards that update themselves',
    body: 'Connect GitHub, Linear, or Figma and cards move on their own as branches merge and files ship. Nobody drags a sticky note again.',
    icon: (
      <>
        <rect x="3" y="4" width="6" height="16" rx="2" />
        <rect x="11" y="4" width="6" height="10" rx="2" />
        <path d="M14 18h7M18 15l3 3-3 3" />
      </>
    ),
  },
  {
    title: 'Status roll-ups, not status meetings',
    body: 'Every Friday TaskFlow writes the update for you — what shipped, what slipped, and what is blocked — and posts it to Slack.',
    icon: (
      <>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20h-2" />
        <path d="M2 20h18" />
      </>
    ),
  },
  {
    title: 'Planning in minutes',
    body: 'Drop in a scope, get an estimate from your team’s real history, and see the delivery date move as you add or cut work.',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </>
    ),
  },
  {
    title: 'Built for how small teams work',
    body: 'No workflow builder, no six-level hierarchy, no admin certification. Open it and it already matches the way you ship.',
    icon: (
      <>
        <path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 20v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
  {
    title: 'Search that finds the decision',
    body: 'Ask “why did we drop OAuth?” and get the thread, the card, and the commit — not forty results you have to read.',
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </>
    ),
  },
  {
    title: 'Secure by default',
    body: 'SOC 2 Type II, SSO and SCIM on every paid plan, and per-project data residency in the EU or US. Audit logs included.',
    icon: (
      <>
        <path d="M12 3l8 3.5v5c0 4.7-3.2 8.6-8 9.5-4.8-.9-8-4.8-8-9.5v-5z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
]

export default function Features() {
  return (
    <section className="section features" id="features">
      <div className="container">
        <div className="section__head">
          <p className="eyebrow eyebrow--plain">Features</p>
          <h2 className="section__title">Everything you need. Nothing you don’t.</h2>
          <p className="section__sub">
            Most tools grow until they need an administrator. TaskFlow deliberately stopped at the
            handful of things that actually move work forward.
          </p>
        </div>

        <div className="grid grid--3">
          {FEATURES.map((f) => (
            <article className="card feature" key={f.title}>
              <span className="feature__icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {f.icon}
                </svg>
              </span>
              <h3 className="feature__title">{f.title}</h3>
              <p className="feature__body">{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
