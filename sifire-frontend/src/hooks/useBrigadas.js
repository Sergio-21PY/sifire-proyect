import { useState, useEffect } from 'react';

const API_MONITOREO = import.meta.env.VITE_MS_MONITOREO_URL || 'http://localhost:8083';
const initialForm = { nombre: '', tipo: 'FORESTAL', estado: 'DISPONIBLE', latitud: '', longitud: '' };

export function useBrigadas() {
  const [brigadas, setBrigadas]       = useState([]);
  const [form, setForm]               = useState(initialForm);
  const [errors, setErrors]           = useState({});
  const [showForm, setShowForm]       = useState(false);
  const [exito, setExito]             = useState(false);
  const [loading, setLoading]         = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    try {
      const res = await fetch(`${API_MONITOREO}/api/monitoreo/brigadas`);
      if (!res.ok) throw new Error('Error al cargar brigadas');
      const data = await res.json();
      setBrigadas(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Error al cargar brigadas:', e);
      setBrigadas([]);
    } finally {
      setLoadingData(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido.';
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
      const res = await fetch(`${API_MONITOREO}/api/monitoreo/brigadas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre:   form.nombre,
          tipo:     form.tipo,
          estado:   form.estado,
          latitud:  parseFloat(form.latitud)  || null,
          longitud: parseFloat(form.longitud) || null,
        }),
      });
      if (!res.ok) throw new Error('Error al crear brigada');
      const nueva = await res.json();
      setBrigadas(prev => [nueva, ...prev]);
      setForm(initialForm);
      setShowForm(false);
      setExito(true);
      setTimeout(() => setExito(false), 3000);
    } catch (e) {
      console.error('Error al crear brigada:', e);
      setErrors({ form: 'No se pudo crear la brigada. Intente de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  return { brigadas, form, setForm, errors, setErrors, showForm, setShowForm, exito, loading, loadingData, handleChange, handleSubmit };
}
