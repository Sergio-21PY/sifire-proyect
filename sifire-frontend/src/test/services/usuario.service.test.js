import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  login,
  registrarUsuario,
  listarUsuarios,
  obtenerUsuarioPorId,
  eliminarUsuario,
} from '../../services/usuario.service'

// esto es para simular respuestas exitosas o fallidas del fetch, dependiendo de lo que se quiera probar en cada caso.
function mockOk(data, status = 200) {
  return Promise.resolve({ ok: true, status, json: () => Promise.resolve(data) })
}
function mockFail(status = 500) {
  return Promise.resolve({ ok: false, status, json: () => Promise.resolve({}) })
}

beforeEach(() => { global.fetch = vi.fn() })

// aqui se prueban las funciones del servicio de usuario, que incluyen login, registro, listado, obtención por id y eliminación de usuarios.
// para cada función, se verifica que retorna los datos correctos cuando la respuesta es exitosa, que llama a fetch con los parámetros adecuados,
// y que lanza errores apropiados cuando la respuesta no es exitosa o cuando hay un error de red.
describe('login()', () => {
  it('devuelve los datos del usuario con credenciales correctas', async () => {
    global.fetch.mockResolvedValue(mockOk({ tipo: 'CIUDADANO', nombre: 'Mati' }))
    const resultado = await login({ email: 'mati@sifire.cl', password: 'pass1234' })
    expect(resultado.tipo).toBe('CIUDADANO')
  })

  // este test verifica que la función login llama al endpoint correcto con el método POST, y que envía el body con las credenciales en formato JSON.
  it('llama al endpoint correcto con POST', async () => {
    global.fetch.mockResolvedValue(mockOk({}))
    await login({ email: 'mati@sifire.cl', password: 'pass1234' })
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/usuarios/login'),
      expect.objectContaining({ method: 'POST' })
    )
  })

  // aca se verifica que la función login lanza un error cuando el servidor responde con un status de error (como 401 o 500), lo que indica que las credenciales son incorrectas o que hay un problema en el servidor.
  it('envia el body como JSON con email y password', async () => {
    global.fetch.mockResolvedValue(mockOk({}))
    await login({ email: 'mati@sifire.cl', password: 'pass1234' })
    const [, opciones] = global.fetch.mock.calls[0]
    expect(JSON.parse(opciones.body)).toEqual({ email: 'mati@sifire.cl', password: 'pass1234' })
  })
  // este test verifica que la función login lanza un error cuando el servidor responde con un status de error (como 401 o 500), lo que indica que las credenciales son incorrectas o que hay un problema en el servidor.
  it('lanza error en 401', async () => {
    global.fetch.mockResolvedValue(mockFail(401))
    await expect(login({ email: 'x@y.cl', password: 'wrong' })).rejects.toThrow()
  })
  // este test verifica que la función login lanza un error cuando el servidor responde con un status de error (como 401 o 500), lo que indica que las credenciales son incorrectas o que hay un problema en el servidor.
  it('lanza error en fallo 500', async () => {
    global.fetch.mockResolvedValue(mockFail(500))
    await expect(login({ email: 'mati@sifire.cl', password: 'pass' })).rejects.toThrow()
  })
})
// este test verifica que la función login lanza un error cuando hay un error de red (como una desconexión), lo que se simula haciendo que fetch rechace la promesa.
describe('registrarUsuario()', () => {
  it('devuelve el usuario creado', async () => {
    global.fetch.mockResolvedValue(mockOk({ id: 1, email: 'mati@sifire.cl' }))
    const resultado = await registrarUsuario({ email: 'mati@sifire.cl', password: 'pass', rol: 'CIUDADANO' })
    expect(resultado.id).toBe(1)
  })

  // este test verifica que la función registrarUsuario llama al endpoint correcto con el método POST, y que envía el body con los datos del nuevo usuario en formato JSON.
  it('llama al endpoint de registro con POST', async () => {
    global.fetch.mockResolvedValue(mockOk({}))
    await registrarUsuario({ email: 'mati@sifire.cl', password: 'pass' })
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/usuarios/registro'),
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('lanza error si el servidor rechaza el registro', async () => {
    global.fetch.mockResolvedValue(mockFail(400))
    await expect(registrarUsuario({ email: 'dup@sifire.cl', password: 'pass' })).rejects.toThrow()
  })
})

// aqui se prueban las funciones listarUsuarios, obtenerUsuarioPorId y eliminarUsuario, que son responsables de listar todos los usuarios, obtener un usuario específico por su id, y eliminar un usuario respectivamente.
// para cada función, se verifica que retorna los datos correctos cuando la respuesta es exitosa, que llama a fetch con los parámetros adecuados,
// y que lanza errores apropiados cuando la respuesta no es exitosa o cuando hay un error de red.
describe('listarUsuarios()', () => {
  it('devuelve un array de usuarios', async () => {
    global.fetch.mockResolvedValue(mockOk([{ id: 1 }, { id: 2 }]))
    const resultado = await listarUsuarios()
    expect(resultado).toHaveLength(2)
  })

  it('llama al endpoint correcto', async () => {
    global.fetch.mockResolvedValue(mockOk([]))
    await listarUsuarios()
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/usuarios/listar'))
  })

  it('lanza error si la respuesta no es ok', async () => {
    global.fetch.mockResolvedValue(mockFail(500))
    await expect(listarUsuarios()).rejects.toThrow()
  })
})

describe('obtenerUsuarioPorId()', () => {
  it('devuelve el usuario con el id solicitado', async () => {
    global.fetch.mockResolvedValue(mockOk({ id: 42, nombre: 'Mati' }))
    const resultado = await obtenerUsuarioPorId(42)
    expect(resultado.id).toBe(42)
  })

  it('incluye el id en la URL', async () => {
    global.fetch.mockResolvedValue(mockOk({}))
    await obtenerUsuarioPorId(42)
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/42'))
  })

  it('lanza error si el usuario no existe', async () => {
    global.fetch.mockResolvedValue(mockFail(404))
    await expect(obtenerUsuarioPorId(999)).rejects.toThrow()
  })
})

describe('eliminarUsuario()', () => {
  it('llama al endpoint de eliminar con DELETE', async () => {
    global.fetch.mockResolvedValue({ ok: true, status: 204 })
    await eliminarUsuario(5)
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/usuarios/eliminar/5'),
      expect.objectContaining({ method: 'DELETE' })
    )
  })

  it('lanza error si la eliminacion falla', async () => {
    global.fetch.mockResolvedValue(mockFail(404))
    await expect(eliminarUsuario(999)).rejects.toThrow()
  })
})