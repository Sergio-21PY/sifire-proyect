/* URL base del microservicio de alertas (puerto 8084) */
const API_URL = (import.meta.env.VITE_MS_ALERTAS_URL || 'http://localhost:8084') + '/api/alertas';

export const listarAlertas = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al listar las alertas');
    return await response.json();
};

export const crearAlerta = async (alerta) => {
    const response = await fetch(`${API_URL}/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alerta),
    });
    if (!response.ok) throw new Error('Error al crear la alerta');
    return await response.json();
};
