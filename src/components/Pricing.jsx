import { useState } from 'react'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    monthly: 0,
    yearly: 0,
    blurb: 'For a first project or a team that is still forming.',
    cta: 'Start free',
    features: [
      'Up to 3 projects',
      '5 teammates',
      'Board, list, and calendar views',
      'GitHub and Slack integrations',
      'Community support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 12,
    yearly: 10,
    blurb: 'For teams shipping on a regular cadence.',
    cta: 'Start free trial',
    featured: true,
    features: [
      'Unlimited projects',
      'Up to 50 teammates',
      'Automatic weekly status roll-ups',
      'Estimates from your team’s history',
      'All integrations, unlimited automations',
      'Priority support, 1 business day',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    monthly: 24,
    yearly: 20,
    blurb: 'For companies with several teams and a compliance team.',
    cta: 'Talk to sales',
    features: [
      'Everything in Pro',
      'Unlimited teammates',
      'SSO, SCIM, and audit logs',
      'EU or US data residency',
      'Custom contracts and invoicing',
      'Dedicated success manager',
    ],
  },
]

function Check() {
  return (
    <svg className="tick" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="10" />
      <path
        d="M6 10.5l2.5 2.5L14 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Pricing() {
  const [yearly, setYearly] = useState(true)

  return (
    <section className="section pricing" id="pricing">
      <div className="container">
        <div className="section__head">
          <p className="eyebrow eyebrow--plain">Pricing</p>
          <h2 className="section__title">Simple pricing that scales with the team</h2>
          <p className="section__sub">
            Every plan includes the full product. Paid tiers add seats, history, and the controls
            larger teams need.
          </p>

          <div className="toggle" role="group" aria-label="Billing period">
            <button
              type="button"
              className={!yearly ? 'is-active' : undefined}
              onClick={() => setYearly(false)}
              aria-pressed={!yearly}
            >
              Monthly
            </button>
            <button
              type="button"
              className={yearly ? 'is-active' : undefined}
              onClick={() => setYearly(true)}
              aria-pressed={yearly}
            >
              Yearly <span className="toggle__save">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid--3 pricing__grid">
          {PLANS.map((plan) => {
            const price = yearly ? plan.yearly : plan.monthly
            return (
              <article
                className={`card plan${plan.featured ? ' plan--featured' : ''}`}
                key={plan.id}
              >
                {plan.featured && <span className="plan__badge">Most popular</span>}

                <h3 className="plan__name">{plan.name}</h3>
                <p className="plan__blurb">{plan.blurb}</p>

                <p className="plan__price">
                  <span className="plan__amount">${price}</span>
                  <span className="plan__unit">
                    {price === 0 ? 'forever' : `/user/month${yearly ? ', billed yearly' : ''}`}
                  </span>
                </p>

                <a
                  className={`btn ${plan.featured ? 'btn--primary' : 'btn--outline'} plan__cta`}
                  href="#get-started"
                >
                  {plan.cta}
                </a>

                <ul className="plan__features">
                  {plan.features.map((f) => (
                    <li key={f}>
                      <Check />
                      {f}
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>

        <p className="pricing__note">
          Prices in USD. Nonprofits and students get 50% off — just ask.
        </p>
      </div>
    </section>
  )
}
