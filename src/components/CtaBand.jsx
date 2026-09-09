import SignupForm from './SignupForm.jsx'

export default function CtaBand() {
  return (
    <section className="cta" id="get-started">
      <div className="container cta__inner">
        <h2 className="cta__title">Get your team on one board this afternoon</h2>
        <p className="cta__sub">
          Import from Jira, Trello, or a spreadsheet in a couple of minutes. Free for 14 days, and
          we don’t ask for a card.
        </p>

        <div className="cta__form">
          <SignupForm variant="stacked" source="cta-band" />
        </div>
      </div>
    </section>
  )
}
