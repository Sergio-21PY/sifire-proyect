import { useState } from 'react';
import { reportesMock } from '../data/mockData';

const initialForm = { titulo: '', descripcion: '', nivel: 'MEDIO', latitud: '', longitud: '', archivos: [] };

const pedirUbicacion = (onSuccess) => {
  if (!navigator.geolocation) return alert('Tu navegador no soporta geolocalización.');
  navigator.geolocation.getCurrentPosition(onSuccess, (err) => {
    if (err.code === 1) alert(' Permiso bloqueado.\n\n1. Haz click en el candado \n2. Cambia "Ubicación" a Permitir\n3. Recarga la página');
    else alert('No se pudo obtener tu ubicación.');
  }, { timeout: 8000 });
};

export function useReportes() {
  const [reportes, setReportes]       = useState(reportesMock);
  const [form, setForm]               = useState(initialForm);
  const [showForm, setShowForm]       = useState(false);
  const [exito, setExito]             = useState(false);
  const [modalReporte, setModalReporte] = useState(null);
  const [brigadistaId, setBrigadistaId] = useState('');
  const [exitoAsign, setExitoAsign]   = useState(false);
  const [centroMapa, setCentroMapa]   = useState([-33.4944, -70.6170]);

  const handleChange    = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleUbicacion = (lat, lng) => setForm(prev => ({ ...prev, latitud: lat, longitud: lng }));
  const handleArchivos  = (e) => setForm(prev => ({ ...prev, archivos: [...prev.archivos, ...Array.from(e.target.files)] }));
  const eliminarArchivo = (i) => setForm(prev => ({ ...prev, archivos: prev.archivos.filter((_, idx) => idx !== i) }));

  const abrirFormulario = () => {
    setShowForm(prev => !prev);
    if (!showForm) {
      pedirUbicacion((pos) => {
        setCentroMapa([pos.coords.latitude, pos.coords.longitude]);
        setForm(prev => ({ ...prev, latitud: pos.coords.latitude.toFixed(6), longitud: pos.coords.longitude.toFixed(6) }));
      });
    }
  };

  const usarMiUbicacion = () => {
    pedirUbicacion((pos) => {
      setCentroMapa([pos.coords.latitude, pos.coords.longitude]);
      setForm(prev => ({ ...prev, latitud: pos.coords.latitude.toFixed(6), longitud: pos.coords.longitude.toFixed(6) }));
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevo = {
      id: reportes.length + 1,
      titulo: form.titulo,
      nivel: form.nivel,
      estado: 'PENDIENTE',
      fecha: new Date().toLocaleDateString('es-CL'),
      origen: 'CIUDADANO',
      descripcion: form.descripcion,
      sincronizado: false,
    };
    const pendientes = JSON.parse(localStorage.getItem('reportes_pendientes') || '[]');
    pendientes.push({ ...nuevo, latitud: form.latitud, longitud: form.longitud });
    localStorage.setItem('reportes_pendientes', JSON.stringify(pendientes));
    setReportes(prev => [nuevo, ...prev]);
    setForm(initialForm);
    setShowForm(false);
    setExito(true);
    setTimeout(() => setExito(false), 3000);
  };

  const handleAsignar = (e) => {
    e.preventDefault();
    if (!brigadistaId) return;
    setModalReporte(null);
    setBrigadistaId('');
    setExitoAsign(true);
    setTimeout(() => setExitoAsign(false), 3000);
  };

  return {
    reportes, form, showForm, exito, exitoAsign,
    modalReporte, setModalReporte,
    brigadistaId, setBrigadistaId,
    centroMapa,
    handleChange, handleUbicacion, handleArchivos,
    eliminarArchivo, abrirFormulario, usarMiUbicacion,
    handleSubmit, handleAsignar,
  };
}