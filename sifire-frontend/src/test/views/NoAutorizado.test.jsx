import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import NoAutorizado from '../../pages/NoAutorizado'

function renderNoAutorizado() {
  return render(
    <MemoryRouter>
      <NoAutorizado />
    </MemoryRouter>
  )
}

describe('NoAutorizado', () => {

  it('muestra el titulo Acceso no autorizado', () => {
    renderNoAutorizado()
    expect(screen.getByRole('heading', { name: /acceso no autorizado/i })).toBeInTheDocument()
  })

  it('muestra el mensaje de sin permisos', () => {
    renderNoAutorizado()
    expect(screen.getByText(/no tienes permisos para ver esta página/i)).toBeInTheDocument()
  })

  it('muestra el boton Volver', () => {
    renderNoAutorizado()
    expect(screen.getByRole('button', { name: /volver/i })).toBeInTheDocument()
  })
})