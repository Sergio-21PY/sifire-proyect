import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import Login from '../pages/Login'

vi.mock('../services/usuario.service', () => ({
  login: vi.fn(),
  registrarUsuario: vi.fn(),
  listarUsuarios: vi.fn(),
}))
import { login as loginMock } from '../services/usuario.service'

// MemoryRouter SIEMPRE afuera — Login usa useNavigate() y useLocation()
function renderLogin(state = {}) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/login', state }]}>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('Login — renderizado inicial', () => {
  beforeEach(() => { vi.clearAllMocks(); localStorage.clear() })

  it('muestra el titulo SIFIRE', () => {
    renderLogin()
    expect(screen.getByRole('heading', { name: /SIFIRE/i })).toBeInTheDocument()
  })

  it('muestra el campo correo electronico', () => {
    renderLogin()
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
  })

  it('muestra el campo contraseña', () => {
    renderLogin()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
  })

  it('muestra el boton Ingresar', () => {
    renderLogin()
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument()
  })

  it('muestra el link de registro', () => {
    renderLogin()
    expect(screen.getByRole('link', { name: /regístrate/i })).toBeInTheDocument()
  })

  it('muestra el link de terminos y condiciones', () => {
    renderLogin()
    expect(screen.getByRole('link', { name: /términos y condiciones/i })).toBeInTheDocument()
  })

  it('muestra aviso de cuenta creada si viene desde registro', () => {
    renderLogin({ registrado: true })
    expect(screen.getByText(/cuenta creada/i)).toBeInTheDocument()
  })
})

describe('Login — tipeo en campos', () => {
  beforeEach(() => { vi.clearAllMocks(); localStorage.clear() })

  it('permite escribir en el campo email', async () => {
    renderLogin()
    const input = screen.getByLabelText(/correo electrónico/i)
    await userEvent.type(input, 'mati@sifire.cl')
    expect(input).toHaveValue('mati@sifire.cl')
  })

  it('permite escribir en el campo contraseña', async () => {
    renderLogin()
    const input = screen.getByLabelText(/contraseña/i)
    await userEvent.type(input, 'mi_password')
    expect(input).toHaveValue('mi_password')
  })
})

describe('Login — validaciones del formulario', () => {
  beforeEach(() => { vi.clearAllMocks(); localStorage.clear() })

  it('muestra error si el email es invalido', async () => {
    renderLogin()
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'no-es-email')
    await userEvent.click(screen.getByRole('button', { name: /ingresar/i }))
    expect(screen.getByText(/ingresa un correo válido/i)).toBeInTheDocument()
  })

  it('muestra error si la contraseña esta vacia', async () => {
    renderLogin()
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'mati@sifire.cl')
    await userEvent.click(screen.getByRole('button', { name: /ingresar/i }))
    expect(screen.getByText(/la contraseña es requerida/i)).toBeInTheDocument()
  })

  it('no llama al servicio si hay errores de validacion', async () => {
    renderLogin()
    await userEvent.click(screen.getByRole('button', { name: /ingresar/i }))
    expect(loginMock).not.toHaveBeenCalled()
  })
})

describe('Login — estado de carga', () => {
  beforeEach(() => { vi.clearAllMocks(); localStorage.clear() })

  it('muestra texto de carga mientras espera respuesta', async () => {
    loginMock.mockImplementation(() => new Promise(() => {}))
    renderLogin()
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'mati@sifire.cl')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'pass1234')
    await userEvent.click(screen.getByRole('button', { name: /ingresar/i }))
    expect(screen.getByText(/ingresando/i)).toBeInTheDocument()
  })

  it('el boton queda deshabilitado durante el loading', async () => {
    loginMock.mockImplementation(() => new Promise(() => {}))
    renderLogin()
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'mati@sifire.cl')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'pass1234')
    await userEvent.click(screen.getByRole('button', { name: /ingresar/i }))
    expect(screen.getByRole('button', { name: /ingresando/i })).toBeDisabled()
  })
})

describe('Login — resultado del servicio', () => {
  beforeEach(() => { vi.clearAllMocks(); localStorage.clear() })

  it('llama al servicio con email y password correctos', async () => {
    loginMock.mockResolvedValue({ tipo: 'FUNCIONARIO', nombre: 'Mati' })
    renderLogin()
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'mati@sifire.cl')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'pass1234')
    await userEvent.click(screen.getByRole('button', { name: /ingresar/i }))
    await waitFor(() => expect(loginMock).toHaveBeenCalledWith({ email: 'mati@sifire.cl', password: 'pass1234' }))
  })

  it('guarda el usuario en localStorage tras login exitoso', async () => {
    loginMock.mockResolvedValue({ tipo: 'FUNCIONARIO', nombre: 'Mati' })
    renderLogin()
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'mati@sifire.cl')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'pass1234')
    await userEvent.click(screen.getByRole('button', { name: /ingresar/i }))
    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('sifire_user'))
      expect(stored?.tipo).toBe('FUNCIONARIO')
    })
  })

  it('muestra error cuando las credenciales son incorrectas', async () => {
    loginMock.mockRejectedValue(new Error('Credenciales incorrectas.'))
    renderLogin()
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'malo@sifire.cl')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'wrongpass')
    await userEvent.click(screen.getByRole('button', { name: /ingresar/i }))
    await waitFor(() => expect(screen.getByText(/credenciales incorrectas/i)).toBeInTheDocument())
  })

  it('muestra error generico si el error no tiene message', async () => {
    loginMock.mockRejectedValue({})
    renderLogin()
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'mati@sifire.cl')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'pass1234')
    await userEvent.click(screen.getByRole('button', { name: /ingresar/i }))
    await waitFor(() => expect(screen.getByText(/error al iniciar sesión/i)).toBeInTheDocument())
  })
})