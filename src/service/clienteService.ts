// src/service/clienteService.ts
import axios from 'axios';
import { Cliente } from '../types/cliente';

const API_URL = '/api/v1/clientes';

class ClienteService {
  async getAllClientes(): Promise<Cliente[]> {
    const response = await axios.get(API_URL);
    console.log('API Response:', response.data); // Debug API response
    // Map the response to include id
    return response.data.map((cliente: any) => ({
      ...cliente,
      id: cliente.idCliente // Map idCliente to id
    }));
  }
  
  async getClienteById(id: number): Promise<Cliente | null> {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return {
        ...response.data,
        id: response.data.idCliente
      };
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