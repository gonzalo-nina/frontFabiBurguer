// src/routes/routes.tsx
import { RouteObject } from 'react-router-dom';
import { usuario } from '../types/usuario';
import LoginPage from '../pages/loginPage';
import DashboardPage from '../pages/DashboardPage';
import UsuarioSection from '../components/usuario/UsuarioSection';
import PedidosSection from '../components/pedido/PedidoSection';
import ClienteList from '../components/cliente/ClienteList';
import CatalogoList from '../components/catalogo/CatalogoList';
import ProductoList from '../components/producto/ProductoList';
import ProtectedRoute from './ProyecyedRoute';
import Reports from '../components/reports/Reports';
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
          element: <ProductoList />,
        },
        {
          path: 'clientes',
          element: <ClienteList />,
        },
        {
          path: 'catalogos',
          element: <CatalogoList />,
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
        {
          path: 'reports',
          element: <Reports />,
        },
      ],
    },
  ];

  return routes;
};

export default createRoutes;