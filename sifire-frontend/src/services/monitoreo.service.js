/* URL base del microservicio de monitoreo (puerto 8083) */
const API_URL = (import.meta.env.VITE_MS_MONITOREO_URL || 'http://localhost:8083') + '/api/monitoreo';

export const listarZonas = async () => {
    const response = await fetch(`${API_URL}/zonas`);
    if (!response.ok) throw new Error('Error al listar las zonas de riesgo');
    return await response.json();
};

export const listarBrigadas = async () => {
    const response = await fetch(`${API_URL}/brigadas`);
    if (!response.ok) throw new Error('Error al listar las brigadas');
    return await response.json();
};

export const listarRutas = async () => {
    try {
        const response = await fetch(`${API_URL}/rutas`);
        if (!response.ok) return [];
        return await response.json();
    } catch {
        return [];
    }
};

export const listarAsignaciones = async () => {
    const response = await fetch(`${API_URL}/asignaciones`);
    if (!response.ok) throw new Error('Error al listar las asignaciones');
    return await response.json();
};

export const crearAsignacion = async (asignacion) => {
    const response = await fetch(`${API_URL}/asignaciones/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asignacion),
    });
    if (!response.ok) throw new Error('Error al crear la asignación');
    return await response.json();
};
