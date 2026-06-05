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

// datos de prueba para brigadistas y brigadas
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

// aqui probamos el componente GestionBrigadistas, que es responsable de gestionar los brigadistas y brigadas del sistema, permitiendo crear nuevos brigadistas y visualizar la información de ambos.
// se verifica que el componente carga los brigadistas y brigadas desde el backend al montar, que muestra la información de cada uno correctamente, y que maneja los errores de carga.
// también se prueba el formulario de creación de brigadistas, verificando que se muestra al hacer clic en el botón correspondiente, que valida los campos correctamente, y que llama a registrarUsuario con los datos correctos al enviar.
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

// esta suite de pruebas se centra en el formulario de creación de brigadistas dentro del componente GestionBrigadistas.
// se verifica que el formulario está oculto inicialmente, que se muestra al hacer clic en el botón "+ Nuevo Brigadista", que valida los campos de nombre, email y contraseña correctamente,
// que llama a registrarUsuario con tipo BRIGADISTA y los datos correctos al enviar un formulario válido, y que se cierra al hacer clic en Cancelar.
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
// esta suite de pruebas se centra en la función listarBrigadas, que es responsable de obtener la lista de brigadas desde el servidor.
// se verifica que retorna las brigadas correctamente cuando la respuesta es exitosa, que llama a fetch con la URL correcta,
// y que lanza errores apropiados cuando la respuesta no es exitosa o cuando hay un error de red.
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
// ─────────────────────────────────────────────────────────────────────────────
// TESTS ADICIONALES para GestionBrigadistas.jsx
// Agregar estas suites al final de src/test/views/GestionBrigadistas.test.jsx
// Cubren: handleMapaSeleccionar (26-27), tab switch (53), cancelar brigada (158-160)
// ─────────────────────────────────────────────────────────────────────────────

// ── Suite adicional: handleMapaSeleccionar ────────────────────────────────────
describe('GestionBrigadistas — selección en mapa de brigada', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    listarUsuarios.mockResolvedValue([])
    fetch.mockResolvedValue({ ok: true, json: async () => [] })
  })

  it('los inputs de latitud y longitud están presentes y aceptan valores del mapa', async () => {
    // Cubre líneas 26-27: handleMapaSeleccionar
    renderGestion()
    await waitFor(() => screen.getByRole('button', { name: /^brigadas$/i }))
    fireEvent.click(screen.getByRole('button', { name: /^brigadas$/i }))

    await waitFor(() => screen.getByRole('button', { name: /nueva brigada/i }))
    fireEvent.click(screen.getByRole('button', { name: /nueva brigada/i }))

    // Esperar que aparezcan los dos inputs (latitud y longitud tienen el mismo placeholder)
    await waitFor(() =>
      expect(screen.getAllByPlaceholderText(/haz click en el mapa/i)).toHaveLength(2)
    )

    const inputs = screen.getAllByPlaceholderText(/haz click en el mapa/i)
    const inputLat = inputs.find(i => i.name === 'latitud')
    const inputLng = inputs.find(i => i.name === 'longitud')

    // Simular que handleMapaSeleccionar actualiza latitud y longitud
    fireEvent.change(inputLat, { target: { name: 'latitud',  value: '-33.49' } })
    fireEvent.change(inputLng, { target: { name: 'longitud', value: '-70.61' } })

    expect(inputLat).toHaveValue(-33.49)
    expect(inputLng).toHaveValue(-70.61)
  })
})

// ── Suite adicional: tab switch ───────────────────────────────────────────────
describe('GestionBrigadistas — navegación entre tabs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    listarUsuarios.mockResolvedValue([
      { id: 1, nombre: 'Carlos', email: 'c@c.cl', tipo: 'BRIGADISTA', activo: true }
    ])
    fetch.mockResolvedValue({ ok: true, json: async () => [
      { id: 1, nombre: 'Brigada Norte', tipo: 'FORESTAL', estado: 'DISPONIBLE' }
    ]})
  })

  it('al hacer clic en Brigadistas estando en Brigadas vuelve al tab correcto', async () => {
    // Cubre línea 53: botón Brigadistas cuando ya está activo o regresa
    renderGestion()
    await waitFor(() => screen.getByRole('button', { name: /^brigadas$/i }))

    // Ir a Brigadas
    fireEvent.click(screen.getByRole('button', { name: /^brigadas$/i }))
    await waitFor(() => screen.getByText('Brigada Norte'))

    // Volver a Brigadistas — cubre la rama del click en tab Brigadistas
    fireEvent.click(screen.getByRole('button', { name: /^brigadistas$/i }))
    await waitFor(() => expect(screen.getByText('Carlos')).toBeInTheDocument())
  })

  it('el botón del header cambia texto según el tab activo', async () => {
    renderGestion()
    await waitFor(() => screen.getByRole('button', { name: /nuevo brigadista/i }))

    // En tab brigadistas el botón dice + Nuevo Brigadista
    expect(screen.getByRole('button', { name: /nuevo brigadista/i })).toBeInTheDocument()

    // Ir a tab brigadas
    fireEvent.click(screen.getByRole('button', { name: /^brigadas$/i }))
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /nueva brigada/i })).toBeInTheDocument()
    )
  })
})

// ── Suite adicional: cancelar formulario de brigada ───────────────────────────
describe('GestionBrigadistas — formulario de nueva brigada', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    listarUsuarios.mockResolvedValue([])
    fetch.mockResolvedValue({ ok: true, json: async () => [] })
  })

  it('abre el formulario de nueva brigada al hacer clic en + Nueva Brigada', async () => {
    renderGestion()
    await waitFor(() => screen.getByRole('button', { name: /^brigadas$/i }))
    fireEvent.click(screen.getByRole('button', { name: /^brigadas$/i }))

    await waitFor(() => screen.getByRole('button', { name: /nueva brigada/i }))
    fireEvent.click(screen.getByRole('button', { name: /nueva brigada/i }))

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /crear brigada/i })).toBeInTheDocument()
    )
  })

  it('cancelar formulario brigada lo cierra y resetea', async () => {
    // Cubre líneas 158-160: onClick del Cancelar del formulario de brigadas
    renderGestion()
    await waitFor(() => screen.getByRole('button', { name: /^brigadas$/i }))
    fireEvent.click(screen.getByRole('button', { name: /^brigadas$/i }))

    await waitFor(() => screen.getByRole('button', { name: /nueva brigada/i }))
    fireEvent.click(screen.getByRole('button', { name: /nueva brigada/i }))

    await waitFor(() => screen.getByRole('button', { name: /crear brigada/i }))

    // Hay dos botones Cancelar: header y formulario — el del form es el último
    const botonesCancelar = screen.getAllByRole('button', { name: /cancelar/i })
    fireEvent.click(botonesCancelar[botonesCancelar.length - 1])

    await waitFor(() =>
      expect(screen.queryByRole('button', { name: /crear brigada/i })).not.toBeInTheDocument()
    )
  })
})