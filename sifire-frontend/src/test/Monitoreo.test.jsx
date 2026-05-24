import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import MapaIncendios from '../pages/Monitoreo'

// Mocks de servicios — no queremos llamadas reales al backend
vi.mock('../services/reporte.service', () => ({ listarReportes: vi.fn() }))
vi.mock('../services/monitoreo.service', () => ({
  listarZonas: vi.fn(),
  listarBrigadas: vi.fn(),
  listarRutas: vi.fn(),
}))
import { listarReportes } from '../services/reporte.service'
import { listarZonas, listarBrigadas, listarRutas } from '../services/monitoreo.service'

// Mock de react-leaflet — jsdom no tiene canvas, así que reemplazamos
// cada componente con un div simple que mantiene los datos importantes
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="mapa-container">{children}</div>,
  TileLayer: () => null,
  Circle: ({ center, radius, pathOptions }) => (
    <div data-testid="circle"
      data-lat={center[0]} data-lng={center[1]}
      data-radius={radius} data-color={pathOptions?.color} />
  ),
  Marker: ({ position, eventHandlers, children }) => (
    <div data-testid="marker"
      data-lat={position[0]} data-lng={position[1]}
      onClick={eventHandlers?.click}>
      {children}
    </div>
  ),
  Popup:    ({ children }) => <div data-testid="popup">{children}</div>,
  Polygon:  ({ children }) => <div data-testid="polygon">{children}</div>,
  Polyline: ({ children }) => <div data-testid="polyline">{children}</div>,
}))

// Mock de leaflet — evita que explote al intentar cargar íconos PNG
vi.mock('leaflet', () => ({
  default: { Icon: { Default: { prototype: {}, mergeOptions: vi.fn() } }, divIcon: vi.fn(() => ({})) },
  Icon:    { Default: { prototype: {}, mergeOptions: vi.fn() } },
  divIcon: vi.fn(() => ({})),
}))
vi.mock('leaflet/dist/images/marker-icon-2x.png', () => ({ default: '' }))
vi.mock('leaflet/dist/images/marker-icon.png',    () => ({ default: '' }))
vi.mock('leaflet/dist/images/marker-shadow.png',  () => ({ default: '' }))

// Mock de geolocalización — fijamos Santiago de Chile como posición
Object.defineProperty(global.navigator, 'geolocation', {
  value: { getCurrentPosition: vi.fn(ok => ok({ coords: { latitude: -33.4944, longitude: -70.617 } })) },
  writable: true,
})

// Datos reutilizables para los tests
const reportes = [
  { id: 1, titulo: 'Incendio Cerro',    latitud: -33.49, longitud: -70.61, nivelRiesgo: 'alto',  estado: 'ACTIVO',   descripcion: 'Foco activo', fechaCreacion: '2024-01-01T10:00:00Z' },
  { id: 2, titulo: 'Incendio Valle',    latitud: -33.50, longitud: -70.62, nivelRiesgo: 'medio', estado: 'ACTIVO',   descripcion: 'En control',  fechaCreacion: '2024-01-02T08:00:00Z' },
  { id: 3, titulo: 'Incendio Resuelto', latitud: -33.51, longitud: -70.63, nivelRiesgo: 'bajo',  estado: 'RESUELTO', descripcion: 'Controlado',  fechaCreacion: '2024-01-03T09:00:00Z' },
]

function renderMapa(usuario = {}) {
  localStorage.setItem('sifire_user', JSON.stringify({ tipo: 'CIUDADANO', nombre: 'Mati', ...usuario }))
  return render(<MemoryRouter><AuthProvider><MapaIncendios /></AuthProvider></MemoryRouter>)
}

function serviciosVacios() {
  listarReportes.mockResolvedValue([])
  listarBrigadas.mockResolvedValue([])
  listarZonas.mockResolvedValue([])
  listarRutas.mockResolvedValue([])
}

// ── Suite 1: el mapa carga correctamente ─────────────────────────────────────
describe('MapaIncendios — carga inicial', () => {
  beforeEach(() => { vi.clearAllMocks(); localStorage.clear(); serviciosVacios() })

  it('renderiza el mapa', async () => {
    renderMapa()
    await waitFor(() => expect(screen.getByTestId('mapa-container')).toBeInTheDocument())
  })

  it('muestra la leyenda con los 4 niveles', async () => {
    renderMapa()
    await waitFor(() => {
      expect(screen.getByText('Foco Alto')).toBeInTheDocument()
      expect(screen.getByText('Foco Medio')).toBeInTheDocument()
      expect(screen.getByText('Foco Bajo')).toBeInTheDocument()
      expect(screen.getByText('Resuelto')).toBeInTheDocument()
    })
  })
})

// ── Suite 2: círculos de color por nivel de riesgo ───────────────────────────
describe('MapaIncendios — círculos por reporte', () => {
  beforeEach(() => { vi.clearAllMocks(); localStorage.clear(); serviciosVacios()
    listarReportes.mockResolvedValue(reportes)
  })

  it('pinta un círculo por cada reporte', async () => {
    renderMapa()
    await waitFor(() => expect(screen.getAllByTestId('circle')).toHaveLength(3))
  })

  it('nivel alto → rojo #ef4444', async () => {
    renderMapa()
    await waitFor(() => {
      const c = screen.getAllByTestId('circle').find(el => el.dataset.lat === '-33.49')
      expect(c).toHaveAttribute('data-color', '#ef4444')
    })
  })

  it('nivel medio → naranja #f97316', async () => {
    renderMapa()
    await waitFor(() => {
      const c = screen.getAllByTestId('circle').find(el => el.dataset.lat === '-33.5')
      expect(c).toHaveAttribute('data-color', '#f97316')
    })
  })

  it('estado RESUELTO → verde #22c55e', async () => {
    renderMapa()
    await waitFor(() => {
      const c = screen.getAllByTestId('circle').find(el => el.dataset.lat === '-33.51')
      expect(c).toHaveAttribute('data-color', '#22c55e')
    })
  })

  it('sin reportes no aparecen círculos', async () => {
    listarReportes.mockResolvedValue([])
    renderMapa()
    await waitFor(() => screen.getByTestId('mapa-container'))
    expect(screen.queryAllByTestId('circle')).toHaveLength(0)
  })
})

// ── Suite 3: panel de detalle al clickear un marcador ────────────────────────
describe('MapaIncendios — panel de detalle', () => {
  beforeEach(() => { vi.clearAllMocks(); localStorage.clear(); serviciosVacios()
    listarReportes.mockResolvedValue(reportes)
  })

  it('se abre al clickear un marcador', async () => {
    renderMapa()
    await waitFor(() => screen.getAllByTestId('marker'))
    fireEvent.click(screen.getAllByTestId('marker')[0])
    await waitFor(() =>
      expect(screen.getByText((_, n) => n.tagName === 'P' && /nivel de riesgo/i.test(n.textContent)))
        .toBeInTheDocument()
    )
  })

  it('muestra el estado del reporte', async () => {
    renderMapa()
    await waitFor(() => screen.getAllByTestId('marker'))
    fireEvent.click(screen.getAllByTestId('marker')[0])
    await waitFor(() =>
      expect(screen.getByText((_, n) =>
        n.tagName === 'P' && n.textContent.includes('Estado:') && n.textContent.includes('ACTIVO')
      )).toBeInTheDocument()
    )
  })

  it('se cierra con el botón ✕', async () => {
    renderMapa()
    await waitFor(() => screen.getAllByTestId('marker'))
    fireEvent.click(screen.getAllByTestId('marker')[0])
    await waitFor(() => screen.getByText('Incendio Cerro'))
    fireEvent.click(screen.getByRole('button', { name: /✕/i }))
    await waitFor(() => expect(screen.queryByText('Incendio Cerro')).not.toBeInTheDocument())
  })
})

// ── Suite 4: visibilidad según rol del usuario ────────────────────────────────
describe('MapaIncendios — permisos por rol', () => {
  beforeEach(() => {
    vi.clearAllMocks(); localStorage.clear(); serviciosVacios()
    listarBrigadas.mockResolvedValue([
      { id: 1, nombre: 'Brigada Norte', tipo: 'Forestal', estado: 'ACTIVO', latitud: -33.49, longitud: -70.61 },
    ])
  })

  it('CIUDADANO no ve las brigadas ni rutas de evacuación', async () => {
    renderMapa({ tipo: 'CIUDADANO' })
    await waitFor(() => screen.getByTestId('mapa-container'))
    expect(screen.queryByText(/brigada activa/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/ruta evacuación/i)).not.toBeInTheDocument()
  })

  it('FUNCIONARIO sí ve brigadas y rutas de evacuación', async () => {
    renderMapa({ tipo: 'FUNCIONARIO' })
    await waitFor(() => {
      expect(screen.getByText(/brigada activa/i)).toBeInTheDocument()
      expect(screen.getByText(/ruta evacuación/i)).toBeInTheDocument()
    })
  })
})