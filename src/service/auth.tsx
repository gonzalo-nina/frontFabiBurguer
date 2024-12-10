import axios from '../config/axios';
import { jwtDecode } from 'jwt-decode';
import { usuario, UserRoles } from '../types/usuario';
import { toast } from 'react-toastify';

const API_URL = '/api/v1/autenticacion/signin';

interface JWTPayload {
  sub: string;
  rol: string;
  iat: number;
  exp: number;
}

interface JWTPayload {
  [key: string]: any;  // Esto nos permitirá ver todos los campos
}

class AuthService {
  public monitorTokenExpiration(token: string) {
    try {
      const decodedToken = jwtDecode<JWTPayload>(token);
      const currentTime = Date.now() / 1000;
      const timeLeft = decodedToken.exp - currentTime;

      console.log('⏱️ Token expiration:', {
        expiresAt: new Date(decodedToken.exp * 1000).toLocaleString(),
        timeLeft: Math.floor(timeLeft / 60), // minutos restantes
      });

      if (timeLeft > 0) {
        setTimeout(() => {
          console.log('⌛ Token expirado - cerrando sesión');
          this.logout();
          toast.warning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente. ⏰', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          window.location.href = '/login';
        }, timeLeft * 1000);
      } else {
        this.logout();
        toast.warning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente. ⏰', {
          position: "top-center",
          autoClose: 5000
        });
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('❌ Error monitoreando token:', error);
      toast.error('Error al verificar la sesión ❌');
    }
  }

  async login(email: string, clave: string): Promise<usuario | null> {
    try {
      const response = await axios.post(API_URL, { email, clave }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      if (response.data.jwt) {
        const token = response.data.jwt;
        const decodedToken = jwtDecode<JWTPayload>(token);
        
        const posiblesRoles = ['rol', 'role', 'authorities', 'scope', 'permission'];
        let userRole = null;
        
        for (const rolKey of posiblesRoles) {
          if (decodedToken[rolKey]) {
            userRole = decodedToken[rolKey];
            break;
          }
        }

        const userData: usuario = {
          email,
          usuario: response.data.username,
          clave,
          token: response.data.jwt,
          rol: userRole || 'USER' // Valor por defecto si no encontramos el rol
        };

        localStorage.setItem('user', JSON.stringify(userData));
        this.setAuthHeader(userData.token);
        
        return userData;
      }
      
      return null;
    } catch (error: any) {
      console.error('❌ Error en login:', error);
      // No llamar a logout aquí, solo manejar el error
      throw new Error(error.response?.data?.message || 'Credenciales inválidas');
    }
  }

  // Add new method for password validation
  async validatePassword(email: string, password: string): Promise<boolean> {
    try {
      const response = await axios.post(`${API_URL}/validate-password`, {
        email,
        password
      });
      return response.data.valid;
    } catch (error) {
      console.error('Error validating password:', error);
      return false;
    }
  }

  // Add new method for current password validation
  async validateCurrentPassword(email: string, currentPassword: string): Promise<boolean> {
    try {
      const response = await axios.post('/api/v1/usuarios/validate-password', {
        email,
        password: currentPassword
      });
      return response.data;
    } catch (error) {
      console.error('Error validating current password:', error);
      return false;
    }
  }

  logout() {
    console.log('🚪 Ejecutando logout');
    localStorage.removeItem('user');
    this.removeAuthHeader();
  }

  getCurrentUser(): usuario | null {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);

        // Añadir monitoreo cuando se recupera el usuario
        if (user.token) {
          this.monitorTokenExpiration(user.token);
        }
        
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  private setAuthHeader(token: string) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  private removeAuthHeader() {
    delete axios.defaults.headers.common['Authorization'];
  }

  // Método auxiliar para verificar roles
  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user?.rol || null;
  }

  // Método para verificar si el usuario es admin
  isAdmin(): boolean {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.log('⚠️ No hay usuario en localStorage');
        return false;
      }

      const user: usuario = JSON.parse(userStr);
      if (!user.token) {
        console.log('⚠️ No hay token');
        return false;
      }

      // Decodificar el token para obtener el rol
      const decodedToken = jwtDecode<JWTPayload>(user.token);
      

      // Buscar el rol en las posibles propiedades del token
      const posiblesRoles = ['rol', 'role', 'authorities', 'scope', 'permission'];
      let userRole = null;

      for (const rolKey of posiblesRoles) {
        if (decodedToken[rolKey]) {
          userRole = decodedToken[rolKey];
          break;
        }
      }

      // Verifica si el rol es ROLE_ADMIN en lugar de solo ADMIN
      const isAdmin = userRole === UserRoles.ADMIN;
      
      return isAdmin;

    } catch (error) {
      console.error('❌ Error verificando rol admin:', error);
      return false;
    }
  }
}

export default new AuthService();