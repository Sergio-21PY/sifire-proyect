const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/bff";
const API_URL = `${API_BASE_URL}/alertas`;

//este metodo es para listar todas las alertas registradas en el sistema
export const listarAlertas = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error("Error al listar las alertas");
    }
    return await response.json();
};

//este metodo es para emitir una alerta manual desde el panel de funcionario
export const crearAlerta = async (alerta) => {
    const response = await fetch(`${API_URL}/crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alerta),
    });
    if (!response.ok) throw new Error("Error al crear la alerta");
    return await response.json();
};