import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { listarReportes, crearReporte, cambiarEstadoReporte, subirFotoReporte } from '../services/reporte.service';
import { listarBrigadas, crearAsignacion } from '../services/monitoreo.service';

const initialForm = {
    titulo: '', descripcion: '', nivel: 'MEDIO',
    latitud: '', longitud: '', archivos: []
};

const pedirUbicacion = (onSuccess) => {
    if (!navigator.geolocation) return alert('Tu navegador no soporta geolocalización.');
    navigator.geolocation.getCurrentPosition(onSuccess, (err) => {
        if (err.code === 1) alert('Permiso bloqueado.\n\n1. Haz click en el candado\n2. Cambia "Ubicación" a Permitir\n3. Recarga la página');
        else alert('No se pudo obtener tu ubicación.');
    }, { timeout: 8000 });
};

export function useReportes() {
    const { usuario } = useAuth();
    const [reportes, setReportes] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [showForm, setShowForm] = useState(false);
    const [exito, setExito] = useState(false);
    const [modalReporte, setModalReporte] = useState(null);
    const [reporteDetalle, setReporteDetalle] = useState(null); // ← NUEVO
    const [brigadistaId, setBrigadistaId] = useState('');
    const [exitoAsign, setExitoAsign] = useState(false);
    const [centroMapa, setCentroMapa] = useState([-33.4944, -70.6170]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [brigadas, setBrigadas] = useState([]);

    useEffect(() => {
        cargarReportes();
        listarBrigadas().then(setBrigadas).catch(() => { });
    }, []);

    const cargarReportes = async () => {
        try {
            setCargando(true);
            const data = await listarReportes();
            setReportes(data);
        } catch (err) {
            setError('No se pudieron cargar los reportes');
            console.error(err);
        } finally {
            setCargando(false);
        }
    };

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleUbicacion = (lat, lng) => setForm(prev => ({ ...prev, latitud: lat, longitud: lng }));
    const handleArchivos = (e) => setForm(prev => ({ ...prev, archivos: [...prev.archivos, ...Array.from(e.target.files)] }));
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const nuevoReporte = {
                titulo: form.titulo, descripcion: form.descripcion,
                nivelRiesgo: form.nivel,
                latitud: parseFloat(form.latitud), longitud: parseFloat(form.longitud),
                tipoReportante: usuario?.tipo || 'CIUDADANO',
                usuarioId: usuario?.id,
            };
            const creado = await crearReporte(nuevoReporte);

            // Subir fotos — opcional, si falla el reporte igual queda guardado
            if (form.archivos.length > 0) {
                for (const archivo of form.archivos) {
                    try {
                        await subirFotoReporte(creado.id, archivo);
                    } catch (fotoErr) {
                        console.warn('Foto no pudo subirse, reporte guardado igual:', fotoErr);
                    }
                }
            }

            await cargarReportes();
            setForm(initialForm);
            setShowForm(false);
            setExito(true);
            setTimeout(() => setExito(false), 3000);
        } catch (err) {
            setError('No se pudo enviar el reporte');
            console.error(err);
        }
    };

    const handleAsignar = async (e) => {
        e.preventDefault();
        if (!brigadistaId) return;
        try {
            // 1. Crear asignación en ms-monitoreo con la brigada real
            await crearAsignacion({ reporteId: modalReporte.id, brigadaId: Number(brigadistaId) });
            // 2. Cambiar estado del reporte a EN_PROCESO
            await cambiarEstadoReporte(modalReporte.id, 'EN_PROCESO');
            await cargarReportes();
            setModalReporte(null);
            setBrigadistaId('');
            setExitoAsign(true);
            setTimeout(() => setExitoAsign(false), 3000);
        } catch (err) {
            setError('No se pudo asignar la brigada');
            console.error(err);
        }
    };

    return {
        reportes, form, showForm, exito, exitoAsign,
        modalReporte, setModalReporte,
        reporteDetalle, setReporteDetalle,
        brigadistaId, setBrigadistaId,
        brigadas,
        centroMapa, cargando, error,
        handleChange, handleUbicacion, handleArchivos,
        eliminarArchivo, abrirFormulario, usarMiUbicacion,
        handleSubmit, handleAsignar,
    };
}