import axios from 'axios';
import { Pedido, PedidoDTO, DetallePedido } from '../types/Pedido';
import auth from './auth';

const API_URL = '/api/v1/pedidos';
const DETALLE_API_URL = '/api/v1/detalles-pedido';

class PedidoService {
  private getAuthHeader() {
    const user = auth.getCurrentUser();
    return {
      headers: {
        Authorization: `Bearer ${user?.token}`
      }
    };
  }

  async listarPedidos(): Promise<PedidoDTO[]> {
    try {
      const response = await axios.get(API_URL, this.getAuthHeader());
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

  async crearPedido(pedido: PedidoDTO): Promise<Pedido> {
    try {
      const response = await axios.post(API_URL, pedido, this.getAuthHeader());
      return response.data;
    } catch (error) {
      console.error('Error al crear pedido:', error);
      throw error;
    }
  }

  async crearDetallePedido(detalle: DetallePedido): Promise<DetallePedido> {
    try {
      const response = await axios.post(`${DETALLE_API_URL}/crear`, detalle, this.getAuthHeader());
      return response.data;
    } catch (error) {
      console.error('Error al crear detalle del pedido:', error);
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

  async actualizarSubtotalPedido(id: number, pedido: PedidoDTO): Promise<Pedido> {
    try {
      const response = await axios.put(`${API_URL}/${id}`, pedido, this.getAuthHeader());
      return response.data;
    } catch (error) {
      console.error('Error al actualizar subtotal del pedido:', error);
      throw error;
    }
  }

  async actualizarEstadoPedido(id: number, estado: boolean): Promise<Pedido> {
    try {
      const response = await axios.put(`${API_URL}/${id}/estado?estado=${estado}`, null, this.getAuthHeader());
      return response.data;
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      throw error;
    }
  }

  async eliminarPedido(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/${id}`, this.getAuthHeader());
    } catch (error) {
      console.error('Error al eliminar pedido:', error);
      throw error;
    }
  }
}

export default new PedidoService();