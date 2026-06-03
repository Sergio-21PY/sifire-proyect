import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  listarZonas,
  listarBrigadas,
  listarRutas,
  listarAsignaciones,
  crearAsignacion,
} from '../../services/monitoreo.service'

// aqui van los test del monitoreo
global.fetch = vi.fn()
// datos de ejemplo para las pruebas
const zonasMock     = [{ id: 1, nombre: 'Zona Norte', nivelRiesgo: 'ALTO' }]
const brigadasMock  = [{ id: 1, nombre: 'Brigada Alpha', estado: 'DISPONIBLE' }]
const rutasMock     = [{ id: 1, nombre: 'Ruta 1', coordenadas: '[]' }]
const asignMock     = [{ id: 1, reporteId: 10, brigadaId: 1 }]

// ── listarZonas
// aqui se prueba la función listarZonas, que es responsable de obtener la lista de zonas de riesgo desde el servidor.
// se verifica que retorna las zonas correctamente cuando la respuesta es exitosa, que llama a fetch con la URL correcta,
// y que lanza errores apropiados cuando la respuesta no es exitosa o cuando hay un error de red.
describe('monitoreo.service — listarZonas', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retorna las zonas cuando la respuesta es ok', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => zonasMock })
    const result = await listarZonas()
    expect(result[0].nombre).toBe('Zona Norte')
  })

  it('llama a fetch con la URL de zonas', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => [] })
    await listarZonas()
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/monitoreo/zonas'))
  })

  it('lanza error cuando la respuesta no es ok', async () => {
    fetch.mockResolvedValue({ ok: false })
    await expect(listarZonas()).rejects.toThrow('Error al listar las zonas de riesgo')
  })

  it('lanza error cuando fetch falla por red', async () => {
    fetch.mockRejectedValue(new Error('Network error'))
    await expect(listarZonas()).rejects.toThrow('Network error')
  })
})

// ── listarBrigadas
// aqui se prueba la función listarBrigadas, que es responsable de obtener la lista de brigadas desde el servidor.
// se verifica que retorna las brigadas correctamente cuando la respuesta es exitosa, que llama a fetch con la URL correcta,
// y que lanza errores apropiados cuando la respuesta no es exitosa o cuando hay un error de red.
describe('monitoreo.service — listarBrigadas', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retorna las brigadas cuando la respuesta es ok', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => brigadasMock })
    const result = await listarBrigadas()
    expect(result[0].nombre).toBe('Brigada Alpha')
  })

  it('llama a fetch con la URL de brigadas', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => [] })
    await listarBrigadas()
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/monitoreo/brigadas'))
  })

  it('lanza error cuando la respuesta no es ok', async () => {
    fetch.mockResolvedValue({ ok: false })
    await expect(listarBrigadas()).rejects.toThrow('Error al listar las brigadas')
  })
})

// ── listarRutas
// aqui se prueba la función listarRutas, que es responsable de obtener la lista de rutas desde el servidor.
// se verifica que retorna las rutas correctamente cuando la respuesta es exitosa, que llama a fetch con la URL correcta,
// y que lanza errores apropiados cuando la respuesta no es exitosa o cuando hay un error de red.
// en este caso, se espera que si la respuesta no es ok o si hay un error de red, la función retorne un array vacío en lugar de lanzar un error.
describe('monitoreo.service — listarRutas', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retorna las rutas cuando la respuesta es ok', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => rutasMock })
    const result = await listarRutas()
    expect(result[0].nombre).toBe('Ruta 1')
  })

  it('retorna array vacío cuando la respuesta no es ok (no lanza error)', async () => {
    fetch.mockResolvedValue({ ok: false })
    const result = await listarRutas()
    expect(result).toEqual([])
  })

  it('retorna array vacío cuando fetch falla por red (no lanza error)', async () => {
    fetch.mockRejectedValue(new Error('Network error'))
    const result = await listarRutas()
    expect(result).toEqual([])
  })

  it('llama a fetch con la URL de rutas', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => [] })
    await listarRutas()
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/monitoreo/rutas'))
  })
})

// ── listarAsignaciones
// aqui se prueba la función listarAsignaciones, que es responsable de obtener la lista de asignaciones de brigadas a reportes desde el servidor.
// se verifica que retorna las asignaciones correctamente cuando la respuesta es exitosa, que llama a fetch con la URL correcta,
// y que lanza errores apropiados cuando la respuesta no es exitosa o cuando hay un error de red.

describe('monitoreo.service — listarAsignaciones', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retorna las asignaciones cuando la respuesta es ok', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => asignMock })
    const result = await listarAsignaciones()
    expect(result[0].reporteId).toBe(10)
  })

  it('llama a fetch con la URL de asignaciones', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => [] })
    await listarAsignaciones()
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/monitoreo/asignaciones'))
  })

  it('lanza error cuando la respuesta no es ok', async () => {
    fetch.mockResolvedValue({ ok: false })
    await expect(listarAsignaciones()).rejects.toThrow('Error al listar las asignaciones')
  })
})

// ── crearAsignacion ───────────────────────────────────────────────────────────
describe('monitoreo.service — crearAsignacion', () => {
  beforeEach(() => vi.clearAllMocks())

  const payload = { reporteId: 10, brigadaId: 1 }

  it('retorna la asignación creada cuando la respuesta es ok', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 5, ...payload }) })
    const result = await crearAsignacion(payload)
    expect(result.id).toBe(5)
  })

  it('llama a fetch con método POST', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 5 }) })
    await crearAsignacion(payload)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/monitoreo/asignaciones'),
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('envía el body serializado como JSON', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 5 }) })
    await crearAsignacion(payload)
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ body: JSON.stringify(payload) })
    )
  })

  it('lanza error cuando la respuesta no es ok', async () => {
    fetch.mockResolvedValue({ ok: false })
    await expect(crearAsignacion(payload)).rejects.toThrow('Error al crear la asignación')
  })
})