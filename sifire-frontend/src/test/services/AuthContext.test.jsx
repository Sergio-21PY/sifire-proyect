import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthProvider, useAuth } from '../../context/AuthContext'

// Mock del servicio de login para controlar su comportamiento en las pruebas
vi.mock('../../services/usuario.service', () => ({
  login: vi.fn(),
  registrarUsuario: vi.fn(),
  listarUsuarios: vi.fn(),
}))
import { login as loginService } from '../../services/usuario.service'

// Componente auxiliar que expone el contexto en el DOM para poder interrogarlo

function TestConsumer() {
  const { usuario, estaAutenticado, login, logout } = useAuth()
  return (
    <div>
      <span data-testid="autenticado">{String(estaAutenticado)}</span>
      <span data-testid="usuario">{usuario ? JSON.stringify(usuario) : 'null'}</span>
      <button onClick={() => login('test@sifire.cl', 'pass1234')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

function renderAuth() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  )
}

// ── Parte1: estado inicial ───────────────────────────────────────────────────────────
// aqui se prueba el estado inicial del AuthContext, verificando que sin un usuario en localStorage, el estado inicia con usuario null y estaAutenticado false.
// también se prueba que si hay un usuario válido en localStorage, el contexto lo carga correctamente y estaAutenticado es true.
describe('AuthContext — estado inicial', () => {
  beforeEach(() => { vi.clearAllMocks(); localStorage.clear() })

  it('inicia sin usuario cuando localStorage está vacío', () => {
    renderAuth()
    expect(screen.getByTestId('usuario').textContent).toBe('null')
  })

  it('estaAutenticado es false cuando no hay usuario', () => {
    renderAuth()
    expect(screen.getByTestId('autenticado').textContent).toBe('false')
  })

  it('carga el usuario desde localStorage si ya existe', () => {
    const usuarioGuardado = { id: 1, nombre: 'Mati', tipo: 'FUNCIONARIO' }
    localStorage.setItem('sifire_user', JSON.stringify(usuarioGuardado))
    renderAuth()
    expect(screen.getByTestId('autenticado').textContent).toBe('true')
    const parsed = JSON.parse(screen.getByTestId('usuario').textContent)
    expect(parsed.nombre).toBe('Mati')
    expect(parsed.tipo).toBe('FUNCIONARIO')
  })
})

// ── Parte 2: login ───────────────────────────────────────────────────────────
// aquí se prueba la función login del contexto, verificando que llama al servicio de login con las credenciales correctas,
// que actualiza el estado del contexto con el usuario retornado por el servicio, y que persiste el usuario en localStorage.
// también se prueba que si el servicio de login falla, el error se relanza para que pueda ser manejado por el componente que llama a login.

describe('AuthContext — login()', () => {
  beforeEach(() => { vi.clearAllMocks(); localStorage.clear() })

  it('llama al servicio con email y password', async () => {
    loginService.mockResolvedValue({ id: 1, nombre: 'Mati', tipo: 'FUNCIONARIO' })
    renderAuth()
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))
    expect(loginService).toHaveBeenCalledWith({ email: 'test@sifire.cl', password: 'pass1234' })
  })

  it('actualiza el estado tras login exitoso', async () => {
    loginService.mockResolvedValue({ id: 1, nombre: 'Mati', tipo: 'FUNCIONARIO' })
    renderAuth()
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))
    expect(screen.getByTestId('autenticado').textContent).toBe('true')
  })

  it('persiste el usuario en localStorage tras login exitoso', async () => {
    const usuarioMock = { id: 1, nombre: 'Mati', tipo: 'FUNCIONARIO' }
    loginService.mockResolvedValue(usuarioMock)
    renderAuth()
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))
    const stored = JSON.parse(localStorage.getItem('sifire_user'))
    expect(stored.nombre).toBe('Mati')
  })

  it('relanza el error si el servicio falla', async () => {
    loginService.mockRejectedValue(new Error('Credenciales incorrectas.'))
    // El AuthProvider relanza el error — capturamos la promesa rechazada
    let errorCapturado = null

    function TestError() {
      const { login } = useAuth()
      const handleClick = async () => {
        try { await login('malo@sifire.cl', 'wrong') }
        catch (e) { errorCapturado = e.message }
      }
      return <button onClick={handleClick}>Login fallido</button>
    }

    render(<AuthProvider><TestError /></AuthProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'Login fallido' }))
    expect(errorCapturado).toBe('Credenciales incorrectas.')
  })
})

// ── Parte 3: logout 
// aquí se prueba la función logout del contexto, verificando que limpia el estado de usuario y estaAutenticado,
// y que elimina el usuario de localStorage. Se simula un estado autenticado antes de llamar a logout para verificar que el cambio de estado ocurre correctamente.
describe('AuthContext — logout()', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('limpia el estado de usuario', async () => {
    localStorage.setItem('sifire_user', JSON.stringify({ id: 1, nombre: 'Mati', tipo: 'FUNCIONARIO' }))
    renderAuth()
    expect(screen.getByTestId('autenticado').textContent).toBe('true')
    await userEvent.click(screen.getByRole('button', { name: 'Logout' }))
    expect(screen.getByTestId('autenticado').textContent).toBe('false')
    expect(screen.getByTestId('usuario').textContent).toBe('null')
  })

  it('elimina el usuario de localStorage', async () => {
    localStorage.setItem('sifire_user', JSON.stringify({ id: 1, nombre: 'Mati', tipo: 'FUNCIONARIO' }))
    renderAuth()
    await userEvent.click(screen.getByRole('button', { name: 'Logout' }))
    expect(localStorage.getItem('sifire_user')).toBeNull()
  })
})

// ── Parte 4: useAuth fuera del provider
// aquí se prueba que si se intenta usar el hook useAuth fuera del AuthProvider, se lanza un error con el mensaje esperado.
describe('AuthContext — useAuth()', () => {
  it('lanza error si se usa fuera de AuthProvider', () => {
    // Silenciar el error de consola esperado
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<TestConsumer />)).toThrow('useAuth debe usarse dentro de <AuthProvider>')
    consoleError.mockRestore()
  })
})
