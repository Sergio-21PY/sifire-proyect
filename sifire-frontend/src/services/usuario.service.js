/* URL base del microservicio de usuarios (puerto 8081) */
const API_URL = (import.meta.env.VITE_MS_USUARIOS_URL || 'http://localhost:8081') + '/api/usuarios';

export const listarUsuarios = async () => {
    const response = await fetch(`${API_URL}/listar`);
    if (!response.ok) throw new Error('Error al listar los usuarios');
    return await response.json();
};

export const registrarUsuario = async (usuario) => {
    const response = await fetch(`${API_URL}/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
    });
    if (!response.ok) throw new Error('Error al registrar el usuario');
    return await response.json();
};

export const login = async (credenciales) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credenciales),
    });
    if (response.status === 401) throw new Error('Email o contraseña incorrectos');
    if (!response.ok) throw new Error('Error en el inicio de sesión');
    return await response.json();
};

export const obtenerUsuarioPorId = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Error al obtener el usuario');
    return await response.json();
};

export const eliminarUsuario = async (id) => {
    const response = await fetch(`${API_URL}/eliminar/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error al eliminar el usuario');
};
