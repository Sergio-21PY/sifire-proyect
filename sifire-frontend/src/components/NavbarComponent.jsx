import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { listarReportes } from '../services/reporte.service';

const NO_NAVBAR = ['/', '/login', '/registro'];

const RUTAS_POR_ROL = {
  ADMINISTRADOR: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/reportes', label: 'Reportes' },
    { to: '/monitoreo', label: 'Mapa' },
    { to: '/alertas', label: 'Alertas' },
    { to: '/brigadistas', label: 'Brigadistas' },
    { to: '/usuarios', label: 'Usuarios' },  // ← para crear cuentas de brigadista
  ],
  FUNCIONARIO: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/reportes', label: 'Reportes' },
    { to: '/monitoreo', label: 'Mapa' },
    { to: '/alertas', label: 'Alertas' },
    { to: '/brigadistas', label: 'Brigadistas' },
  ],
  BRIGADISTA: [
    { to: '/mis-asignaciones', label: 'Mis Asignaciones' },
    { to: '/reportes', label: 'Reportes' },
    { to: '/monitoreo', label: 'Mapa' },
  ],
  CIUDADANO: [
    { to: '/reportes', label: 'Reportes' },
    { to: '/monitoreo', label: 'Mapa' },
    { to: '/alertas',   label: 'Alertas' },
  ],
};

function NavbarComponent() {
  const { pathname } = useLocation();
  const { usuario, logout, estaAutenticado } = useAuth();
  const navigate = useNavigate();

  const [pendientes, setPendientes] = useState(0);

  useEffect(() => {
    if (usuario?.tipo !== 'FUNCIONARIO' && usuario?.tipo !== 'ADMINISTRADOR') return;
    const cargar = async () => {
      try {
        const data = await listarReportes();
        setPendientes(data.filter(r => r.estado === 'PENDIENTE').length);
      } catch { }
    };
    cargar();
    const intervalo = setInterval(cargar, 10000);
    return () => clearInterval(intervalo);
  }, [usuario]);

  if (NO_NAVBAR.includes(pathname)) return null;

  const rutas = RUTAS_POR_ROL[usuario?.tipo] || [];

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
                {usuario?.username || usuario?.nombre} — <strong>{usuario?.tipo}</strong>
              </span>

              {/* Buzón solo para FUNCIONARIO y ADMINISTRADOR */}
              {(usuario?.tipo === 'FUNCIONARIO' || usuario?.tipo === 'ADMINISTRADOR') && (
                <NavLink to="/dashboard" style={{ position: 'relative', textDecoration: 'none', fontSize: '1.2rem' }}>
                  🔔
                  {pendientes > 0 && (
                    <span style={{
                      position: 'absolute', top: -6, right: -8,
                      background: '#dc2626', color: '#fff',
                      borderRadius: '50%', fontSize: '0.65rem',
                      fontWeight: 700, minWidth: 16, height: 16,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '0 3px',
                    }}>
                      {pendientes > 9 ? '9+' : pendientes}
                    </span>
                  )}
                </NavLink>
              )}

              <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
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