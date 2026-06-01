import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import RutaProtegida from '../components/RutaProtegida'

const Contenido      = () => <div data-testid="contenido-protegido">Acceso concedido</div>
const PaginaLogin    = () => <div data-testid="pagina-login">Login</div>
const PaginaNoAuth   = () => <div data-testid="pagina-no-autorizado">No autorizado</div>

function renderRuta({ usuario = null, rolesPermitidos = undefined } = {}) {
  if (usuario) localStorage.setItem('sifire_user', JSON.stringify(usuario))
  return render(
    <MemoryRouter initialEntries={['/protegida']}>
      <AuthProvider>
        <Routes>
          <Route path="/protegida" element={
            <RutaProtegida element={<Contenido />} rolesPermitidos={rolesPermitidos} />
          } />
          <Route path="/login"          element={<PaginaLogin />} />
          <Route path="/no-autorizado"  element={<PaginaNoAuth />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('RutaProtegida — sin sesion', () => {
  beforeEach(() => localStorage.clear())

  it('redirige a /login si no hay sesion', () => {
    renderRuta()
    expect(screen.getByTestId('pagina-login')).toBeInTheDocument()
    expect(screen.queryByTestId('contenido-protegido')).not.toBeInTheDocument()
  })

  it('redirige a /login aunque rolesPermitidos este definido', () => {
    renderRuta({ rolesPermitidos: ['FUNCIONARIO'] })
    expect(screen.getByTestId('pagina-login')).toBeInTheDocument()
  })
})

describe('RutaProtegida — autenticado sin restriccion de rol', () => {
  afterEach(() => localStorage.clear())

  it('muestra el contenido para cualquier usuario autenticado', () => {
    renderRuta({ usuario: { tipo: 'CIUDADANO', nombre: 'Mati' } })
    expect(screen.getByTestId('contenido-protegido')).toBeInTheDocument()
  })

  it('muestra el contenido para FUNCIONARIO sin restriccion de rol', () => {
    renderRuta({ usuario: { tipo: 'FUNCIONARIO', nombre: 'Admin' } })
    expect(screen.getByTestId('contenido-protegido')).toBeInTheDocument()
  })
})

describe('RutaProtegida — control por rol', () => {
  afterEach(() => localStorage.clear())

  it('permite acceso cuando el rol esta en rolesPermitidos', () => {
    renderRuta({
      usuario: { tipo: 'FUNCIONARIO', rol: 'FUNCIONARIO', nombre: 'Admin' },
      rolesPermitidos: ['FUNCIONARIO'],
    })
    expect(screen.getByTestId('contenido-protegido')).toBeInTheDocument()
  })

  it('redirige a /no-autorizado cuando el rol no esta permitido', () => {
    renderRuta({
      usuario: { tipo: 'CIUDADANO', rol: 'CIUDADANO', nombre: 'Mati' },
      rolesPermitidos: ['FUNCIONARIO'],
    })
    expect(screen.getByTestId('pagina-no-autorizado')).toBeInTheDocument()
    expect(screen.queryByTestId('contenido-protegido')).not.toBeInTheDocument()
  })

  it('permite acceso con multiples roles validos', () => {
    renderRuta({
      usuario: { tipo: 'BRIGADISTA', rol: 'BRIGADISTA', nombre: 'Juan' },
      rolesPermitidos: ['FUNCIONARIO', 'BRIGADISTA'],
    })
    expect(screen.getByTestId('contenido-protegido')).toBeInTheDocument()
  })

  it('CIUDADANO no accede a ruta exclusiva de FUNCIONARIO o BRIGADISTA', () => {
    renderRuta({
      usuario: { tipo: 'CIUDADANO', rol: 'CIUDADANO', nombre: 'Mati' },
      rolesPermitidos: ['FUNCIONARIO', 'BRIGADISTA'],
    })
    expect(screen.getByTestId('pagina-no-autorizado')).toBeInTheDocument()
  })
})