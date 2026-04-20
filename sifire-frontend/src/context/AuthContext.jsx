import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const USUARIOS_MOCK = [
    { id: 1, nombre: 'Ana Martínez', email: 'funcionario@demo.cl', rol: 'FUNCIONARIO', token: 'mock-token-funcionario' },
    { id: 2, nombre: 'Carlos Rojas', email: 'brigadista@demo.cl', rol: 'BRIGADISTA', token: 'mock-token-brigadista' },
    { id: 3, nombre: 'María González', email: 'ciudadano@demo.cl', rol: 'CIUDADANO', token: 'mock-token-ciudadano' },
]

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(
        JSON.parse(localStorage.getItem('sifire_user')) || null
    )

    const login = (email, password) => {
        // TODO: reemplazar por → axios.post('/bff/auth/login', { email, password })
        const encontrado = USUARIOS_MOCK.find(u => u.email === email)

        if (!encontrado) {
            return { ok: false, mensaje: 'Correo no registrado' }
        }
        if (password !== '12345678') {
            return { ok: false, mensaje: 'Contraseña incorrecta' }
        }
        localStorage.setItem('sifire_user', JSON.stringify(encontrado))
        setUsuario(encontrado)
        return { ok: true, usuario: encontrado }
    }

    const logout = () => {
        localStorage.removeItem('sifire_user')
        setUsuario(null)
    }

    const estaAutenticado = !!usuario

    return (
        <AuthContext.Provider value={{ usuario, login, logout, estaAutenticado }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
    return ctx
}