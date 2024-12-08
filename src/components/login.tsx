import React, { useState } from 'react';
import '../styles/login.css'; // Importa el archivo CSS
import AuthService from '../service/auth';
import { usuario } from '../types/usuario';
import logoImg from '../IMG/imagen_2024-10-28_234052607-removebg-preview.png';
import fabiLogoImg from '../IMG/FabiLogo.jpeg';

interface LoginProps {
  onLogin: (user: usuario) => void;
  error: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, error }) => {
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await AuthService.login(email, clave);
      
      if (user) {
        alert('Login exitoso');
        onLogin(user);
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      alert('Error de autenticación: ' + (error.message || 'Usuario o contraseña incorrectos'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="h-100" style={{ backgroundColor: 'transparent' }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-xl-10">
            <div className="card rounded-3 text-black">
              <div className="row g-0">
                <div className="col-lg-6">
                  <div className="card-body p-md-5 mx-md-4">
                    <div className="text-center">
                      <img
                        src={logoImg}
                        style={{ width: '185px' }}
                        alt="logo"
                      />
                      <h4 className="mt-1 mb-5 pb-1">Iniciar Sesión</h4>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="email">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="form-control"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete="username"
                          required
                        />
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="password">
                          Contraseña
                        </label>
                        <input
                          type="password"
                          id="password"
                          className="form-control"
                          placeholder="Contraseña"
                          value={clave}
                          onChange={(e) => setClave(e.target.value)}
                          autoComplete="current-password"
                          required
                        />
                      </div>

                      {error && <div className="alert alert-danger">{error}</div>}

                      <div className="text-center pt-1 mb-5 pb-1">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block botonLogin"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Cargando...' : 'Ingresar'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="col-lg-6 d-flex align-items-center gradient-custom-2 logo-container">
                  <img className="img-fluid w-100 d-block" src={fabiLogoImg} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;