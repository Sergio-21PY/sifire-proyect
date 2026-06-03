import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  listarReportes,
  crearReporte,
  subirFotoReporte,
  cambiarEstadoReporte,
} from '../../services/reporte.service'

global.fetch = vi.fn()

const reportesMock = [
  { id: 1, titulo: 'Incendio Norte', estado: 'PENDIENTE', nivelRiesgo: 'ALTO' },
  { id: 2, titulo: 'Incendio Sur',   estado: 'EN_PROCESO', nivelRiesgo: 'MEDIO' },
]

// ── listarReportes 
// aqui se prueba la función listarReportes, que es responsable de obtener la lista de reportes desde el servidor.
// se verifica que retorna los reportes correctamente cuando la respuesta es exitosa, que llama a fetch con la URL correcta,
// y que lanza errores apropiados cuando la respuesta no es exitosa o cuando hay un error de red.
describe('reporte.service — listarReportes', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retorna la lista de reportes cuando la respuesta es ok', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => reportesMock })
    const result = await listarReportes()
    expect(result).toHaveLength(2)
    expect(result[0].titulo).toBe('Incendio Norte')
  })

  it('llama a fetch con la URL correcta', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => [] })
    await listarReportes()
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/reportes'))
  })

  it('lanza error cuando la respuesta no es ok', async () => {
    fetch.mockResolvedValue({ ok: false })
    await expect(listarReportes()).rejects.toThrow('Error al listar los reportes')
  })

  it('lanza error cuando fetch falla por red', async () => {
    fetch.mockRejectedValue(new Error('Network error'))
    await expect(listarReportes()).rejects.toThrow('Network error')
  })
})

// ── crearReporte 
// aqui se prueba la función crearReporte, que es responsable de enviar un nuevo reporte al servidor para su creación.
// se verifica que retorna el reporte creado correctamente cuando la respuesta es exitosa, que llama a fetch con método POST y los headers adecuados,
// que envía el body serializado como JSON, y que lanza errores apropiados cuando la respuesta no es exitosa.

describe('reporte.service — crearReporte', () => {
  beforeEach(() => vi.clearAllMocks())

  const nuevoReporte = { titulo: 'Incendio Test', descripcion: 'Foco activo', nivelRiesgo: 'ALTO' }

  it('retorna el reporte creado cuando la respuesta es ok', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 10, ...nuevoReporte }) })
    const result = await crearReporte(nuevoReporte)
    expect(result.id).toBe(10)
    expect(result.titulo).toBe('Incendio Test')
  })

  it('llama a fetch con método POST', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 10 }) })
    await crearReporte(nuevoReporte)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/reportes/crear'),
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('envía Content-Type application/json', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 10 }) })
    await crearReporte(nuevoReporte)
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' })
      })
    )
  })

  it('envía el body serializado como JSON', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 10 }) })
    await crearReporte(nuevoReporte)
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ body: JSON.stringify(nuevoReporte) })
    )
  })

  it('lanza error cuando la respuesta no es ok', async () => {
    fetch.mockResolvedValue({ ok: false })
    await expect(crearReporte(nuevoReporte)).rejects.toThrow('Error al crear el reporte')
  })
})

// ── subirFotoReporte 
// para este apartado lo que se prueba es la función subirFotoReporte, que es responsable de subir una foto asociada a un reporte específico.
// se verifica que retorna la respuesta del servidor correctamente cuando la foto se sube exitosamente, que llama a fetch con método POST y la URL correcta,
// que envía un FormData como body (sin Content-Type manual, ya que el browser lo setea), y que lanza errores apropiados cuando la respuesta no es exitosa.
describe('reporte.service — subirFotoReporte', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retorna la respuesta cuando la foto se sube correctamente', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ url: 'foto.jpg' }) })
    const archivo = new File(['contenido'], 'foto.jpg', { type: 'image/jpeg' })
    const result = await subirFotoReporte(1, archivo)
    expect(result.url).toBe('foto.jpg')
  })

  it('llama a fetch con método POST a la URL correcta', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ url: 'foto.jpg' }) })
    const archivo = new File(['contenido'], 'foto.jpg', { type: 'image/jpeg' })
    await subirFotoReporte(5, archivo)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/reportes/5/subir-foto'),
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('envía un FormData como body (sin Content-Type manual)', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ url: 'foto.jpg' }) })
    const archivo = new File(['contenido'], 'foto.jpg', { type: 'image/jpeg' })
    await subirFotoReporte(1, archivo)
    const llamada = fetch.mock.calls[0][1]
    expect(llamada.body).toBeInstanceOf(FormData)
    // No debe incluir Content-Type manual — el browser lo setea con el boundary
    expect(llamada.headers).toBeUndefined()
  })

  it('lanza error cuando la respuesta no es ok', async () => {
    fetch.mockResolvedValue({ ok: false })
    const archivo = new File(['contenido'], 'foto.jpg', { type: 'image/jpeg' })
    await expect(subirFotoReporte(1, archivo)).rejects.toThrow('Error al subir la foto')
  })
})

// ── cambiarEstadoReporte
// aqui se prueba la función cambiarEstadoReporte, que es responsable de cambiar el estado de un reporte específico.
// se verifica que retorna el reporte actualizado correctamente cuando la respuesta es exitosa, que llama a fetch con método PUT y la URL correcta,
// que envía el nuevo estado en el body como JSON, y que lanza errores apropiados cuando la respuesta no es exitosa o cuando hay un error de red.

describe('reporte.service — cambiarEstadoReporte', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retorna el reporte actualizado cuando la respuesta es ok', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 1, estado: 'RESUELTO' }) })
    const result = await cambiarEstadoReporte(1, 'RESUELTO')
    expect(result.estado).toBe('RESUELTO')
  })

  it('llama a fetch con método PUT a la URL correcta', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) })
    await cambiarEstadoReporte(1, 'RESUELTO')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/reportes/1/estado'),
      expect.objectContaining({ method: 'PUT' })
    )
  })

  it('envía el nuevo estado en el body', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) })
    await cambiarEstadoReporte(1, 'DESCARTADO')
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: JSON.stringify({ nuevoEstado: 'DESCARTADO' })
      })
    )
  })

  it('lanza error cuando la respuesta no es ok', async () => {
    fetch.mockResolvedValue({ ok: false })
    await expect(cambiarEstadoReporte(1, 'RESUELTO')).rejects.toThrow('Error al cambiar el estado del reporte')
  })

  it('lanza error cuando fetch falla por red', async () => {
    fetch.mockRejectedValue(new Error('Network error'))
    await expect(cambiarEstadoReporte(1, 'RESUELTO')).rejects.toThrow('Network error')
  })
})