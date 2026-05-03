// todas las operaciones que van relacionadas con los reportes incendiarios
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/bff";
const API_URL = `${API_BASE_URL}/reportes`;

//este metodo es para treaer todos los reportes registrados en el sistema
export const listarReportes = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error("Error al listar los reportes");
    }
    return await response.json();
};

//este metodo es para crear un nuevo reporte
export const crearReporte = async (reporte) => {
    const response = await fetch(`${API_URL}/crear`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(reporte),
    });
    if (!response.ok) {
        throw new Error("Error al crear el reporte");
    }
    return await response.json();
};

export const subirFotoReporte = async (reporteId, archivo) => {
    const formData = new FormData();
    formData.append("archivo", archivo);
    const response = await fetch(`${API_URL}/${reporteId}/subir-foto`, {
        method: "POST",
        body: formData,
    });
    if (!response.ok) throw new Error("Error al subir la foto");
    return await response.json();
};

//este metodo es para que cambie el estado del reporte ej (pendiente, en proceso, cerrado)
export const cambiarEstadoReporte = async (id, nuevoEstado) => {
    const response = await fetch(`${API_URL}/${id}/estado`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ nuevoEstado }),
    });
    if (!response.ok) {
        throw new Error("Error al cambiar el estado del reporte");
    }
    return await response.json();
}
