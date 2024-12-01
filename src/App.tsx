import React, { useState, useEffect } from 'react';
import { useRoutes, useNavigate } from 'react-router-dom';
import { usuario } from './types/usuario';
import auth from './service/auth';
import './App.css';
import './styles/variable.css';
import './styles/common.css';

import grungeBackground from './IMG/grunge-background-ideal-halloween.jpg';
import createRoutes from './router/routes';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<usuario | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.getCurrentUser();
    if (user) {
      console.log('🔄 Usuario recuperado del localStorage:', {
        email: user.email,
        usuario: user.usuario,
        rol: user.rol
      });
      setIsAuthenticated(true);
      setCurrentUser(user);
    }
  }, []);

  const handleLoginSuccess = (user: usuario) => {
    console.log('✅ Login exitoso:', {
      email: user.email,
      usuario: user.usuario,
      rol: user.rol
    });
    setIsAuthenticated(true);
    setCurrentUser(user);
    
    // Mensaje de bienvenida personalizado según el rol
    const rolTexto = user.rol === 'ADMIN' ? 'Administrador' : 'Usuario';
    alert(`Bienvenido ${rolTexto}, ${user.usuario}`);
    
    navigate('/dashboard');
  };

  const handleLogout = () => {
    console.log('👋 Cerrando sesión');
    auth.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const routes = createRoutes(
    isAuthenticated, 
    currentUser, 
    handleLogout,
    handleLoginSuccess
  );
  
  const element = useRoutes(routes);

  return (
    <div style={{ backgroundImage: `url(${grungeBackground})` }} className="app-background">
      {element}
    </div>
  );
};

export default App;