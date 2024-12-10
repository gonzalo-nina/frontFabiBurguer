import React, { useState, useEffect } from 'react';
import '../styles/login.css'; // Importa el archivo CSS
import AuthService from '../service/auth';
import { usuario } from '../types/usuario';
import logoImg from '../IMG/imagen_2024-10-28_234052607-removebg-preview.png';
import fabiLogoImg from '../IMG/FabiLogo.jpeg';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LoginProps {
  onLogin: (user: usuario) => void;
  error?: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, error }) => {
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [emailError, setEmailError] = useState('');
  const [claveError, setClaveError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const sanitizeInput = (input: string): string => {
    // Remover caracteres especiales y espacios extras
    return input.replace(/['"\\;`]/g, '').trim();
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedEmail = sanitizeInput(e.target.value);
    setEmail(sanitizedEmail);
    
    if (!sanitizedEmail) {
      setEmailError('El email es requerido');
    } else if (!validateEmail(sanitizedEmail)) {
      setEmailError('Ingrese un email válido (ejemplo@dominio.com)');
    } else {
      setEmailError('');
    }
  };

  const handleClaveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedClave = sanitizeInput(e.target.value);
    setClave(sanitizedClave);
    
    if (!sanitizedClave) {
      setClaveError('La contraseña es requerida');
    } else if (sanitizedClave.length < 3) {
      setClaveError('La contraseña debe tener al menos 3 caracteres');
    } else {
      setClaveError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validaciones antes de intentar login
    if (!validateEmail(email)) {
      toast.error('Por favor ingrese un email válido');
      return;
    }

    if (!clave || clave.length < 3) {
      toast.error('La contraseña debe tener al menos 3 caracteres');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Iniciando sesión...');

    try {
      const user = await AuthService.login(email, clave);
      if (user) {
        toast.update(loadingToast, {
          render: "¡Bienvenido de vuelta! 🎉",
          type: "success",
          isLoading: false,
          autoClose: 3000
        });
        onLogin(user);
      }
    } catch (error: any) {
      toast.update(loadingToast, {
        render: `Error de autenticación: ${error.message || 'Credenciales inválidas'} ❌`,
        type: "error",
        isLoading: false,
        autoClose: 4000
      });
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
                          className={`form-control ${emailError ? 'is-invalid' : ''}`}
                          placeholder="ejemplo@dominio.com"
                          value={email}
                          onChange={handleEmailChange}
                          autoComplete="username"
                          required
                        />
                        {emailError && (
                          <div className="invalid-feedback">
                            {emailError}
                          </div>
                        )}
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="password">
                          Contraseña
                        </label>
                        <input
                          type="password"
                          id="password"
                          className={`form-control ${claveError ? 'is-invalid' : ''}`}
                          value={clave}
                          onChange={handleClaveChange}
                          placeholder='Contraseña'
                          autoComplete="current-password"
                          required
                        />
                        {claveError && (
                          <div className="invalid-feedback">
                            {claveError}
                          </div>
                        )}
                      </div>

                      {error && <div className="alert alert-danger">{error}</div>}

                      <div className="text-center pt-1 mb-5 pb-1">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block botonLogin"
                          disabled={isLoading || !!emailError || !!claveError}
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