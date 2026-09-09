import Logo from './Logo.jsx'

const COLUMNS = [
  {
    heading: 'Product',
    links: ['Features', 'Pricing', 'Integrations', 'Changelog', 'Roadmap'],
  },
  {
    heading: 'Resources',
    links: ['Documentation', 'API reference', 'Guides', 'Community', 'Status'],
  },
  {
    heading: 'Company',
    links: ['About', 'Careers', 'Blog', 'Customers', 'Contact'],
  },
  {
    heading: 'Legal',
    links: ['Privacy', 'Terms', 'Security', 'DPA', 'Sub-processors'],
  },
]

export default function Footer() {
  return (
    <footer className="footer" id="faq">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <a className="nav__brand" href="#top" aria-label="TaskFlow home">
              <Logo />
              <span>TaskFlow</span>
            </a>
            <p className="footer__tagline">
              One shared board for small teams that would rather be shipping.
            </p>
            <p className="footer__badge">
              <span aria-hidden="true">🔒</span> SOC 2 Type II · GDPR ready
            </p>
          </div>

          <nav className="footer__links" aria-label="Footer">
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <h3>{col.heading}</h3>
                <ul>
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#top">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} TaskFlow, Inc. All rights reserved.</p>
          <p className="footer__demo">
            A demo landing page — the signup form writes to a real Supabase backend.
          </p>
        </div>
      </div>
    </footer>
  )
}
