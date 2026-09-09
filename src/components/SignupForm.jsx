import { useId, useRef, useState } from 'react'
import { submitSignup } from '../lib/signup.js'

/**
 * Email capture wired to the live Supabase Edge Function.
 *
 * `variant` only changes layout: 'inline' sits in the hero on one row,
 * 'stacked' is used in the closing CTA band where the column is narrower.
 */
export default function SignupForm({ variant = 'inline', source = 'landing', planInterest = null }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [message, setMessage] = useState('')
  const honeypot = useRef(null)
  const inputId = useId()

  const submitting = status === 'submitting'

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting) return

    setStatus('submitting')
    setMessage('')

    const result = await submitSignup({
      email,
      plan_interest: planInterest,
      source,
      company: honeypot.current?.value ?? '',
    })

    setStatus(result.ok ? 'success' : 'error')
    setMessage(result.message)
    if (result.ok) setEmail('')
  }

  return (
    <form className={`signup signup--${variant}`} onSubmit={handleSubmit} noValidate>
      <div className="signup__row">
        <label className="sr-only" htmlFor={inputId}>
          Work email address
        </label>
        <input
          id={inputId}
          className="signup__input"
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status !== 'idle') setStatus('idle')
          }}
          placeholder="you@company.com"
          autoComplete="email"
          required
          disabled={submitting}
          aria-invalid={status === 'error'}
          aria-describedby={message ? `${inputId}-status` : undefined}
        />

        {/* Honeypot: hidden from people, irresistible to bots. */}
        <input
          ref={honeypot}
          className="signup__honeypot"
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <button className="btn btn--primary signup__button" type="submit" disabled={submitting}>
          {submitting ? 'Joining…' : 'Start free'}
        </button>
      </div>

      <p
        id={`${inputId}-status`}
        className={`signup__status signup__status--${status}`}
        role="status"
        aria-live="polite"
      >
        {message || (variant === 'inline' ? 'Free 14-day trial. No credit card required.' : ' ')}
      </p>
    </form>
  )
}
