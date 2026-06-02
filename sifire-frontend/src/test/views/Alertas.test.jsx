import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import Alertas from '../../pages/Alertas'

vi.mock('axios')
import axios from 'axios'

vi.mock('../../components/reportes/MapaSelector', () => ({
  default: ({ onSeleccionar }) => (
    <div data-testid="mapa-selector">
      <button onClick={() => onSeleccionar('-33.49', '-70.61')}>Simular selección</button>
    </div>
  ),
}))

const alertasMock = [
  { id: 1, titulo: 'Evacuación Sector Norte', mensaje: 'Evacúe inmediatamente', canal: 'EMAIL', estado: 'ENVIADA',   createdAt: '2024-01-01T10:00:00Z' },
  { id: 2, titulo: 'Alerta Sector Sur',       mensaje: 'Manténgase informado',  canal: 'SMS',   estado: 'PENDIENTE', createdAt: '2024-01-02T08:00:00Z' },
]

function renderAlertas(tipoUsuario = 'CIUDADANO') {
  localStorage.setItem('sifire_user', JSON.stringify({ id: 1, nombre: 'Ana', tipo: tipoUsuario }))
  return render(<MemoryRouter><AuthProvider><Alertas /></AuthProvider></MemoryRouter>)
}

describe('Alertas — renderizado inicial', () => {
  beforeEach(() => { vi.clearAllMocks(); localStorage.clear(); axios.get.mockResolvedValue({ data: alertasMock }) })

  it('muestra el título Alertas a la Comunidad', async () => {
    renderAlertas()
    await waitFor(() => expect(screen.getByRole('heading', { name: /alertas a la comunidad/i })).toBeInTheDocument())
  })

  it('llama a axios.get para cargar las alertas al montar', async () => {
    renderAlertas()
    await waitFor(() => expect(axios.get).toHaveBeenCalled())
  })

  it('muestra la lista de alertas recibidas del backend', async () => {
    renderAlertas()
    await waitFor(() => {
      expect(screen.getByText(/evacuación sector norte/i)).toBeInTheDocument()
      expect(screen.getByText(/alerta sector sur/i)).toBeInTheDocument()
    })
  })

  it('muestra "No hay alertas para mostrar" cuando la lista está vacía', async () => {
    axios.get.mockResolvedValue({ data: [] })
    renderAlertas()
    await waitFor(() => expect(screen.getByText(/no hay alertas para mostrar/i)).toBeInTheDocument())
  })

  it('muestra error cuando el backend falla', async () => {
    axios.get.mockRejectedValue(new Error('Network error'))
    renderAlertas()
    await waitFor(() => expect(screen.getByText(/no se pudieron cargar las alertas/i)).toBeInTheDocument())
  })
})

describe('Alertas — permisos por rol', () => {
  beforeEach(() => { vi.clearAllMocks(); localStorage.clear(); axios.get.mockResolvedValue({ data: alertasMock }) })

  it('CIUDADANO NO ve el formulario para emitir alertas', async () => {
    renderAlertas('CIUDADANO')
    await waitFor(() => screen.getByText(/alertas a la comunidad/i))
    expect(screen.queryByRole('heading', { name: /emitir nueva alerta/i })).not.toBeInTheDocument()
  })

  it('BRIGADISTA NO ve el formulario para emitir alertas', async () => {
    renderAlertas('BRIGADISTA')
    await waitFor(() => screen.getByText(/alertas a la comunidad/i))
    expect(screen.queryByRole('button', { name: /emitir alerta/i })).not.toBeInTheDocument()
  })

  it('FUNCIONARIO SÍ ve el formulario para emitir alertas', async () => {
    renderAlertas('FUNCIONARIO')
    await waitFor(() => expect(screen.getByRole('heading', { name: /emitir nueva alerta/i })).toBeInTheDocument())
    expect(screen.getByRole('button', { name: /emitir alerta/i })).toBeInTheDocument()
  })

  it('ADMINISTRADOR NO ve el formulario de emisión', async () => {
    renderAlertas('ADMINISTRADOR')
    await waitFor(() => screen.getByText(/alertas a la comunidad/i))
    expect(screen.queryByRole('button', { name: /emitir alerta/i })).not.toBeInTheDocument()
  })

  it('ADMINISTRADOR ve el botón Asignar Brigada en alertas procesables', async () => {
    axios.get.mockResolvedValue({ data: [{ id: 1, titulo: 'Alerta', mensaje: 'Msg', estado: 'PENDIENTE', canal: 'EMAIL', createdAt: '2024-01-01T10:00:00Z' }] })
    renderAlertas('ADMINISTRADOR')
    await waitFor(() => expect(screen.getByRole('button', { name: /asignar brigada/i })).toBeInTheDocument())
  })
})

describe('Alertas — formulario de emisión (FUNCIONARIO)', () => {
  beforeEach(() => { vi.clearAllMocks(); localStorage.clear(); axios.get.mockResolvedValue({ data: [] }); axios.post.mockResolvedValue({ data: { id: 10 } }) })

  it('tiene campos de título y mensaje', async () => {
    renderAlertas('FUNCIONARIO')
    await waitFor(() => screen.getByRole('heading', { name: /emitir nueva alerta/i }))
    expect(screen.getByPlaceholderText(/título de la alerta/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/mensaje para la comunidad/i)).toBeInTheDocument()
  })

  it('muestra el mapa selector para elegir ubicación', async () => {
    renderAlertas('FUNCIONARIO')
    await waitFor(() => expect(screen.getByTestId('mapa-selector')).toBeInTheDocument())
  })

  it('rellena latitud y longitud al seleccionar en el mapa', async () => {
    renderAlertas('FUNCIONARIO')
    await waitFor(() => screen.getByTestId('mapa-selector'))
    fireEvent.click(screen.getByRole('button', { name: /simular selección/i }))
    expect(screen.getByPlaceholderText(/latitud/i)).toHaveValue('-33.49')
    expect(screen.getByPlaceholderText(/longitud/i)).toHaveValue('-70.61')
  })

  it('llama a axios.post al enviar el formulario con datos válidos', async () => {
    renderAlertas('FUNCIONARIO')
    await waitFor(() => screen.getByRole('heading', { name: /emitir nueva alerta/i }))
    await userEvent.type(screen.getByPlaceholderText(/título de la alerta/i), 'Evacuación urgente')
    await userEvent.type(screen.getByPlaceholderText(/mensaje para la comunidad/i), 'Evacúe el sector')
    fireEvent.click(screen.getByRole('button', { name: /emitir alerta/i }))
    await waitFor(() => expect(axios.post).toHaveBeenCalled())
  })

  it('muestra mensaje de éxito tras emitir la alerta', async () => {
    renderAlertas('FUNCIONARIO')
    await waitFor(() => screen.getByRole('heading', { name: /emitir nueva alerta/i }))
    await userEvent.type(screen.getByPlaceholderText(/título de la alerta/i), 'Evacuación urgente')
    await userEvent.type(screen.getByPlaceholderText(/mensaje para la comunidad/i), 'Evacúe el sector')
    fireEvent.click(screen.getByRole('button', { name: /emitir alerta/i }))
    await waitFor(() => expect(screen.getByText(/alerta emitida correctamente/i)).toBeInTheDocument())
  })

  it('muestra error si el post falla', async () => {
    axios.post.mockRejectedValue(new Error('Error'))
    renderAlertas('FUNCIONARIO')
    await waitFor(() => screen.getByRole('heading', { name: /emitir nueva alerta/i }))
    await userEvent.type(screen.getByPlaceholderText(/título de la alerta/i), 'Alerta')
    await userEvent.type(screen.getByPlaceholderText(/mensaje para la comunidad/i), 'Mensaje')
    fireEvent.click(screen.getByRole('button', { name: /emitir alerta/i }))
    await waitFor(() => expect(screen.getByText(/no se pudo emitir la alerta/i)).toBeInTheDocument())
  })
})

describe('Alertas — filtros de estado', () => {
  beforeEach(() => { vi.clearAllMocks(); localStorage.clear(); axios.get.mockResolvedValue({ data: alertasMock }) })

  it('muestra todas las alertas con filtro TODOS activo', async () => {
    renderAlertas()
    await waitFor(() => {
      expect(screen.getByText(/evacuación sector norte/i)).toBeInTheDocument()
      expect(screen.getByText(/alerta sector sur/i)).toBeInTheDocument()
    })
  })

  it('filtra por PENDIENTE correctamente', async () => {
    renderAlertas()
    await waitFor(() => screen.getByText(/evacuación sector norte/i))
    fireEvent.click(screen.getByRole('button', { name: /pendiente/i }))
    await waitFor(() => {
      expect(screen.getByText(/alerta sector sur/i)).toBeInTheDocument()
      expect(screen.queryByText(/evacuación sector norte/i)).not.toBeInTheDocument()
    })
  })
})
