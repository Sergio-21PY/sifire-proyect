import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import NoAutorizado from '../../pages/NoAutorizado'

// Mock de useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderNoAutorizado() {
  return render(<MemoryRouter><NoAutorizado /></MemoryRouter>)
}

describe('NoAutorizado — renderizado', () => {
  it('muestra el emoji 🚫', () => {
    renderNoAutorizado()
    expect(screen.getByText('🚫')).toBeInTheDocument()
  })

  it('muestra el heading Acceso no autorizado', () => {
    renderNoAutorizado()
    expect(screen.getByRole('heading', { name: /acceso no autorizado/i })).toBeInTheDocument()
  })

  it('muestra el mensaje de permisos', () => {
    renderNoAutorizado()
    expect(screen.getByText(/no tienes permisos para ver esta página/i)).toBeInTheDocument()
  })

  it('muestra el botón Volver', () => {
    renderNoAutorizado()
    expect(screen.getByRole('button', { name: /volver/i })).toBeInTheDocument()
  })
})

describe('NoAutorizado — navegación', () => {
  it('llama a navigate(-1) al hacer clic en Volver', () => {
    renderNoAutorizado()
    fireEvent.click(screen.getByRole('button', { name: /volver/i }))
    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })
})
