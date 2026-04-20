import { createContext, useContext, useState } from 'react';
import { login as loginService } from '../services/usuario.service'; // Renombramos para evitar colisión

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(
        JSON.parse(localStorage.getItem('sifire_user')) || null
    );

    const login = async (email, password) => {
        try {
            // Llamamos al servicio de login real
            const usuarioLogueado = await loginService({ email, password });

            // Guardamos el usuario en localStorage y en el estado
            localStorage.setItem('sifire_user', JSON.stringify(usuarioLogueado));
            setUsuario(usuarioLogueado);

            // Devolvemos el usuario para que el componente de login pueda usarlo
            return usuarioLogueado;

        } catch (error) {
            // Si el servicio lanza un error (ej. por 401), lo relanzamos
            // para que el componente que llama a login pueda manejarlo.
            console.error("Error en el contexto de autenticación:", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('sifire_user');
        setUsuario(null);
    };

    const estaAutenticado = !!usuario;

    return (
        <AuthContext.Provider value={{ usuario, login, logout, estaAutenticado }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
    return ctx;
}
