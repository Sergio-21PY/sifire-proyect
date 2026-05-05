/* URL base del microservicio de reportes (puerto 8082) */
const API_URL = (import.meta.env.VITE_MS_REPORTES_URL || 'http://localhost:8082') + '/api/reportes';

export const listarReportes = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al listar los reportes');
    return await response.json();
};

export const crearReporte = async (reporte) => {
    const response = await fetch(`${API_URL}/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reporte),
    });
    if (!response.ok) throw new Error('Error al crear el reporte');
    return await response.json();
};

export const subirFotoReporte = async (reporteId, archivo) => {
    const formData = new FormData();
    formData.append('archivo', archivo);
    const response = await fetch(`${API_URL}/${reporteId}/subir-foto`, {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) throw new Error('Error al subir la foto');
    return await response.json();
};

export const cambiarEstadoReporte = async (id, nuevoEstado) => {
    const response = await fetch(`${API_URL}/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevoEstado }),
    });
    if (!response.ok) throw new Error('Error al cambiar el estado del reporte');
    return await response.json();
};
