import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useGestionBrigadistas } from '../../hooks/useGestionBrigadistas'

vi.mock('../../services/usuario.service', () => ({
  listarUsuarios: vi.fn(),
  registrarUsuario: vi.fn(),
}))
import { listarUsuarios, registrarUsuario } from '../../services/usuario.service'

const usuariosMock = [
  { id: 1, nombre: 'Ana',   email: 'ana@sifire.cl',   tipo: 'BRIGADISTA' },
  { id: 2, nombre: 'Juan',  email: 'juan@sifire.cl',  tipo: 'BRIGADISTA' },
  { id: 3, nombre: 'Admin', email: 'admin@sifire.cl', tipo: 'FUNCIONARIO' },
]

beforeEach(() => {
  vi.clearAllMocks()
  listarUsuarios.mockResolvedValue(usuariosMock)
})

// aqui se prueba el hook useGestionBrigadistas, que es responsable de manejar la lógica de gestión de brigadistas en la aplicación.
// se prueba la carga inicial de brigadistas, la validación del formulario, el manejo de cambios en los campos del formulario, 
// el envío del formulario para registrar un nuevo brigadista, y el manejo de errores durante el registro. 
// También se verifica que el estado del formulario y la lista de brigadistas se actualizan correctamente según las acciones realizadas.
describe('useGestionBrigadistas — carga inicial', () => {
  it('loadingData es true antes de resolver', () => {
    listarUsuarios.mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(() => useGestionBrigadistas())
    expect(result.current.loadingData).toBe(true)
  })

  it('carga solo usuarios de tipo BRIGADISTA', async () => {
    const { result } = renderHook(() => useGestionBrigadistas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    expect(result.current.brigadistas).toHaveLength(2)
    expect(result.current.brigadistas.every(b => b.tipo === 'BRIGADISTA')).toBe(true)
  })

  it('loadingData es false tras cargar', async () => {
    const { result } = renderHook(() => useGestionBrigadistas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
  })

  it('maneja error de red sin romper el hook', async () => {
    listarUsuarios.mockRejectedValue(new Error('Network error'))
    const { result } = renderHook(() => useGestionBrigadistas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    expect(result.current.brigadistas).toHaveLength(0)
  })
})

// acá se prueba la función validate, que es responsable de validar los datos del formulario antes de enviarlos.
// se verifica que si el nombre está vacío, se muestre un error. 
// También se prueba que si el email no tiene un formato válido, se muestre un error. 
// Además, se verifica que si el teléfono tiene un formato incorrecto, se muestre un error. 
// Por último, se prueba que si la contraseña es menor a 8 caracteres, se muestre un error.
describe('useGestionBrigadistas — validate()', () => {
  it('rechaza nombre vacio', async () => {
    const { result } = renderHook(() => useGestionBrigadistas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    act(() => result.current.setForm({ nombre: '', email: 'ok@sifire.cl', telefono: '', password: 'pass1234' }))
    await act(async () => { await result.current.handleSubmit({ preventDefault: vi.fn() }) })
    expect(result.current.errors.nombre).toMatch(/nombre es requerido/i)
  })

  it('rechaza email invalido', async () => {
    const { result } = renderHook(() => useGestionBrigadistas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    act(() => result.current.setForm({ nombre: 'Juan', email: 'no-es-email', telefono: '', password: 'pass1234' }))
    await act(async () => { await result.current.handleSubmit({ preventDefault: vi.fn() }) })
    expect(result.current.errors.email).toMatch(/correo válido/i)
  })

  it('rechaza telefono con formato incorrecto', async () => {
    const { result } = renderHook(() => useGestionBrigadistas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    act(() => result.current.setForm({ nombre: 'Juan', email: 'juan@sifire.cl', telefono: '12345678', password: 'pass1234' }))
    await act(async () => { await result.current.handleSubmit({ preventDefault: vi.fn() }) })
    expect(result.current.errors.telefono).toMatch(/formato inválido/i)
  })

  it('acepta telefono vacio sin error', async () => {
    registrarUsuario.mockResolvedValue({ id: 5, tipo: 'BRIGADISTA' })
    const { result } = renderHook(() => useGestionBrigadistas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    act(() => result.current.setForm({ nombre: 'Juan', email: 'juan@sifire.cl', telefono: '', password: 'pass1234' }))
    await act(async () => { await result.current.handleSubmit({ preventDefault: vi.fn() }) })
    expect(result.current.errors.telefono).toBeUndefined()
  })

  it('rechaza contraseña menor a 8 caracteres', async () => {
    const { result } = renderHook(() => useGestionBrigadistas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    act(() => result.current.setForm({ nombre: 'Juan', email: 'juan@sifire.cl', telefono: '', password: 'corto' }))
    await act(async () => { await result.current.handleSubmit({ preventDefault: vi.fn() }) })
    expect(result.current.errors.password).toMatch(/mínimo 8/i)
  })

  it('no llama al servicio si hay errores', async () => {
    const { result } = renderHook(() => useGestionBrigadistas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    act(() => result.current.setForm({ nombre: '', email: '', telefono: '', password: '' }))
    await act(async () => { await result.current.handleSubmit({ preventDefault: vi.fn() }) })
    expect(registrarUsuario).not.toHaveBeenCalled()
  })
})

// en esta parte se prueba la función handleChange, que es responsable de actualizar el estado del formulario cuando el usuario escribe en los campos.
// se verifica que al cambiar el valor de un campo, el estado form se actualiza correctamente. 
// También se prueba que si hay un error asociado a ese campo, este se limpia al escribir en él. 
// Por ejemplo, si el campo nombre tiene un error y el usuario comienza a escribir en ese campo, el error debe desaparecer. 
// Además, se verifica que otros campos del formulario también se actualizan correctamente al usar handleChange.
describe('useGestionBrigadistas — handleChange()', () => {
  it('actualiza el campo del formulario', async () => {
    const { result } = renderHook(() => useGestionBrigadistas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    act(() => result.current.handleChange({ target: { name: 'nombre', value: 'Brigada 1' } }))
    expect(result.current.form.nombre).toBe('Brigada 1')
  })

  it('limpia el error del campo al escribir en el', async () => {
    const { result } = renderHook(() => useGestionBrigadistas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    act(() => result.current.setErrors({ nombre: 'El nombre es requerido.' }))
    act(() => result.current.handleChange({ target: { name: 'nombre', value: 'Nuevo' } }))
    expect(result.current.errors.nombre).toBe('')
  })
})

// en esta parte se centra en probar la función handleSubmit, que es responsable de validar el formulario y enviar los datos al servidor.
// se verifica que si el campo nombre está vacío, se muestre un error y no se intente enviar el formulario.
// También se prueba que si los datos son válidos, se realiza una llamada fetch con método POST a la URL correcta.
// Además, se verifica que si el POST es exitoso, la nueva brigada se agrega al estado de brigadas y se muestra un mensaje de éxito.
// Por último, se prueba que si el POST falla, se muestra un error general en el formulario.
describe('useGestionBrigadistas — handleSubmit() exitoso', () => {
  it('agrega el nuevo brigadista a la lista', async () => {
    const nuevo = { id: 10, nombre: 'Nuevo', email: 'nuevo@sifire.cl', tipo: 'BRIGADISTA' }
    registrarUsuario.mockResolvedValue(nuevo)
    const { result } = renderHook(() => useGestionBrigadistas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    act(() => result.current.setForm({ nombre: 'Nuevo', email: 'nuevo@sifire.cl', telefono: '', password: 'pass1234' }))
    await act(async () => { await result.current.handleSubmit({ preventDefault: vi.fn() }) })
    expect(result.current.brigadistas.some(b => b.id === 10)).toBe(true)
  })

  it('resetea el formulario tras registro exitoso', async () => {
    registrarUsuario.mockResolvedValue({ id: 11, tipo: 'BRIGADISTA' })
    const { result } = renderHook(() => useGestionBrigadistas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    act(() => result.current.setForm({ nombre: 'X', email: 'x@s.cl', telefono: '', password: 'pass1234' }))
    await act(async () => { await result.current.handleSubmit({ preventDefault: vi.fn() }) })
    expect(result.current.form.nombre).toBe('')
    expect(result.current.form.email).toBe('')
  })

  it('cierra el formulario tras registro exitoso', async () => {
    registrarUsuario.mockResolvedValue({ id: 12, tipo: 'BRIGADISTA' })
    const { result } = renderHook(() => useGestionBrigadistas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    act(() => result.current.setShowForm(true))
    act(() => result.current.setForm({ nombre: 'X', email: 'x@s.cl', telefono: '', password: 'pass1234' }))
    await act(async () => { await result.current.handleSubmit({ preventDefault: vi.fn() }) })
    expect(result.current.showForm).toBe(false)
  })

  it('llama a registrarUsuario con tipo BRIGADISTA', async () => {
    registrarUsuario.mockResolvedValue({ id: 13, tipo: 'BRIGADISTA' })
    const { result } = renderHook(() => useGestionBrigadistas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    act(() => result.current.setForm({ nombre: 'Juan', email: 'juan@sifire.cl', telefono: '', password: 'pass1234' }))
    await act(async () => { await result.current.handleSubmit({ preventDefault: vi.fn() }) })
    expect(registrarUsuario).toHaveBeenCalledWith(expect.objectContaining({ tipo: 'BRIGADISTA' }))
  })
})

// en esta parte se prueba la función handleSubmit, que es responsable de validar el formulario y enviar los datos al servidor.
// se verifica que si el campo nombre está vacío, se muestre un error y no se intente enviar el formulario.
// También se prueba que si los datos son válidos, se realiza una llamada fetch con método POST a la URL correcta.
// Además, se verifica que si el POST es exitoso, la nueva brigada se agrega al estado de brigadas y se muestra un mensaje de éxito.
// Por último, se prueba que si el POST falla, se muestra un error general en el formulario.
describe('useGestionBrigadistas — handleSubmit() fallido', () => {
  it('muestra error en errors.form si el servicio falla', async () => {
    registrarUsuario.mockRejectedValue(new Error('Email ya existe'))
    const { result } = renderHook(() => useGestionBrigadistas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    act(() => result.current.setForm({ nombre: 'X', email: 'dup@s.cl', telefono: '', password: 'pass1234' }))
    await act(async () => { await result.current.handleSubmit({ preventDefault: vi.fn() }) })
    expect(result.current.errors.form).toBeTruthy()
  })

  it('loading vuelve a false tras el error', async () => {
    registrarUsuario.mockRejectedValue(new Error('Error'))
    const { result } = renderHook(() => useGestionBrigadistas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    act(() => result.current.setForm({ nombre: 'X', email: 'x@s.cl', telefono: '', password: 'pass1234' }))
    await act(async () => { await result.current.handleSubmit({ preventDefault: vi.fn() }) })
    expect(result.current.loading).toBe(false)
  })
})

// en esta parte se centra en probar la función toggleEstado, que es responsable de cambiar el estado de un brigadista entre ACTIVO e INACTIVO.
// se verifica que al llamar toggleEstado con el id de un brigadista, su estado cambia de ACTIVO a INACTIVO.
// También se prueba que si se llama toggleEstado nuevamente con el mismo id, el estado vuelve a cambiar de INACTIVO a ACTIVO.

describe('useGestionBrigadistas — toggleEstado()', () => {
  it('cambia ACTIVO a INACTIVO', async () => {
    listarUsuarios.mockResolvedValue([{ id: 1, nombre: 'Ana', email: 'a@b.cl', tipo: 'BRIGADISTA' }])
    const { result } = renderHook(() => useGestionBrigadistas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    act(() => result.current.toggleEstado(1))
    expect(result.current.brigadistas[0].estado).toBe('INACTIVO')
  })

  it('cambia INACTIVO de vuelta a ACTIVO', async () => {
    listarUsuarios.mockResolvedValue([{ id: 1, nombre: 'Ana', email: 'a@b.cl', tipo: 'BRIGADISTA' }])
    const { result } = renderHook(() => useGestionBrigadistas())
    await waitFor(() => expect(result.current.loadingData).toBe(false))
    act(() => result.current.toggleEstado(1))
    act(() => result.current.toggleEstado(1))
    expect(result.current.brigadistas[0].estado).toBe('ACTIVO')
  })
})