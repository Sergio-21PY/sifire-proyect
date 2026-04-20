import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registrarUsuario } from '../services/usuario.service'; // Importamos el servicio
import '../assets/Registro.css';

export default function Registro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    confirmar_password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [registroError, setRegistroError] = useState(''); // Estado para errores del backend

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Ingresa un correo válido.';
    if (form.telefono && !/^\+?56?[\s-]?9[\s-]?\d{4}[\s-]?\d{4}$/.test(form.telefono)) e.telefono = 'Formato inválido. Ej: +56 9 1234 5678';
    if (form.password.length < 8) e.password = 'Mínimo 8 caracteres.';
    if (form.password !== form.confirmar_password) e.confirmar_password = 'Las contraseñas no coinciden.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (registroError) setRegistroError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setRegistroError('');

    try {
      // Creamos el objeto de usuario para enviar al backend
      const nuevoUsuario = {
        nombre: form.nombre,
        email: form.email,
        password: form.password,
        // El backend debería asignar el rol 'CIUDADANO' por defecto
      };

      await registrarUsuario(nuevoUsuario);

      // Si el registro es exitoso, redirigimos al login con un mensaje
      navigate('/login', { state: { registrado: true } });

    } catch (error) {
      // Si el servicio lanza un error, lo mostramos
      setRegistroError(error.message || 'No se pudo completar el registro. Inténtelo de nuevo.');
      console.error("Error en el registro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sifire-registro-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">

            <div className="text-center mb-4">
              <h1 className="fs-4 fw-bold text-dark mb-1">Crear cuenta</h1>
              <p className="text-muted small">
                Sistema de Gestión de Emergencias — Municipalidad Valle del Sol
              </p>
            </div>

            {registroError && (
              <div className="alert alert-danger py-2 small text-center" role="alert">
                {registroError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label small fw-semibold">
                  Nombre completo
                </label>
                <input
                  id="nombre" name="nombre" type="text" autoComplete="name"
                  className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                  placeholder="Ej: María González"
                  value={form.nombre}
                  onChange={handleChange}
                />
                {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
              </div>

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

              <div className="mb-3">
                <label htmlFor="telefono" className="form-label small fw-semibold">
                  Teléfono <span className="text-muted fw-normal">(opcional)</span>
                </label>
                <input
                  id="telefono" name="telefono" type="tel" autoComplete="tel"
                  className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                  placeholder="+56 9 1234 5678"
                  value={form.telefono}
                  onChange={handleChange}
                />
                {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label small fw-semibold">
                  Contraseña
                </label>
                <input
                  id="password" name="password" type="password" autoComplete="new-password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Mínimo 8 caracteres"
                  value={form.password}
                  onChange={handleChange}
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              <div className="mb-4">
                <label htmlFor="confirmar_password" className="form-label small fw-semibold">
                  Confirmar contraseña
                </label>
                <input
                  id="confirmar_password" name="confirmar_password"
                  type="password" autoComplete="new-password"
                  className={`form-control ${errors.confirmar_password ? 'is-invalid' : ''}`}
                  placeholder="Repite tu contraseña"
                  value={form.confirmar_password}
                  onChange={handleChange}
                />
                {errors.confirmar_password && (
                  <div className="invalid-feedback">{errors.confirmar_password}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-danger w-100 py-2 fw-semibold"
              >
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2" />Creando cuenta…</>
                  : 'Crear cuenta'
                }
              </button>
            </form>

            <p className="text-center text-muted small mt-4">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-danger text-decoration-none fw-semibold">
                Iniciar sesión
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
