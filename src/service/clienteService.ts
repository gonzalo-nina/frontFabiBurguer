// src/service/clienteService.ts
import axios from 'axios';
import { Cliente } from '../types/cliente';

const API_URL = '/api/v1/admin/clientes';

class ClienteService {
  async getAllClientes(): Promise<Cliente[]> {
    const response = await axios.get(API_URL);
    return response.data;
  }
  

  async getClienteById(id: number): Promise<Cliente> {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
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