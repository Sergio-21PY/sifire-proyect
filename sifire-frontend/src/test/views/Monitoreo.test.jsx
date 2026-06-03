import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import MapaIncendios from '../../pages/Monitoreo'

vi.mock('../../services/reporte.service', () => ({ listarReportes: vi.fn() }))
vi.mock('../../services/monitoreo.service', () => ({
  listarZonas: vi.fn(),
  listarBrigadas: vi.fn(),
  listarRutas: vi.fn(),           //  faltaba esto, por eso antes no funcionaba XDXDXDXDDDDDDDDDDDDDDDDD
}))

vi.mock('../../components/FooterComponent', () => ({ default: () => null }))

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
  Popup: ({ children }) => <div data-testid="popup">{children}</div>,
  Polygon: ({ children }) => <div data-testid="polygon">{children}</div>,
  Polyline: ({ children }) => <div data-testid="polyline">{children}</div>,
}))

vi.mock('leaflet', () => ({
  default: { Icon: { Default: { prototype: {}, mergeOptions: vi.fn() } }, divIcon: vi.fn(() => ({})) },
  Icon: { Default: { prototype: {}, mergeOptions: vi.fn() } },
  divIcon: vi.fn(() => ({})),
}))
vi.mock('leaflet/dist/images/marker-icon-2x.png', () => ({ default: '' }))
vi.mock('leaflet/dist/images/marker-icon.png', () => ({ default: '' }))
vi.mock('leaflet/dist/images/marker-shadow.png', () => ({ default: '' }))

Object.defineProperty(global.navigator, 'geolocation', {
  value: { getCurrentPosition: vi.fn(ok => ok({ coords: { latitude: -33.4944, longitude: -70.617 } })) },
  writable: true,
})

const reportes = [
  { id: 1, titulo: 'Incendio Cerro', latitud: -33.49, longitud: -70.61, nivelRiesgo: 'alto', estado: 'ACTIVO', descripcion: 'Foco activo', fechaCreacion: '2024-01-01T10:00:00Z' },
  { id: 2, titulo: 'Incendio Valle', latitud: -33.50, longitud: -70.62, nivelRiesgo: 'medio', estado: 'ACTIVO', descripcion: 'En control', fechaCreacion: '2024-01-02T08:00:00Z' },
  { id: 3, titulo: 'Incendio Sur', latitud: -33.51, longitud: -70.63, nivelRiesgo: 'bajo', estado: 'ACTIVO', descripcion: 'Bajo riesgo', fechaCreacion: '2024-01-03T09:00:00Z' },
]

// ← tipo (no rol) porque el componente usa usuario?.tipo
function renderMapa(usuario = {}) {
  localStorage.setItem('sifire_user', JSON.stringify({ tipo: 'CIUDADANO', nombre: 'Mati', ...usuario }))
  return render(<MemoryRouter><AuthProvider><MapaIncendios /></AuthProvider></MemoryRouter>)
}

import { listarReportes } from '../../services/reporte.service'
import { listarZonas, listarBrigadas, listarRutas } from '../../services/monitoreo.service'

function resetServicios() {
  listarReportes.mockResolvedValue([])
  listarBrigadas.mockResolvedValue([])
  listarZonas.mockResolvedValue([])
  listarRutas.mockResolvedValue([])    // ← añadido
}

// ── modulo 1: carga inicial 
// aqui se prueba la carga inicial del componente MapaIncendios, verificando que renderiza el contenedor del mapa, que muestra la leyenda con los niveles de riesgo, que llama a listarReportes al montar, y que maneja correctamente la respuesta del servicio de listarReportes.
describe('MapaIncendios — carga inicial', () => {
  beforeEach(() => { vi.clearAllMocks(); localStorage.clear(); resetServicios() })

  it('renderiza el contenedor del mapa', async () => {
    renderMapa()
    await waitFor(() => expect(screen.getByTestId('mapa-container')).toBeInTheDocument())
  })

  it('muestra la leyenda con los 4 niveles de riesgo', async () => {
    renderMapa()
    await waitFor(() => {
      expect(screen.getByText('Foco Alto')).toBeInTheDocument()
      expect(screen.getByText('Foco Medio')).toBeInTheDocument()
      expect(screen.getByText('Foco Bajo')).toBeInTheDocument()
      expect(screen.getByText('Resuelto')).toBeInTheDocument()
    })
  })

  it('llama a listarReportes al montar', async () => {
    renderMapa()
    await waitFor(() => expect(listarReportes).toHaveBeenCalled())
  })
})

// ── modulo 2: círculos de color por nivel de riesgo 
// aqui se prueba la función listarReportes, que es responsable de obtener la lista de reportes desde el servidor, y que el componente MapaIncendios pinta un círculo con el color correspondiente al nivel de riesgo de cada reporte.
describe('MapaIncendios — círculos por reporte', () => {
  beforeEach(() => {
    vi.clearAllMocks(); localStorage.clear(); resetServicios()
    listarReportes.mockResolvedValue(reportes)
  })

  it('pinta un círculo por cada reporte', async () => {
    renderMapa()
    await waitFor(() => expect(screen.getAllByTestId('circle')).toHaveLength(3))
  })

  it('nivel alto → rojo #ef4444', async () => {
    renderMapa()
    await waitFor(() => {
      const c = screen.getAllByTestId('circle').find(el => Number(el.dataset.lat) === -33.49)
      expect(c).toHaveAttribute('data-color', '#ef4444')
    })
  })

  it('nivel medio → naranja #f97316', async () => {
    renderMapa()
    await waitFor(() => {
      const c = screen.getAllByTestId('circle').find(el => Number(el.dataset.lat) === -33.5)
      expect(c).toHaveAttribute('data-color', '#f97316')
    })
  })

  it('nivel bajo → amarillo #eab308', async () => {
    renderMapa()
    await waitFor(() => {
      const c = screen.getAllByTestId('circle').find(el => Number(el.dataset.lat) === -33.51)
      expect(c).toHaveAttribute('data-color', '#eab308')
    })
  })

  it('sin reportes no aparecen círculos', async () => {
    listarReportes.mockResolvedValue([])
    renderMapa()
    await waitFor(() => screen.getByTestId('mapa-container'))
    expect(screen.queryAllByTestId('circle')).toHaveLength(0)
  })

  it('reportes sin latitud/longitud son filtrados', async () => {
    listarReportes.mockResolvedValue([
      ...reportes,
      { id: 9, titulo: 'Sin coords', latitud: null, longitud: null, nivelRiesgo: 'alto', estado: 'ACTIVO', descripcion: '' },
    ])
    renderMapa()
    await waitFor(() => expect(screen.getAllByTestId('circle')).toHaveLength(3))
  })
})

// ── modulo 3: panel de detalle al clickear un marcador 
// aqui se prueba que al clickear un marcador en el mapa, se abre un panel de detalle que muestra la información del reporte correspondiente, incluyendo el título, nivel de riesgo, estado, y descripción, y que el panel se cierra al hacer clic en el botón de cerrar.

describe('MapaIncendios — panel de detalle', () => {
  beforeEach(() => {
    vi.clearAllMocks(); localStorage.clear(); resetServicios()
    listarReportes.mockResolvedValue(reportes)
  })

  it('se abre al clickear un marcador y muestra el titulo', async () => {
    renderMapa()
    await waitFor(() => screen.getAllByTestId('marker'))
    fireEvent.click(screen.getAllByTestId('marker')[0])
    await waitFor(() => expect(screen.getByText(/incendio cerro/i)).toBeInTheDocument())
  })

  it('muestra el nivel de riesgo del reporte', async () => {
    renderMapa()
    await waitFor(() => screen.getAllByTestId('marker'))
    fireEvent.click(screen.getAllByTestId('marker')[0])
    await waitFor(() =>
      expect(screen.getByText(/^alto$/i)).toBeInTheDocument()
    )
  })

  it('muestra el estado del reporte', async () => {
    renderMapa()
    await waitFor(() => screen.getAllByTestId('marker'))
    fireEvent.click(screen.getAllByTestId('marker')[0])
    await waitFor(() =>
      expect(screen.getByText(/^activo$/i)).toBeInTheDocument()
    )
  })

  it('se cierra con el boton ✕', async () => {
    renderMapa()
    await waitFor(() => screen.getAllByTestId('marker'))
    fireEvent.click(screen.getAllByTestId('marker')[0])
    await waitFor(() => screen.getByText(/incendio cerro/i))
    fireEvent.click(screen.getByRole('button', { name: /✕/i }))
    await waitFor(() =>
      expect(screen.queryByText(/incendio cerro/i)).not.toBeInTheDocument()
    )
  })
})

// ── modulo 4: visibilidad según rol ───────────────────────────────────────────
describe('MapaIncendios — permisos por rol', () => {
  beforeEach(() => {
    vi.clearAllMocks(); localStorage.clear(); resetServicios()
    listarBrigadas.mockResolvedValue([
      { id: 1, nombre: 'Brigada Norte', tipo: 'Forestal', estado: 'ACTIVO', latitud: -33.49, longitud: -70.61 },
    ])
  })

  it('CIUDADANO no ve el item de brigada en la leyenda', async () => {
    renderMapa({ tipo: 'CIUDADANO' })
    await waitFor(() => screen.getByTestId('mapa-container'))
    expect(screen.queryByText(/brigada activa/i)).not.toBeInTheDocument()
  })

  it('CIUDADANO no ve ruta de evacuacion en la leyenda', async () => {
    renderMapa({ tipo: 'CIUDADANO' })
    await waitFor(() => screen.getByTestId('mapa-container'))
    expect(screen.queryByText(/ruta evacuaci/i)).not.toBeInTheDocument()
  })

  it('FUNCIONARIO ve el item de brigada en la leyenda', async () => {
    renderMapa({ tipo: 'FUNCIONARIO' })           // ← tipo, no rol
    await waitFor(() => {
      expect(screen.getByText(/brigada activa/i)).toBeInTheDocument()
    })
  })

  it('FUNCIONARIO ve la ruta de evacuacion en la leyenda', async () => {
    renderMapa({ tipo: 'FUNCIONARIO' })
    await waitFor(() => {
      expect(screen.getByText(/ruta evacuaci/i)).toBeInTheDocument()   // ← sin tilde
    })
  })

  it('BRIGADISTA ve el item de brigada en la leyenda', async () => {
    renderMapa({ tipo: 'BRIGADISTA' })
    await waitFor(() => {
      expect(screen.getByText(/brigada activa/i)).toBeInTheDocument()
    })
  })
})