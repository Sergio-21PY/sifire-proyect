import { describe, it, expect, vi, beforeEach } from 'vitest'
import { listarAlertas, crearAlerta } from '../../services/alerta.service'

global.fetch = vi.fn()

const alertasMock = [
  { id: 1, titulo: 'Evacuación Norte', estado: 'ENVIADA', canal: 'EMAIL' },
  { id: 2, titulo: 'Alerta Sur',       estado: 'PENDIENTE', canal: 'SMS' },
]

// esta suite de pruebas se centra en el servicio de alertas, específicamente en las funciones listarAlertas y crearAlerta.
// se verifica que listarAlertas retorna la lista de alertas correctamente cuando la respuesta es exitosa,
// que llama a fetch con la URL correcta, y que lanza errores apropiados cuando la respuesta no es exitosa o cuando hay un error de red.
// para crearAlerta, se verifica que retorna la alerta creada correctamente, que llama a fetch con método POST y los headers adecuados,
// que envía el body serializado como JSON, y que lanza errores apropiados cuando la respuesta no es exitosa.

describe('alerta.service — listarAlertas', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retorna la lista de alertas cuando la respuesta es ok', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => alertasMock })
    const result = await listarAlertas()
    expect(result).toHaveLength(2)
    expect(result[0].titulo).toBe('Evacuación Norte')
  })

  it('llama a fetch con la URL correcta', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => [] })
    await listarAlertas()
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/alertas')
    )
  })

  it('lanza error cuando la respuesta no es ok', async () => {
    fetch.mockResolvedValue({ ok: false })
    await expect(listarAlertas()).rejects.toThrow('Error al listar las alertas')
  })

  it('lanza error cuando fetch falla por red', async () => {
    fetch.mockRejectedValue(new Error('Network error'))
    await expect(listarAlertas()).rejects.toThrow('Network error')
  })
})

// esta suite de pruebas se centra en la función crearAlerta, que es responsable de enviar una nueva alerta al servidor para su creación.
// se verifica que retorna la alerta creada correctamente cuando la respuesta es exitosa, que llama a fetch con método POST y los headers adecuados,
// que envía el body serializado como JSON, y que lanza errores apropiados cuando la respuesta no es exitosa.
describe('alerta.service — crearAlerta', () => {
  beforeEach(() => vi.clearAllMocks())

  const nuevaAlerta = { titulo: 'Nueva Alerta', mensaje: 'Evacuación urgente', canal: 'EMAIL' }

  it('retorna la alerta creada cuando la respuesta es ok', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 3, ...nuevaAlerta }) })
    const result = await crearAlerta(nuevaAlerta)
    expect(result.id).toBe(3)
    expect(result.titulo).toBe('Nueva Alerta')
  })

  it('llama a fetch con método POST', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 3 }) })
    await crearAlerta(nuevaAlerta)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/alertas/crear'),
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('envía el Content-Type application/json', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 3 }) })
    await crearAlerta(nuevaAlerta)
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' })
      })
    )
  })

  it('envía el body serializado como JSON', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 3 }) })
    await crearAlerta(nuevaAlerta)
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ body: JSON.stringify(nuevaAlerta) })
    )
  })

  it('lanza error cuando la respuesta no es ok', async () => {
    fetch.mockResolvedValue({ ok: false })
    await expect(crearAlerta(nuevaAlerta)).rejects.toThrow('Error al crear la alerta')
  })
})