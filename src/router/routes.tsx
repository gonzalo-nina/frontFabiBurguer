// src/routes/routes.tsx
import { RouteObject } from 'react-router-dom';
import { usuario } from '../types/usuario';
import LoginPage from '../pages/loginPage';
import DashboardPage from '../pages/DashboardPage';
import ProductoSection from '../components/ProductoSection';
import UsuarioSection from '../components/UsuarioSection';
import ClienteSection from '../components/ClienteSection';
import CatalogoSection from '../components/CatalogoSection';
import PedidosSection from '../components/PedidoSection';
import ProtectedRoute from './ProyecyedRoute';
import Layout from '../components/layout';
import { Navigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

const createRoutes = (
  isAuthenticated: boolean, 
  currentUser: any, 
  handleLogout: () => void,
  handleLoginSuccess: (user: usuario) => void // Add this parameter
) => {
  const routes: RouteObject[] = [
    {
      path: '/login',
      element: !isAuthenticated ? (
        <LoginPage onLogin={handleLoginSuccess} /> // Pass the handler here
      ) : (
        <Navigate to="/dashboard" />
      ),
    },
    {
      path: '/',
      element: <Navigate to="/dashboard" replace />
    },
    {
      path: '/',
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Layout username={currentUser?.usuario || ''} onLogout={handleLogout}>
            <Outlet />
          </Layout>
        </ProtectedRoute>
      ),
      children: [
        {
          path: 'dashboard',
          element: <DashboardPage />
        },
        {
          path: 'productos',
          element: <ProductoSection />,
        },
        {
          path: 'clientes',
          element: <ClienteSection />,
        },
        {
          path: 'catalogos',
          element: <CatalogoSection />,
        },
        {
          path: '',
          element: <Navigate to="/dashboard" replace />,
        },
        {
          path: 'pedidos',
          element: <PedidosSection />,
        },
        {
          path: 'usuario',
          element: <UsuarioSection />,
        },
      ],
    },
  ];

  return routes;
};

export default createRoutes;