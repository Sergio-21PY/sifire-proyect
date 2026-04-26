import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registrarUsuario } from '../services/usuario.service';
import * as s from '../styles/Registro.styles';

export default function Registro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '', email: '', telefono: '', password: '', confirmar_password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [registroError, setRegistroError] = useState('');

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
    if (Object.keys(validationErrors).length > 0) return setErrors(validationErrors);
    setLoading(true);
    setRegistroError('');
    try {
      await registrarUsuario({ nombre: form.nombre, email: form.email, password: form.password });
      navigate('/login', { state: { registrado: true } });
    } catch (error) {
      setRegistroError(error.message || 'No se pudo completar el registro. Inténtelo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const field = (name) => ({ ...s.input, ...(errors[name] ? s.inputError : {}) });

  return (
    <div style={s.page}>
      <div style={s.box}>

        <div style={s.header}>
          <h1 style={s.title}>Crear cuenta</h1>
          <p style={s.subtitle}>
            Sistema de Gestión de Emergencias<br />

          </p>
        </div>

        {registroError && <div style={s.alertErr}>⚠ {registroError}</div>}

        <div style={s.card}>
          <form onSubmit={handleSubmit} noValidate>
            <div style={s.formGrid}>

              <div style={{ ...s.mb, ...s.formGridFull }}>
                <label htmlFor="nombre" style={s.label}>Nombre completo</label>
                <input id="nombre" name="nombre" type="text" autoComplete="name"
                  placeholder="Ej: María González"
                  value={form.nombre} onChange={handleChange} style={field('nombre')} />
                {errors.nombre && <span style={s.error}>{errors.nombre}</span>}
              </div>


              <div style={{ ...s.mb, ...s.formGridFull }}>
                <label htmlFor="email" style={s.label}>Correo electrónico</label>
                <input id="email" name="email" type="email" autoComplete="email"
                  placeholder="correo@ejemplo.cl"
                  value={form.email} onChange={handleChange} style={field('email')} />
                {errors.email && <span style={s.error}>{errors.email}</span>}
              </div>


              <div style={{ ...s.mb, ...s.formGridFull }}>
                <label htmlFor="telefono" style={s.label}>
                  Teléfono <span style={s.labelOpt}>(opcional)</span>
                </label>
                <input id="telefono" name="telefono" type="tel" autoComplete="tel"
                  placeholder="+56 9 1234 5678"
                  value={form.telefono} onChange={handleChange} style={field('telefono')} />
                {errors.telefono && <span style={s.error}>{errors.telefono}</span>}
              </div>

              <div style={s.mb}>
                <label htmlFor="password" style={s.label}>Contraseña</label>
                <input id="password" name="password" type="password" autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  value={form.password} onChange={handleChange} style={field('password')} />
                {errors.password && <span style={s.error}>{errors.password}</span>}
              </div>

              <div style={s.mb}>
                <label htmlFor="confirmar_password" style={s.label}>Confirmar contraseña</label>
                <input id="confirmar_password" name="confirmar_password" type="password" autoComplete="new-password"
                  placeholder="Repite tu contraseña"
                  value={form.confirmar_password} onChange={handleChange} style={field('confirmar_password')} />
                {errors.confirmar_password && <span style={s.error}>{errors.confirmar_password}</span>}
              </div>

            </div>

            <button type="submit" disabled={loading}
              style={{ ...s.btn, ...(loading ? s.btnLoad : {}) }}>
              {loading ? '⏳ Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>
        </div>

        <p style={s.footer}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={s.link}>Iniciar sesión</Link>
        </p>

      </div>
    </div>
  );
}