import { NavLink, useLocation } from 'react-router-dom'

const NO_NAVBAR = ['/', '/login', '/registro']

const MAIN_ROUTES = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/reportes', label: 'Reportes' },
    { to: '/monitoreo', label: 'Monitoreo' },
    { to: '/alertas', label: 'Alertas' },
]

function NavbarComponent() {
    const { pathname } = useLocation()
    if (NO_NAVBAR.includes(pathname)) return null

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom">
            <div className="container-fluid">
                <NavLink className="navbar-brand fw-semibold" to="/dashboard">
                    SIFIRE
                </NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {MAIN_ROUTES.map((route) => (
                            <li className="nav-item" key={route.to}>
                                <NavLink
                                    className={({ isActive }) =>
                                        `nav-link${isActive ? ' active fw-semibold' : ''}`
                                    }
                                    to={route.to}
                                >
                                    {route.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default NavbarComponent