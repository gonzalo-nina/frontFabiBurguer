// src/router/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

const ProtectedRoute = ({ children, isAuthenticated }: ProtectedRouteProps) => {
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;