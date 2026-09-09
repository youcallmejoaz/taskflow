// A pure-CSS stand-in for the product UI. No screenshots to keep in sync, and
// it stays crisp at every viewport width.

const COLUMNS = [
  {
    name: 'In progress',
    tone: 'amber',
    cards: [
      { title: 'Billing webhook retries', tag: 'Backend', avatars: ['AR', 'KP'], done: 3, total: 5 },
      { title: 'Onboarding empty states', tag: 'Design', avatars: ['MJ'], done: 1, total: 4 },
    ],
  },
  {
    name: 'In review',
    tone: 'violet',
    cards: [{ title: 'Search relevance v2', tag: 'Backend', avatars: ['TS', 'AR'], done: 6, total: 6 }],
  },
  {
    name: 'Shipped',
    tone: 'green',
    cards: [
      { title: 'SSO for Enterprise', tag: 'Platform', avatars: ['KP'], done: 8, total: 8 },
      { title: 'Mobile board gestures', tag: 'Mobile', avatars: ['MJ', 'TS'], done: 5, total: 5 },
    ],
  },
]

export default function BoardMockup() {
  return (
    <div className="mock" role="img" aria-label="A TaskFlow board showing tasks moving from in progress to shipped">
      <div className="mock__chrome">
        <span className="mock__dot" />
        <span className="mock__dot" />
        <span className="mock__dot" />
        <span className="mock__url">taskflow.app / acme / sprint 24</span>
      </div>

      <div className="mock__body">
        {COLUMNS.map((col) => (
          <div className="mock__col" key={col.name}>
            <div className="mock__colhead">
              <span className={`mock__pip mock__pip--${col.tone}`} />
              {col.name}
              <span className="mock__count">{col.cards.length}</span>
            </div>

            {col.cards.map((card) => (
              <article className="mock__card" key={card.title}>
                <span className={`mock__tag mock__tag--${col.tone}`}>{card.tag}</span>
                <p className="mock__title">{card.title}</p>

                <div className="mock__meta">
                  <div className="mock__avatars">
                    {card.avatars.map((a) => (
                      <span className="mock__avatar" key={a}>
                        {a}
                      </span>
                    ))}
                  </div>
                  <span className="mock__progress">
                    {card.done}/{card.total}
                  </span>
                </div>

                <div className="mock__bar">
                  <span style={{ width: `${(card.done / card.total) * 100}%` }} />
                </div>
              </article>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
