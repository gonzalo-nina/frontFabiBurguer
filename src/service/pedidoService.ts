import axios from 'axios';
import { Pedido } from '../types/Pedido';

const API_URL = '/api/v1/admin/pedidos';

class PedidoService {
  async listarPedidos(): Promise<Pedido[]> {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      throw error;
    }
  }

  async obtenerPedidoPorId(id: number): Promise<Pedido> {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener pedido:', error);
      throw error;
    }
  }

  async crearPedido(pedido: Pedido): Promise<Pedido> {
    try {
      const response = await axios.post(API_URL, pedido);
      return response.data;
    } catch (error) {
      console.error('Error al crear pedido:', error);
      throw error;
    }
  }

  async actualizarPedido(id: number, pedido: Pedido): Promise<Pedido> {
    try {
      const response = await axios.put(`${API_URL}/${id}`, pedido);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar pedido:', error);
      throw error;
    }
  }

  async actualizarEstadoPedido(id: number, estado: boolean): Promise<Pedido> {
    try {
      const response = await axios.put(`${API_URL}/${id}/estado`, null, {
        params: { estado }
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      throw error;
    }
  }

  async eliminarPedido(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error('Error al eliminar pedido:', error);
      throw error;
    }
  }
}

export default new PedidoService();