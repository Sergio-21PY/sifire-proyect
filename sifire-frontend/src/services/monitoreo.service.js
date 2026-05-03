const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/bff";
const API_URL = `${API_BASE_URL}/monitoreo`;

// Trae las zonas de riesgo para mostrar en el mapa
export const listarZonas = async () => {
    const response = await fetch(`${API_URL}/zonas`);
    if (!response.ok) throw new Error("Error al listar las zonas de riesgo");
    return await response.json();
};

// Lista todas las brigadas y su disponibilidad
export const listarBrigadas = async () => {
    const response = await fetch(`${API_URL}/brigadas`);
    if (!response.ok) throw new Error("Error al listar las brigadas");
    return await response.json();
};

// Trae las rutas de evacuación para mostrar en el mapa
export const listarRutas = async () => {
    try {
        const response = await fetch(`${API_URL}/rutas`);
        if (!response.ok) return [];
        return await response.json();
    } catch {
        return [];
    }
};
// Trae las asignaciones activas de brigadas a reportes
export const listarAsignaciones = async () => {
    const response = await fetch(`${API_URL}/asignaciones`);
    if (!response.ok) throw new Error("Error al listar las asignaciones");
    return await response.json();
};

// Asigna una brigada disponible a un reporte activo
export const crearAsignacion = async (asignacion) => {
    const response = await fetch(`${API_URL}/asignaciones/crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(asignacion),
    });
    if (!response.ok) throw new Error("Error al crear la asignación");
    return await response.json();
};