import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// como funciona esto: RutaProtegida recibe un componente (element) y un array de roles permitidos (rolesPermitidos).   
// rolesPermitidos: array de roles que pueden acceder, ej: ['FUNCIONARIO']
// Si no se pasa rolesPermitidos, solo requiere estar autenticado
export default function RutaProtegida({ element, rolesPermitidos }) {
  const { usuario, estaAutenticado } = useAuth();

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }
  if (rolesPermitidos && !rolesPermitidos.includes(usuario.tipo)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return element;
}