/* URL base de la API (configurable por variable de entorno de Vite) */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/bff";
const API_URL = `${API_BASE_URL}/usuarios`;
/**
 * Obtiene la lista de todos los usuarios.
 * @returns {Promise<Array>} Una promesa que resuelve a un array de usuarios.
 */
export const listarUsuarios = async () => {
    const response = await fetch(`${API_URL}/listar`);
    if (!response.ok) {
        throw new Error("Error al listar los usuarios");
    }
    return await response.json();
};

/**
 * Registra un nuevo usuario.
 * @param {object} usuario - El objeto de usuario a registrar (ej: { nombre, email, password }).
 * @returns {Promise<object>} Una promesa que resuelve al nuevo usuario creado.
 */
export const registrarUsuario = async (usuario) => {
    const response = await fetch(`${API_URL}/registro`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
    });
    if (!response.ok) {
        throw new Error("Error al registrar el usuario");
    }
    return await response.json();
};

/**
 * Inicia sesión con un email y contraseña.
 * @param {object} credenciales - Objeto con email y password.
 * @returns {Promise<object>} Una promesa que resuelve a los datos del usuario si el login es exitoso.
 */
export const login = async (credenciales) => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credenciales),
    });
    if (response.status === 401) {
        throw new Error("Email o contraseña incorrectos");
    }
    if (!response.ok) {
        throw new Error("Error en el inicio de sesión");
    }
    return await response.json();
};

/**
 * Obtiene un usuario por su ID.
 * @param {number} id - El ID del usuario.
 * @returns {Promise<object>} Una promesa que resuelve a los datos del usuario.
 */
export const obtenerUsuarioPorId = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
        throw new Error("Error al obtener el usuario");
    }
    return await response.json();
};

/**
 * Elimina un usuario por su ID.
 * @param {number} id - El ID del usuario a eliminar.
 * @returns {Promise<void>}
 */
export const eliminarUsuario = async (id) => {
    const response = await fetch(`${API_URL}/eliminar/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Error al eliminar el usuario");
    }
};
