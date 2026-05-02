import { useState, useEffect } from 'react';
import { listarUsuarios, registrarUsuario } from '../services/usuario.service';

const initialForm = { nombre: '', email: '', telefono: '', password: '' };

export function useGestionBrigadistas() {
  const [brigadistas, setBrigadistas] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [exito, setExito] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await listarUsuarios();
        setBrigadistas(data.filter(u => u.tipo === 'BRIGADISTA').map(u => ({ ...u, asignaciones: 0, estado: 'ACTIVO' })));
      } catch (e) {
        console.error('Error al cargar usuarios:', e);
      } finally {
        setLoadingData(false);
      }
    };
    cargar();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Ingresa un correo válido.';
    if (form.telefono && !/^\+?56?[\s-]?9[\s-]?\d{4}[\s-]?\d{4}$/.test(form.telefono)) e.telefono = 'Formato inválido. Ej: +56 9 1234 5678';
    if (form.password.length < 8) e.password = 'Mínimo 8 caracteres.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) return setErrors(validationErrors);
  setLoading(true);
  try {
    const nuevo = await registrarUsuario({
      username:  form.nombre,
      nombre:    form.nombre,       // ← agregar nombre separado
      email:     form.email,
      password:  form.password,
      telefono:  form.telefono || '', // ← agregar telefono
      tipo:      'BRIGADISTA',       // ← cambiar "rol" por "tipo"
      activo:    true
    });
    setBrigadistas(prev => [
      { ...nuevo, telefono: form.telefono || '—', asignaciones: 0, estado: 'ACTIVO' },
      ...prev
    ]);
    setForm(initialForm);
    setShowForm(false);
    setExito(true);
    setTimeout(() => setExito(false), 3000);
  } catch (e) {
    console.error('Error al registrar:', e);
    setErrors({ form: 'No se pudo registrar el brigadista. Intente de nuevo.' });
  } finally {
    setLoading(false);
  }
};

  const toggleEstado = (id) =>
    setBrigadistas(prev => prev.map(b => b.id === id ? { ...b, estado: b.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' } : b));

  return { brigadistas, form, setForm, errors, setErrors, showForm, setShowForm, exito, loading, loadingData, handleChange, handleSubmit, toggleEstado };
}