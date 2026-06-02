import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import Registro from '../../pages/Registro'

vi.mock('../../services/usuario.service', () => ({
    login: vi.fn(),
    registrarUsuario: vi.fn(),
    listarUsuarios: vi.fn(),
}))
import { registrarUsuario as registrarMock } from '../../services/usuario.service'

// Registro usa useNavigate() → MemoryRouter siempre afuera
function renderRegistro() {
    return render(
        <MemoryRouter initialEntries={['/registro']}>
            <AuthProvider>
                <Registro />
            </AuthProvider>
        </MemoryRouter>
    )
}

describe('Registro — renderizado inicial', () => {
    beforeEach(() => { vi.clearAllMocks(); localStorage.clear() })

    it('muestra el titulo Crear cuenta', () => {
        renderRegistro()
        expect(screen.getByRole('heading', { name: /crear cuenta/i })).toBeInTheDocument()
    })

    it('muestra el campo nombre completo', () => {
        renderRegistro()
        expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument()
    })

    it('muestra el campo correo electronico', () => {
        renderRegistro()
        expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    })

    it('muestra el campo telefono', () => {
        renderRegistro()
        expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument()
    })

    it('muestra el campo contraseña', () => {
        renderRegistro()
        expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument()
    })

    it('muestra el campo confirmar contraseña', () => {
        renderRegistro()
        expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument()
    })

    it('muestra el boton Crear cuenta', () => {
        renderRegistro()
        expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeInTheDocument()
    })

    it('muestra el link para iniciar sesion', () => {
        renderRegistro()
        expect(screen.getByRole('link', { name: /iniciar sesión/i })).toBeInTheDocument()
    })
})

describe('Registro — validaciones', () => {
    beforeEach(() => { vi.clearAllMocks(); localStorage.clear() })

    it('muestra error si el nombre esta vacio', async () => {
        renderRegistro()
        await userEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))
        expect(screen.getByText(/el nombre es requerido/i)).toBeInTheDocument()
    })

    it('muestra error si el email es invalido', async () => {
        renderRegistro()
        await userEvent.type(screen.getByLabelText(/nombre completo/i), 'MatiDroid')
        await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'no-es-email')
        await userEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))
        expect(screen.getByText(/ingresa un correo válido/i)).toBeInTheDocument()
    })

    it('muestra error si la contraseña tiene menos de 8 caracteres', async () => {
        renderRegistro()
        await userEvent.type(screen.getByLabelText(/nombre completo/i), 'Mati')
        await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'matidroid1@gmail.com')
        await userEvent.type(screen.getByLabelText(/^contraseña$/i), 'corta')
        await userEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))
        expect(screen.getByText(/mínimo 8 caracteres/i)).toBeInTheDocument()
    })

    it('muestra error si las contraseñas no coinciden', async () => {
        renderRegistro()
        await userEvent.type(screen.getByLabelText(/nombre completo/i), 'Mati')
        await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'matidroid1@gmail.com')
        await userEvent.type(screen.getByLabelText(/^contraseña$/i), 'password123')
        await userEvent.type(screen.getByLabelText(/confirmar contraseña/i), 'password999')
        await userEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))
        expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument()
    })

    it('no llama al servicio si hay errores de validacion', async () => {
        renderRegistro()
        await userEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))
        expect(registrarMock).not.toHaveBeenCalled()
    })
})

describe('Registro — resultado del servicio', () => {
    beforeEach(() => { vi.clearAllMocks(); localStorage.clear() })

    async function llenarFormulario() {
        await userEvent.type(screen.getByLabelText(/nombre completo/i), 'Mati Droid')
        await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'mati@sifire.cl')
        await userEvent.type(screen.getByLabelText(/^contraseña$/i), 'password123')
        await userEvent.type(screen.getByLabelText(/confirmar contraseña/i), 'password123')
    }

    it('llama al servicio con los datos correctos', async () => {
        registrarMock.mockResolvedValue({})
        renderRegistro()
        await llenarFormulario()
        await userEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))
        await waitFor(() => {
            expect(registrarMock).toHaveBeenCalledWith(
                expect.objectContaining({ email: 'mati@sifire.cl', tipo: 'CIUDADANO' })
            )
        })
    })

    it('muestra error si el servidor rechaza el registro', async () => {
        registrarMock.mockRejectedValue(new Error('El correo ya está registrado.'))
        renderRegistro()
        await llenarFormulario()
        await userEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))
        await waitFor(() => expect(screen.getByText(/el correo ya está registrado/i)).toBeInTheDocument())
    })

    it('muestra error generico si el error no tiene message', async () => {
        registrarMock.mockRejectedValue({})
        renderRegistro()
        await llenarFormulario()
        await userEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))
        await waitFor(() => expect(screen.getByText(/no se pudo completar el registro/i)).toBeInTheDocument())
    })
})