import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import GestionBrigadistas from '../../pages/GestionBrigadistas'

vi.mock('../../services/usuario.service', () => ({
  listarUsuarios:   vi.fn(),
  registrarUsuario: vi.fn(),
  login: vi.fn(),
}))
global.fetch = vi.fn()
vi.mock('../../components/reportes/MapaSelector', () => ({ default: () => <div data-testid="mapa-selector" /> }))

import { listarUsuarios, registrarUsuario } from '../../services/usuario.service'

const brigadistasMock = [
  { id: 1, nombre: 'Carlos Rojas', email: 'carlos@sifire.cl', telefono: '+56912345678', tipo: 'BRIGADISTA', activo: true },
  { id: 2, nombre: 'Ana López',    email: 'ana@sifire.cl',    telefono: '+56987654321', tipo: 'BRIGADISTA', activo: true },
]
const brigadasMock = [
  { id: 1, nombre: 'Brigada Norte', tipo: 'FORESTAL', estado: 'DISPONIBLE', latitud: -33.45, longitud: -70.65 },
]

function renderGestion() {
  localStorage.setItem('sifire_user', JSON.stringify({ id: 1, nombre: 'Jefe', tipo: 'FUNCIONARIO' }))
  return render(<MemoryRouter><AuthProvider><GestionBrigadistas /></AuthProvider></MemoryRouter>)
}

describe('GestionBrigadistas — renderizado inicial', () => {
  beforeEach(() => {
    vi.clearAllMocks(); localStorage.clear()
    listarUsuarios.mockResolvedValue(brigadistasMock)
    fetch.mockResolvedValue({ ok: true, json: async () => brigadasMock })
  })

  it('muestra el título Gestión de Brigadistas', async () => {
    renderGestion()
    await waitFor(() => expect(screen.getByRole('heading', { name: /gestión de brigadistas/i })).toBeInTheDocument())
  })

  it('muestra los tabs Brigadistas y Brigadas', async () => {
    renderGestion()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^brigadistas$/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^brigadas$/i })).toBeInTheDocument()
    })
  })

  it('llama a listarUsuarios para cargar los brigadistas', async () => {
    renderGestion()
    await waitFor(() => expect(listarUsuarios).toHaveBeenCalled())
  })

  it('muestra los nombres de los brigadistas en la tabla', async () => {
    renderGestion()
    await waitFor(() => {
      expect(screen.getByText('Carlos Rojas')).toBeInTheDocument()
      expect(screen.getByText('Ana López')).toBeInTheDocument()
    })
  })
})

describe('GestionBrigadistas — formulario brigadista', () => {
  beforeEach(() => {
    vi.clearAllMocks(); localStorage.clear()
    listarUsuarios.mockResolvedValue(brigadistasMock)
    fetch.mockResolvedValue({ ok: true, json: async () => brigadasMock })
  })

  it('el formulario está oculto inicialmente', async () => {
    renderGestion()
    await waitFor(() => screen.getByRole('heading', { name: /gestión de brigadistas/i }))
    // El <h2> "Nuevo Brigadista" del formulario no debe existir.
    // Usamos heading level 2 para no confundir con el botón "+ Nuevo Brigadista"
    expect(screen.queryByRole('heading', { level: 2, name: /nuevo brigadista/i })).not.toBeInTheDocument()
  })

  it('abre el formulario al hacer clic en + Nuevo Brigadista', async () => {
    renderGestion()
    await waitFor(() => screen.getByRole('button', { name: /nuevo brigadista/i }))
    fireEvent.click(screen.getByRole('button', { name: /nuevo brigadista/i }))
    // El <h2> del BrigadistaForm aparece cuando showForm es true
    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 2, name: /nuevo brigadista/i })).toBeInTheDocument()
    )
  })

  it('muestra error si el nombre está vacío al enviar', async () => {
    renderGestion()
    await waitFor(() => screen.getByRole('button', { name: /nuevo brigadista/i }))
    fireEvent.click(screen.getByRole('button', { name: /nuevo brigadista/i }))
    await waitFor(() => screen.getByRole('heading', { level: 2, name: /nuevo brigadista/i }))
    // fireEvent.submit bypasses HTML5 native validation (required), allowing React's onSubmit to run
    fireEvent.submit(screen.getByRole('button', { name: /registrar brigadista/i }).closest('form'))
    await waitFor(() => expect(screen.getByText(/el nombre es requerido/i)).toBeInTheDocument())
  })

  it('muestra error si el email es inválido', async () => {
    renderGestion()
    await waitFor(() => screen.getByRole('button', { name: /nuevo brigadista/i }))
    fireEvent.click(screen.getByRole('button', { name: /nuevo brigadista/i }))
    await waitFor(() => screen.getByRole('heading', { level: 2, name: /nuevo brigadista/i }))
    await userEvent.type(screen.getByPlaceholderText(/ej: carlos rojas/i), 'Pedro')
    await userEvent.type(screen.getByPlaceholderText(/correo@ejemplo/i), 'no-es-email')
    fireEvent.submit(screen.getByRole('button', { name: /registrar brigadista/i }).closest('form'))
    await waitFor(() => expect(screen.getByText(/ingresa un correo válido/i)).toBeInTheDocument())
  })

  it('muestra error si la contraseña tiene menos de 8 caracteres', async () => {
    renderGestion()
    await waitFor(() => screen.getByRole('button', { name: /nuevo brigadista/i }))
    fireEvent.click(screen.getByRole('button', { name: /nuevo brigadista/i }))
    await waitFor(() => screen.getByRole('heading', { level: 2, name: /nuevo brigadista/i }))
    await userEvent.type(screen.getByPlaceholderText(/ej: carlos rojas/i), 'Pedro')
    await userEvent.type(screen.getByPlaceholderText(/correo@ejemplo/i), 'pedro@sifire.cl')
    await userEvent.type(screen.getByPlaceholderText(/mínimo 8 caracteres/i), 'corta')
    fireEvent.click(screen.getByRole('button', { name: /registrar brigadista/i }))
    await waitFor(() => expect(screen.getByText(/mínimo 8 caracteres/i)).toBeInTheDocument())
  })

  it('llama a registrarUsuario con tipo BRIGADISTA al enviar datos válidos', async () => {
    registrarUsuario.mockResolvedValue({ id: 3, nombre: 'Pedro Soto', tipo: 'BRIGADISTA' })
    renderGestion()
    await waitFor(() => screen.getByRole('button', { name: /nuevo brigadista/i }))
    fireEvent.click(screen.getByRole('button', { name: /nuevo brigadista/i }))
    await waitFor(() => screen.getByRole('heading', { level: 2, name: /nuevo brigadista/i }))
    await userEvent.type(screen.getByPlaceholderText(/ej: carlos rojas/i), 'Pedro Soto')
    await userEvent.type(screen.getByPlaceholderText(/correo@ejemplo/i), 'pedro@sifire.cl')
    await userEvent.type(screen.getByPlaceholderText(/mínimo 8 caracteres/i), 'Password123')
    fireEvent.click(screen.getByRole('button', { name: /registrar brigadista/i }))
    await waitFor(() =>
      expect(registrarUsuario).toHaveBeenCalledWith(
        expect.objectContaining({ tipo: 'BRIGADISTA', email: 'pedro@sifire.cl' })
      )
    )
  })

  it('cierra el formulario al hacer clic en Cancelar', async () => {
    renderGestion()
    await waitFor(() => screen.getByRole('button', { name: /nuevo brigadista/i }))
    fireEvent.click(screen.getByRole('button', { name: /nuevo brigadista/i }))
    await waitFor(() => screen.getByRole('heading', { level: 2, name: /nuevo brigadista/i }))
    // El Cancelar del form interno es el último de los dos en el DOM
    const botonesCancelar = screen.getAllByRole('button', { name: /cancelar/i })
    fireEvent.click(botonesCancelar[botonesCancelar.length - 1])
    // Verificamos que el <h2> del formulario desapareció (no el botón del header)
    await waitFor(() =>
      expect(screen.queryByRole('heading', { level: 2, name: /nuevo brigadista/i })).not.toBeInTheDocument()
    )
  })
})

describe('GestionBrigadistas — tab Brigadas', () => {
  beforeEach(() => {
    vi.clearAllMocks(); localStorage.clear()
    listarUsuarios.mockResolvedValue([])
    fetch.mockResolvedValue({ ok: true, json: async () => brigadasMock })
  })

  it('cambia al tab de Brigadas al hacer clic', async () => {
    renderGestion()
    await waitFor(() => screen.getByRole('button', { name: /^brigadas$/i }))
    fireEvent.click(screen.getByRole('button', { name: /^brigadas$/i }))
    await waitFor(() => expect(screen.getByText('Brigada Norte')).toBeInTheDocument())
  })

  it('muestra el tipo y estado de la brigada en la tabla', async () => {
    renderGestion()
    await waitFor(() => screen.getByRole('button', { name: /^brigadas$/i }))
    fireEvent.click(screen.getByRole('button', { name: /^brigadas$/i }))
    await waitFor(() => {
      expect(screen.getByText('FORESTAL')).toBeInTheDocument()
      expect(screen.getByText('DISPONIBLE')).toBeInTheDocument()
    })
  })

  it('muestra "Sin brigadas registradas" cuando no hay datos', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => [] })
    renderGestion()
    await waitFor(() => screen.getByRole('button', { name: /^brigadas$/i }))
    fireEvent.click(screen.getByRole('button', { name: /^brigadas$/i }))
    await waitFor(() => expect(screen.getByText(/sin brigadas registradas/i)).toBeInTheDocument())
  })
})
