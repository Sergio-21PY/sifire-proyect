import { Routes, Route } from 'react-router-dom'
import Login              from './pages/Login'
import Reportes           from './pages/Reportes'
import Monitoreo          from './pages/Monitoreo'
import Alertas            from './pages/Alertas'
import Registro           from './pages/Registro'
import NotFound           from './pages/404'
import Dashboard          from './pages/Dashboard'
import GestionBrigadistas from './pages/GestionBrigadistas'
import MisAsignaciones    from './pages/MisAsignaciones' 
import Footer             from './components/FooterComponent'
import NavbarComponent    from './components/NavbarComponent'
import './components/FooterComponent.css'

function App() {
  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <NavbarComponent />
      <main className="app-main" style={{ flex: 1 }}>
        <Routes>

          {/* Rutas públicas */}
          <Route path="/"                element={<Login />} />
          <Route path="/login"           element={<Login />} />
          <Route path="/registro"        element={<Registro />} />
          <Route path="/reportes"        element={<Reportes />} />
          <Route path="/monitoreo"       element={<Monitoreo />} />
          <Route path="/alertas"         element={<Alertas />} />
          <Route path="/dashboard"       element={<Dashboard />} />
          <Route path="/brigadistas"     element={<GestionBrigadistas />} />
          <Route path="/mis-asignaciones" element={<MisAsignaciones />} /> 
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App