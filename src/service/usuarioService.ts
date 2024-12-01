// src/service/usuarioService.ts
import axios from 'axios';
import { Usuario } from '../types/usuario';
import auth from './auth';

const API_URL = '/api/v1/user';

class UsuarioService {
  private getAuthHeader() {
    const user = auth.getCurrentUser();
    return {
      headers: {
        Authorization: `Bearer ${user?.token}`
      }
    };
  }

  async getUsuarios(): Promise<Usuario[]> {
    const response = await axios.get(API_URL, this.getAuthHeader());
    return response.data;
  }

  async createUsuario(usuario: Usuario): Promise<Usuario> {
    const response = await axios.post(`${API_URL}/createUser`, usuario, this.getAuthHeader());
    return response.data;
  }

  async updateUsuario(id: number, usuario: Usuario): Promise<Usuario> {
    const response = await axios.put(`${API_URL}/${id}`, usuario, this.getAuthHeader());
    return response.data;
  }

  async deleteUsuario(id: number): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  }

  async deshabilitarUsuario(id: number): Promise<void> {
    await axios.put(`${API_URL}/deshabilitar/${id}`, null, this.getAuthHeader());
  }

  async habilitarUsuario(id: number): Promise<void> {
    await axios.put(`${API_URL}/habilitar/${id}`, null, this.getAuthHeader());
  }
}

export default new UsuarioService();