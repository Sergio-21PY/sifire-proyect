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
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="#">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Features</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Pricing</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link disabled" aria-disabled="true">Disabled</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default NavbarComponent