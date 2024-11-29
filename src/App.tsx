import React, { useState, useEffect } from 'react';
import Login from './components/login';
import { usuario } from './types/usuario';
import auth from './servicio/auth';
import './App.css'; // Importa el archivo CSS
import grungeBackground from './IMG/grunge-background-ideal-halloween.jpg'; // Importa la imagen

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<usuario | null>(null);

  useEffect(() => {
    const user = auth.getCurrentUser();
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
    }
  }, []);

  const handleLoginSuccess = (user: usuario) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    alert(`Bienvenido, ${user.usuario}`);
  };

  const handleLogout = () => {
    auth.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <div style={{ backgroundImage: `url(${grungeBackground})` }} className="app-background">
      {!isAuthenticated ? (
        <Login onLogin={handleLoginSuccess} error="" />
      ) : (
        <div>
          <h1>Bienvenido, {currentUser?.usuario}</h1>
          <button onClick={handleLogout} className="btn btn-primary">Logout</button>
          {/* Aquí puedes agregar el contenido que deseas mostrar después de iniciar sesión */}
        </div>
      )}
    </div>
  );
};

export default App;