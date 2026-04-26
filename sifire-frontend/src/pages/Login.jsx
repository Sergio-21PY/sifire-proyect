import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as s from '../styles/Login.styles';

const RUTA_POR_ROL = {
  CIUDADANO:   '/reportes',
  BRIGADISTA:  '/mis-asignaciones',
  FUNCIONARIO: '/dashboard',
  DEFAULT:     '/dashboard',
};

function FlameIcon() {
  return (
    <>
      <style>{s.flameStyles}</style>
      <div className="flame-wrap">
        <div className="flame flame-outer" />
        <div className="flame flame-mid" />
        <div className="flame flame-inner" />
      </div>
    </>
  );
}

export default function Login() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const location    = useLocation();

  const [form, setForm]             = useState({ email: '', password: '' });
  const [errors, setErrors]         = useState({});
  const [loading, setLoading]       = useState(false);
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
    if (loginError)   setLoginError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) return setErrors(validationErrors);
    setLoading(true);
    setLoginError('');
    try {
      const usuarioLogueado = await login(form.email, form.password);
      const ruta = RUTA_POR_ROL[usuarioLogueado.rol] || RUTA_POR_ROL.DEFAULT;
      navigate(ruta);
    } catch (error) {
      setLoginError(error.message || 'Error al iniciar sesión. Revisa tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.box}>

        <div style={s.header}>
          <FlameIcon />
          <h1 style={s.title}>SIFIRE</h1>
          <p style={s.subtitle}>
            Sistema de Gestión de Emergencias<br />
            Municipalidad Valle del Sol
          </p>
        </div>

        {registradoOk && <div style={s.alertOk}>✓ Cuenta creada. Ya puedes iniciar sesión.</div>}
        {loginError   && <div style={s.alertErr}>⚠ {loginError}</div>}

        <div style={s.card}>
          <form onSubmit={handleSubmit} noValidate>

            <div style={s.mb}>
              <label htmlFor="email" style={s.label}>Correo electrónico</label>
              <input
                id="email" name="email" type="email" autoComplete="email"
                placeholder="correo@ejemplo.cl"
                value={form.email} onChange={handleChange}
                style={{ ...s.input, ...(errors.email ? s.inputError : {}) }}
              />
              {errors.email && <span style={s.error}>{errors.email}</span>}
            </div>

            <div style={s.mb}>
              <label htmlFor="password" style={s.label}>Contraseña</label>
              <input
                id="password" name="password" type="password" autoComplete="current-password"
                placeholder="Tu contraseña"
                value={form.password} onChange={handleChange}
                style={{ ...s.input, ...(errors.password ? s.inputError : {}) }}
              />
              {errors.password && <span style={s.error}>{errors.password}</span>}
            </div>

            <button
              type="submit" disabled={loading}
              style={{ ...s.btn, ...(loading ? s.btnLoad : {}) }}
            >
              {loading ? '⏳ Ingresando...' : 'Ingresar'}
            </button>

          </form>
        </div>

        <p style={s.footer}>
          ¿No tienes cuenta?{' '}
          <Link to="/registro" style={s.link}>Regístrate</Link>
        </p>

      </div>
    </div>
  );
}