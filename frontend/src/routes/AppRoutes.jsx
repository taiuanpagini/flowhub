import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login';
import ExpositorDashboard from '../modules/expositor/pages/Dashboard';
import OperadorScanner from '../modules/operador/pages/Scanner';
import QRCodeGenerator from '../modules/operador/pages/QRCodeGenerator';
import PainelKanban from '../modules/cozinha/pages/PainelKanban';
import MinhasSolicitacoes from '../modules/cozinha/pages/MinhasSolicitacoes';
import AdminDashboard from '../modules/administrador/pages/Dashboard';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.redirectTo} replace />;
  }
  
  return children;
};

export default function AppRoutes() {
  const { user, isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Route */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to={user.redirectTo} replace /> : <Login />
        } 
      />
      
      {/* Expositor Routes */}
      <Route
        path="/expositor/*"
        element={
          <PrivateRoute allowedRoles={['Expositor']}>
            <Routes>
              <Route path="dashboard" element={<ExpositorDashboard />} />
              <Route path="*" element={<Navigate to="/expositor/dashboard" replace />} />
            </Routes>
          </PrivateRoute>
        }
      />
      
      {/* Operador Routes */}
      <Route
        path="/operador/*"
        element={
          <PrivateRoute allowedRoles={['Operador']}>
            <Routes>
              <Route path="scanner" element={<OperadorScanner />} />
              <Route path="qrcodes" element={<QRCodeGenerator />} />
              <Route path="*" element={<Navigate to="/operador/scanner" replace />} />
            </Routes>
          </PrivateRoute>
        }
      />
      
      {/* Cozinha Routes */}
      <Route
        path="/cozinha/*"
        element={
          <PrivateRoute allowedRoles={['Supervisor_Cozinha', 'Garcom']}>
            <Routes>
              <Route path="painel" element={<PainelKanban />} />
              <Route path="minhas-solicitacoes" element={<MinhasSolicitacoes />} />
              <Route path="*" element={<Navigate to="/cozinha/painel" replace />} />
            </Routes>
          </PrivateRoute>
        }
      />
      
      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute allowedRoles={['Administrador']}>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </PrivateRoute>
        }
      />
      
      {/* Default Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
