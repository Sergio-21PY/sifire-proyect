import { Link, useLocation } from 'react-router-dom'

const NO_FOOTER = ['/', '/login', '/registro']
function Footer() {
  const { pathname } = useLocation()
  if (NO_FOOTER.includes(pathname)) return null

  const year = new Date().getFullYear()

  return (
    <footer className="sifire-footer">
      <div className="sifire-footer__inner">

        <div className="sifire-footer__brand">
          <span className="sifire-footer__logo">🔥 SIFIRE</span>
          <span className="sifire-footer__tagline">
            Sistema Integrado de Gestión de Incendios Forestales
          </span>
        </div>

        <nav className="sifire-footer__links" aria-label="Links del footer">
          <Link to="/reportes">Reportes</Link>
          <Link to="/monitoreo">Monitoreo</Link>
          <Link to="/alertas">Alertas</Link>
        </nav>

        <p className="sifire-footer__copy">
          © {year} SIFIRE · Chile. Todos los derechos reservados.
        </p>

      </div>
    </footer>
  )
}

export default Footer
