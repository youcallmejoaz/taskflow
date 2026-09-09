import Logo from './Logo.jsx'

export default function Nav() {
  return (
    <header className="nav">
      <div className="container nav__inner">
        <a className="nav__brand" href="#top" aria-label="TaskFlow home">
          <Logo />
          <span>TaskFlow</span>
        </a>

        <nav className="nav__links" aria-label="Main">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">Docs</a>
        </nav>

        <a className="btn btn--ghost nav__cta" href="#get-started">
          Start free
        </a>
      </div>
    </header>
  )
}
