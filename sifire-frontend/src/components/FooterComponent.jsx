import { Link, useLocation } from 'react-router-dom';
import * as s from '../styles/Login.styles';


function Footer() {
  const { pathname } = useLocation()
  const year = new Date().getFullYear()

  return (
    <footer className="sifire-footer">
      <div className="sifire-footer__inner">

        <div className="sifire-footer__brand">
          <span className="sifire-footer__logo">🔥 SIFIRE</span>
          <span className="sifire-footer__tagline">
            Sistema Integrado de Gestión de Incendios
          </span>
        </div>

        <p className="sifire-footer__copy">
          © {year} SIFIRE · Chile. Todos los derechos reservados 🔥. 
        </p> 
        <p style={s.footer}>
                  <Link to="/terminos" style={s.link}>Términos y Condiciones</Link>
                </p>

      </div>
    </footer>
  )
}

export default Footer
