// src/service/clienteService.ts
import axios from '../config/axios'; // Cambiar esta importación
import { Cliente } from '../types/cliente';

const API_URL = '/api/v1/clientes';

class ClienteService {
  async getAllClientes(): Promise<Cliente[]> {
    try {
      const response = await axios.get(API_URL);
      console.log('API Response:', response.data);
      return response.data; // Return data directly since backend matches interface
    } catch (error) {
      console.error('Error fetching clientes:', error);
      throw error;
    }
  }
  
  async getClienteById(id: number): Promise<Cliente | null> {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async createCliente(cliente: Cliente): Promise<Cliente> {
    const response = await axios.post(API_URL, cliente);
    return response.data;
  }

  async updateCliente(id: number, cliente: Cliente): Promise<Cliente> {
    const response = await axios.put(`${API_URL}/${id}`, cliente);
    return response.data;
  }

  async deleteCliente(id: number): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  }
}

export default new ClienteService();