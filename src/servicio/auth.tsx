import axios from 'axios';
import { usuario } from '../types/usuario';

const API_URL = '/api/v1/autenticacion/signin';

class AuthService {
  async login(email: string, clave: string): Promise<usuario | null> {
    try {
      const response = await axios.post(API_URL, { email, clave }, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.jwt) {
        const userData: usuario = {
          email,
          usuario: response.data.username, // Asegúrate de que este campo coincida con el nombre de usuario en la respuesta del backend
          clave,
          token: response.data.jwt,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        return userData;
      }
      return null;
    } catch (error) {
      throw new Error('Credenciales inválidas');
    }
  }

  logout() {
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  }

  getCurrentUser(): usuario | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user: usuario = JSON.parse(userStr);
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      return user;
    }
    return null;
  }
}

export default new AuthService();