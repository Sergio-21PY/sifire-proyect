import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RUTA_POR_ROL = {
  CIUDADANO:   '/reportes',
  BRIGADISTA:  '/mis-asignaciones',
  FUNCIONARIO: '/dashboard',
  // Añade un rol por defecto por si el usuario no tiene un rol esperado
  DEFAULT: '/dashboard' 
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const registradoOk = location.state?.registrado;

  const validate = () => {
    const e = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Ingresa un correo válido.';
    if (!form.password) e.password = 'La contraseña es requerida.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (loginError) setLoginError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setLoginError('');

    try {
      const usuarioLogueado = await login(form.email, form.password);
      
      // Determinar la ruta de redirección
      const ruta = RUTA_POR_ROL[usuarioLogueado.rol] || RUTA_POR_ROL.DEFAULT;
      navigate(ruta);

    } catch (error) {
      // El error lanzado desde el contexto es atrapado aquí
      setLoginError(error.message || 'Error al iniciar sesión. Revisa tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sifire-login-page min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-4">

            <div className="text-center mb-4">
              <div className="fs-1 mb-2">🔥</div>
              <h1 className="fs-4 fw-bold text-dark mb-1">SIFIRE</h1>
              <p className="text-muted small">
                Sistema de Gestión de Emergencias — Municipalidad Valle del Sol
              </p>
            </div>

            {registradoOk && (
              <div className="alert alert-success py-2 small text-center" role="alert">
                Cuenta creada. Ya puedes iniciar sesión.
              </div>
            )}

            {loginError && (
              <div className="alert alert-danger py-2 small text-center" role="alert">
                {loginError}
              </div>
            )}

            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label small fw-semibold">
                      Correo electrónico
                    </label>
                    <input
                      id="email" name="email" type="email" autoComplete="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="correo@ejemplo.cl"
                      value={form.email}
                      onChange={handleChange}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label small fw-semibold">
                      Contraseña
                    </label>
                    <input
                      id="password" name="password" type="password" autoComplete="current-password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Tu contraseña"
                      value={form.password}
                      onChange={handleChange}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-100 py-2 fw-semibold"
                  >
                    {loading
                      ? <><span className="spinner-border spinner-border-sm me-2" />Ingresando…</>
                      : 'Ingresar'
                    }
                  </button>
                </form>
              </div>
            </div>

            <p className="text-center text-muted small mt-4">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="text-danger text-decoration-none fw-semibold">
                Regístrate
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
