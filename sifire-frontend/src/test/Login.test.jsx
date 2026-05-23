// render  -> función que monta el componente en un DOM simulado (jsdom)
// screen  -> objeto que representa lo que el "usuario ve" en pantalla,
//           expone métodos para buscar elementos: getByRole, getByText, etc.
import { render, screen } from '@testing-library/react'

// userEvent -> simula interacciones reales del usuario (tipear, hacer click, etc.)
// Es más fiel al comportamiento real que fireEvent (dispara eventos completos)
import userEvent from '@testing-library/user-event'

// describe -> agrupa tests relacionados bajo un mismo nombre
// it       -> define un test individual (alias de "test")
// expect   -> hace una aserción: "espero que esto sea verdad"
import { describe, it, expect } from 'vitest'
// MemoryRouter -> versión de React Router que no usa el navegador real,
// simula la navegación en memoria. Necesario porque Login usa <Link> o useNavigate()
import { MemoryRouter } from 'react-router-dom'
// El contexto de autenticación que envuelve la app en producción.
// Login llama useAuth() internamente, así que necesita este provider presente
import { AuthProvider } from '../context/AuthContext'
// El componente que vamos a testear
import Login from '../pages/Login'

// Función auxiliar reutilizable en todos los tests de este archivo.
// Evita repetir los 3 wrappers (AuthProvider + MemoryRouter) en cada test.
// Simula el árbol de componentes que Login tendría en producción real.
function renderLogin() {
  return render(
    <AuthProvider>       {/* provee el contexto de autenticación */}
      <MemoryRouter>     {/* provee el contexto de routing sin navegador */}
        <Login />        {/* el componente bajo prueba */}
      </MemoryRouter>
    </AuthProvider>
  )
}

// Parte de Testeo XD

// describe() agrupa los tests del componente Login.
// El string es el nombre que aparece en el reporte cuando corres "npm run test"
describe('Login component', () => {

  // ── TEST 1 
  // Verifica que el formulario tenga todos sus elementos esenciales al cargar
  it('muestra el formulario de login', () => {
    renderLogin() // monta el componente
    // getByRole busca por rol ARIA semántico — la forma más accesible de buscar
    // { name: /SIFIRE/i } → el texto del elemento debe coincidir (sin importar mayúsculas)
    expect(screen.getByRole('heading', { name: /SIFIRE/i })).toBeInTheDocument()
    // getByLabelText busca el <input> asociado a un <label> con ese texto
    // Es la mejor forma de buscar inputs: verifica que el label esté correctamente vinculado
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    // Busca el botón por su texto visible
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument()
    // toBeInTheDocument() → matcher de jest-dom, confirma que el elemento existe en el DOM
  })


  // ── TEST 2
  // Verifica que el link de registro esté presente y sea clickeable
  it('muestra el link de registro', () => {
    renderLogin()
    // getByRole('link') busca etiquetas <a>
    // { name: /regístrate/i } → el texto visible del enlace
    expect(screen.getByRole('link', { name: /regístrate/i })).toBeInTheDocument()
  })


  // ── TEST 3 
  // Verifica que el campo email responde correctamente al tipeo del usuario
  it('permite escribir en el campo email', async () => {
    // async porque userEvent.type() es una promesa (simula tecla por tecla)
    renderLogin()
    // Obtiene referencia al input de email
    const emailInput = screen.getByLabelText(/correo electrónico/i)
    // userEvent.type() simula que el usuario escribe caracter por caracter
    // Más realista que .value = '...' porque dispara keydown, keypress, keyup, change
    await userEvent.type(emailInput, 'mati@sifire.cl')
    // toHaveValue() → matcher de jest-dom, verifica el valor actual del input
    expect(emailInput).toHaveValue('mati@sifire.cl')
  })


  // ── TEST 4
  // Verifica que el campo contraseña responde correctamente al tipeo del usuario
  it('permite escribir en el campo contraseña', async () => {
    renderLogin()
    const passInput = screen.getByLabelText(/contraseña/i)
    await userEvent.type(passInput, 'mi_password')
    // Aunque el input sea type="password" (muestra ●●●), el valor interno sigue siendo texto
    expect(passInput).toHaveValue('mi_password')
  })

})

// hola si ven esto :D