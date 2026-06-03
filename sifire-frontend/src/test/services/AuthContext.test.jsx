import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthProvider, useAuth } from '../../context/AuthContext'

// Mock del servicio de login
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

// ── Suite 1: estado inicial ───────────────────────────────────────────────────
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

// ── Suite 2: login ────────────────────────────────────────────────────────────
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

// ── Suite 3: logout ───────────────────────────────────────────────────────────
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

// ── Suite 4: useAuth fuera del provider ───────────────────────────────────────
describe('AuthContext — useAuth()', () => {
  it('lanza error si se usa fuera de AuthProvider', () => {
    // Silenciar el error de consola esperado
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<TestConsumer />)).toThrow('useAuth debe usarse dentro de <AuthProvider>')
    consoleError.mockRestore()
  })
})
