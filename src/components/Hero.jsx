import SignupForm from './SignupForm.jsx'
import BoardMockup from './BoardMockup.jsx'

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow">
            <span className="eyebrow__dot" aria-hidden="true" />
            Now with automatic status roll-ups
          </p>

          <h1 className="hero__title">
            Project management that stays <span className="grad-text">out of your way</span>
          </h1>

          <p className="hero__sub">
            TaskFlow gives small teams one shared board, status updates that write themselves, and
            planning that takes minutes instead of meetings.
          </p>

          <SignupForm variant="inline" source="hero" />

          <ul className="hero__proof">
            <li>
              <strong>4,200+</strong> teams shipping
            </li>
            <li>
              <strong>4.9/5</strong> average rating
            </li>
            <li>
              <strong>SOC 2</strong> Type II
            </li>
          </ul>
        </div>

        <div className="hero__visual">
          <BoardMockup />
        </div>
      </div>
    </section>
  )
}
