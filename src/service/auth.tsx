import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { usuario, UserRoles } from '../types/usuario';

const API_URL = '/api/v1/autenticacion/signin';

interface JWTPayload {
  sub: string;
  rol: string;
  iat: number;
  exp: number;
}


// Modificamos la interfaz para ser más flexible
interface JWTPayload {
  [key: string]: any;  // Esto nos permitirá ver todos los campos
}

class AuthService {
  async login(email: string, clave: string): Promise<usuario | null> {
    try {
      console.log('📧 Iniciando login:', { email });
      
      const response = await axios.post(API_URL, { email, clave }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      console.log('📥 Respuesta completa del servidor:', response.data);

      if (response.data.jwt) {
        // Decodificar y examinar el token completo
        const token = response.data.jwt;
        const decodedToken = jwtDecode<JWTPayload>(token);
        
        // Log detallado de todas las propiedades del token
        console.log('🔑 Token decodificado completo:', {
          todasLasPropiedades: Object.keys(decodedToken),
          contenidoCompleto: decodedToken
        });

        // Intentar encontrar el rol en diferentes propiedades posibles
        const posiblesRoles = ['rol', 'role', 'authorities', 'scope', 'permission'];
        let userRole = null;
        
        for (const rolKey of posiblesRoles) {
          if (decodedToken[rolKey]) {
            console.log(`🎯 Rol encontrado en propiedad '${rolKey}':`, decodedToken[rolKey]);
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

        console.log('👤 Datos finales del usuario:', userData);

        localStorage.setItem('user', JSON.stringify(userData));
        this.setAuthHeader(userData.token);
        
        return userData;
      }
      
      return null;
    } catch (error: any) {
      console.error('❌ Error en login:', {
        mensaje: error.message,
        detallesRespuesta: error.response?.data,
        statusCode: error.response?.status
      });
      throw new Error(error.response?.data?.message || 'Credenciales inválidas');
    }
  }

  logout() {
    console.log('🚪 Ejecutando logout');
    localStorage.removeItem('user');
    this.removeAuthHeader();
  }

  getCurrentUser(): usuario | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user: usuario = JSON.parse(userStr);
      console.log('📱 Usuario actual recuperado:', {
        email: user.email,
        usuario: user.usuario,
        rol: user.rol,
      });
      this.setAuthHeader(user.token);
      return user;
    }
    console.log('⚠️ No hay usuario en localStorage');
    return null;
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
      
      console.log('🔑 Token decodificado:', {
        token: decodedToken,
        properties: Object.keys(decodedToken)
      });

      // Buscar el rol en las posibles propiedades del token
      const posiblesRoles = ['rol', 'role', 'authorities', 'scope', 'permission'];
      let userRole = null;

      for (const rolKey of posiblesRoles) {
        if (decodedToken[rolKey]) {
          console.log(`🎯 Rol encontrado en '${rolKey}':`, decodedToken[rolKey]);
          userRole = decodedToken[rolKey];
          break;
        }
      }

      // Verifica si el rol es ROLE_ADMIN en lugar de solo ADMIN
      const isAdmin = userRole === UserRoles.ADMIN;
      console.log('👮 Verificación de admin:', { 
        userRole, 
        expectedRole: UserRoles.ADMIN,
        isAdmin 
      });
      
      return isAdmin;

    } catch (error) {
      console.error('❌ Error verificando rol admin:', error);
      return false;
    }
  }
}

export default new AuthService();