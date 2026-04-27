import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NO_NAVBAR = ['/', '/login', '/registro'];

const RUTAS_POR_ROL = {
  FUNCIONARIO: [
    { to: '/dashboard',   label: 'Dashboard' },
    { to: '/reportes',    label: 'Reportes' },
    { to: '/monitoreo',   label: 'Mapa' },
    { to: '/alertas',     label: 'Alertas' },
    { to: '/brigadistas', label: 'Brigadistas' },
  ],
  BRIGADISTA: [
    { to: '/mis-asignaciones', label: 'Mis Asignaciones' },
    { to: '/reportes',         label: 'Reportes' },
    { to: '/monitoreo',        label: 'Mapa' },
  ],
  CIUDADANO: [
    { to: '/reportes',  label: 'Reportes' },
    { to: '/monitoreo', label: 'Mapa' },
  ],
};

function NavbarComponent() {
  const { pathname } = useLocation();
  const { usuario, logout, estaAutenticado } = useAuth();
  const navigate = useNavigate();

  if (NO_NAVBAR.includes(pathname)) return null;

  const rutas = RUTAS_POR_ROL[usuario?.rol] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom">
      <div className="container-fluid">
        <NavLink className="navbar-brand fw-semibold" to={rutas[0]?.to || '/login'}>
          🔥 SIFIRE
        </NavLink>

        <button
          className="navbar-toggler" type="button"
          data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {rutas.map((route) => (
              <li className="nav-item" key={route.to}>
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? ' active fw-semibold' : ''}`}
                  to={route.to}
                >
                  {route.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {estaAutenticado && (
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted small">
                {usuario?.username || usuario?.nombre} — <strong>{usuario?.rol}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-outline-danger btn-sm"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavbarComponent;
