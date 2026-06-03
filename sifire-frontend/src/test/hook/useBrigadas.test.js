import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useBrigadas } from '../../hooks/useBrigadas'

global.fetch = vi.fn()

const brigadasMock = [
  { id: 1, nombre: 'Brigada Norte', tipo: 'FORESTAL', estado: 'DISPONIBLE', latitud: -33.45, longitud: -70.65 },
  { id: 2, nombre: 'Brigada Sur',   tipo: 'URBANA',   estado: 'EN_CAMINO',  latitud: -33.50, longitud: -70.60 },
]

// ── Suite 1: carga inicial ────────────────────────────────────────────────────
describe('useBrigadas — carga inicial', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fetch.mockResolvedValue({ ok: true, json: async () => brigadasMock })
  })

  it('inicia con loadingData en true', () => {
    const { result } = renderHook(() => useBrigadas())
    expect(result.current.loadingData).toBe(true)
  })

  it('carga las brigadas al montar', async () => {
    const { result } = renderHook(() => useBrigadas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    expect(result.current.brigadas).toHaveLength(2)
    expect(result.current.brigadas[0].nombre).toBe('Brigada Norte')
  })

  it('llama a fetch con la URL correcta', async () => {
    const { result } = renderHook(() => useBrigadas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/monitoreo/brigadas'))
  })

  it('establece brigadas como array vacío si la respuesta no es array', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ error: 'bad' }) })
    const { result } = renderHook(() => useBrigadas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    expect(result.current.brigadas).toEqual([])
  })

  it('establece brigadas vacío si fetch falla', async () => {
    fetch.mockRejectedValue(new Error('Network error'))
    const { result } = renderHook(() => useBrigadas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    expect(result.current.brigadas).toEqual([])
  })

  it('establece brigadas vacío si la respuesta no es ok', async () => {
    fetch.mockResolvedValue({ ok: false })
    const { result } = renderHook(() => useBrigadas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    expect(result.current.brigadas).toEqual([])
  })
})

// ── Suite 2: handleChange ─────────────────────────────────────────────────────
describe('useBrigadas — handleChange', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fetch.mockResolvedValue({ ok: true, json: async () => [] })
  })

  it('actualiza el campo nombre del form', async () => {
    const { result } = renderHook(() => useBrigadas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    act(() => {
      result.current.handleChange({ target: { name: 'nombre', value: 'Brigada Test' } })
    })
    expect(result.current.form.nombre).toBe('Brigada Test')
  })

  it('limpia el error del campo al escribir en él', async () => {
    const { result } = renderHook(() => useBrigadas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    act(() => result.current.setErrors({ nombre: 'Error previo' }))
    act(() => {
      result.current.handleChange({ target: { name: 'nombre', value: 'Brigada Test' } })
    })
    expect(result.current.errors.nombre).toBe('')
  })

  it('actualiza el campo tipo correctamente', async () => {
    const { result } = renderHook(() => useBrigadas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    act(() => {
      result.current.handleChange({ target: { name: 'tipo', value: 'URBANA' } })
    })
    expect(result.current.form.tipo).toBe('URBANA')
  })
})

// ── Suite 3: validate / handleSubmit ──────────────────────────────────────────
describe('useBrigadas — handleSubmit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fetch.mockResolvedValue({ ok: true, json: async () => [] })
  })

  it('muestra error si nombre está vacío al enviar', async () => {
    const { result } = renderHook(() => useBrigadas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    const fakeEvent = { preventDefault: vi.fn() }
    await act(async () => { result.current.handleSubmit(fakeEvent) })
    expect(result.current.errors.nombre).toBeTruthy()
  })

  it('llama a fetch POST al enviar datos válidos', async () => {
    const nuevaBrigada = { id: 3, nombre: 'Nueva', tipo: 'FORESTAL', estado: 'DISPONIBLE' }
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => nuevaBrigada })

    const { result } = renderHook(() => useBrigadas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    act(() => {
      result.current.handleChange({ target: { name: 'nombre', value: 'Nueva' } })
    })
    const fakeEvent = { preventDefault: vi.fn() }
    await act(async () => { await result.current.handleSubmit(fakeEvent) })
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/monitoreo/brigadas'),
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('agrega la nueva brigada al estado tras POST exitoso', async () => {
    const nuevaBrigada = { id: 3, nombre: 'Nueva', tipo: 'FORESTAL', estado: 'DISPONIBLE' }
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => nuevaBrigada })

    const { result } = renderHook(() => useBrigadas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    act(() => {
      result.current.handleChange({ target: { name: 'nombre', value: 'Nueva' } })
    })
    const fakeEvent = { preventDefault: vi.fn() }
    await act(async () => { await result.current.handleSubmit(fakeEvent) })
    expect(result.current.brigadas[0].nombre).toBe('Nueva')
  })

  it('muestra error.form si el POST falla', async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: false })

    const { result } = renderHook(() => useBrigadas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    act(() => {
      result.current.handleChange({ target: { name: 'nombre', value: 'Nueva' } })
    })
    const fakeEvent = { preventDefault: vi.fn() }
    await act(async () => { await result.current.handleSubmit(fakeEvent) })
    expect(result.current.errors.form).toBeTruthy()
  })

  it('activa exito y lo resetea después de 3 segundos', async () => {
    const nuevaBrigada = { id: 3, nombre: 'Nueva', tipo: 'FORESTAL', estado: 'DISPONIBLE' }
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => nuevaBrigada })

    // Montar con timers REALES para que waitFor funcione
    const { result } = renderHook(() => useBrigadas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))

    // Activar fake timers DESPUÉS de la carga inicial
    vi.useFakeTimers()

    act(() => {
      result.current.handleChange({ target: { name: 'nombre', value: 'Nueva' } })
    })
    const fakeEvent = { preventDefault: vi.fn() }
    await act(async () => { await result.current.handleSubmit(fakeEvent) })

    expect(result.current.exito).toBe(true)
    act(() => vi.advanceTimersByTime(3000))
    expect(result.current.exito).toBe(false)
  })

  afterEach(() => {
    // Garantiza restauración de timers aunque el test falle
    vi.useRealTimers()
  })
})

// ── Suite 4: setShowForm / setForm ────────────────────────────────────────────
describe('useBrigadas — estado del form', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Garantizar que los timers son reales al inicio de cada test
    vi.useRealTimers()
    fetch.mockResolvedValue({ ok: true, json: async () => [] })
  })

  it('showForm inicia en false', async () => {
    const { result } = renderHook(() => useBrigadas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    expect(result.current.showForm).toBe(false)
  })

  it('setShowForm cambia el estado del formulario', async () => {
    const { result } = renderHook(() => useBrigadas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    act(() => result.current.setShowForm(true))
    expect(result.current.showForm).toBe(true)
  })

  it('resetea el form al llamar setForm con initialForm', async () => {
    const { result } = renderHook(() => useBrigadas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    act(() => result.current.handleChange({ target: { name: 'nombre', value: 'Cambiado' } }))
    act(() => result.current.setForm({ nombre: '', tipo: 'FORESTAL', estado: 'DISPONIBLE', latitud: '', longitud: '' }))
    expect(result.current.form.nombre).toBe('')
  })
})