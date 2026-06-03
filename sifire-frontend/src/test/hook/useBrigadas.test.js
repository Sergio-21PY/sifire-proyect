import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useBrigadas } from '../../hooks/useBrigadas'

global.fetch = vi.fn()

const brigadasMock = [
  { id: 1, nombre: 'Brigada Norte', tipo: 'FORESTAL', estado: 'DISPONIBLE', latitud: -33.45, longitud: -70.65 },
  { id: 2, nombre: 'Brigada Sur',   tipo: 'URBANA',   estado: 'EN_CAMINO',  latitud: -33.50, longitud: -70.60 },
]

// parte 1: carga inicial
// esta parte consiste en verificar que el hook carga las brigadas correctamente al montarse, maneja los estados de carga y error, 
// y establece el estado inicial del formulario. Se prueba que fetch se llama con la URL correcta y que el estado de brigadas se actualiza 
// según la respuesta del servidor. También se verifica que el estado de loadingData se maneja adecuadamente durante la carga inicial.
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

// parte 2: handleChange
// esta parte se enfoca en probar la función handleChange, que es responsable de actualizar el estado del formulario 
// cuando el usuario escribe en los campos. Se verifica que al cambiar el valor de un campo, el estado form se actualiza correctamente. 
// También se prueba que si hay un error asociado a ese campo, este se limpia al escribir en él.
//  Por ejemplo, si el campo nombre tiene un error y el usuario comienza a escribir en ese campo, el error debe desaparecer.
//  Además, se verifica que otros campos del formulario también se actualizan correctamente al usar handleChange.
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

// Parte 3: validate / handleSubmit
// esta parte se centra en probar la función handleSubmit, que es responsable de validar el formulario y enviar los datos al servidor.
// Se verifica que si el campo nombre está vacío, se muestre un error y no se intente enviar el formulario. 
// También se prueba que si los datos son válidos, se realiza una llamada fetch con método POST a la URL correcta. 
// Además, se verifica que si el POST es exitoso, la nueva brigada se agrega al estado de brigadas y se muestra un mensaje de éxito. 
// Por último, se prueba que si el POST falla, se muestra un error general en el formulario.
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

// Parte 4: setShowForm / setForm
// esta parte se centra en probar las funciones setShowForm y setForm, que son responsables de controlar la visibilidad del formulario y el estado del mismo.
// Se verifica que showForm inicia en false y que al llamar setShowForm(true) cambia a true. 
// También se prueba que al llamar setForm con el estado inicial del formulario, los campos del form se resetean a sus valores iniciales.
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