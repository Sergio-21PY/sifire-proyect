import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Reportes from './pages/Reportes';
import Monitoreo from './pages/Monitoreo';
import Alertas from './pages/Alertas';
import Dashboard from './pages/Dashboard';
import GestionBrigadistas from './pages/GestionBrigadistas';
import GestionUsuarios from './pages/GestionUsuarios';
import MisAsignaciones from './pages/MisAsignaciones';
import NotFound from './pages/404';
import NoAutorizado from './pages/NoAutorizado';
import Footer from './components/FooterComponent';
import NavbarComponent from './components/NavbarComponent';
import RutaProtegida from './components/RutaProtegida';
import './components/FooterComponent.css';

function App() {
  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <NavbarComponent />
      <main className="app-main" style={{ flex: 1 }}>
        <Routes>

          {/* Públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/no-autorizado" element={<NoAutorizado />} />

          {/* Todos los roles autenticados */}
          <Route path="/reportes" element={
            <RutaProtegida rolesPermitidos={['CIUDADANO', 'FUNCIONARIO', 'BRIGADISTA', 'ADMINISTRADOR']} element={<Reportes />} />
          } />
          <Route path="/monitoreo" element={
            <RutaProtegida rolesPermitidos={['CIUDADANO', 'FUNCIONARIO', 'BRIGADISTA', 'ADMINISTRADOR']} element={<Monitoreo />} />
          } />

          {/* Solo Funcionario / Admin */}
          <Route path="/dashboard" element={
            <RutaProtegida rolesPermitidos={['FUNCIONARIO', 'ADMINISTRADOR']} element={<Dashboard />} />
          } />
          <Route path="/brigadistas" element={
            <RutaProtegida rolesPermitidos={['FUNCIONARIO', 'ADMINISTRADOR']} element={<GestionBrigadistas />} />
          } />
          <Route path="/alertas" element={
            <RutaProtegida rolesPermitidos={['FUNCIONARIO', 'ADMINISTRADOR']} element={<Alertas />} />
          } />

          {/* Solo Admin */}
          <Route path="/usuarios" element={
            <RutaProtegida rolesPermitidos={['ADMINISTRADOR']} element={<GestionUsuarios />} />
          } />

          {/* Brigadista */}
          <Route path="/mis-asignaciones" element={
            <RutaProtegida rolesPermitidos={['BRIGADISTA']} element={<MisAsignaciones />} />
          } />

          <Route path="*" element={<NotFound />} />

        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;