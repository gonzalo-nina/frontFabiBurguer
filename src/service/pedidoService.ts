import axios from 'axios';
import { Pedido, PedidoDTO, DetallePedido } from '../types/Pedido';
import auth from './auth';

const API_URL = '/api/v1/pedidos';
const DETALLE_API_URL = '/api/v1/detalles-pedido';

class PedidoService {
  private getAuthHeader() {
    const user = auth.getCurrentUser();
    console.log('🔑 Auth Headers:', {
      hasToken: !!user?.token,
      tokenPreview: user?.token?.substring(0, 20) + '...'
    });
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

  async crearPedido(pedidoDTO: PedidoDTO): Promise<Pedido> {
    try {
      console.log('📦 Iniciando creación de pedido:', {
        pedidoDTO,
        endpoint: API_URL
      });

      const response = await axios.post(API_URL, pedidoDTO, this.getAuthHeader());
      
      console.log('✅ Pedido creado exitosamente:', {
        status: response.status,
        pedidoCreado: response.data
      });

      return response.data;
    } catch (error: any) {
      console.error('❌ Error al crear pedido:', {
        mensaje: error.message,
        status: error.response?.status,
        data: error.response?.data,
        pedidoEnviado: pedidoDTO
      });
      throw error;
    }
  }

  async crearDetallePedido(detalle: DetallePedido): Promise<DetallePedido> {
    try {
      console.log('📝 Detalle a enviar:', JSON.stringify(detalle, null, 2));
      const response = await axios.post(
        `${DETALLE_API_URL}/crear`, 
        detalle, 
        this.getAuthHeader()
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Error detallado:', {
        mensaje: error.message,
        response: error.response?.data,
        detalle: detalle
      });
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

  // Add new method
  async obtenerDetallesPedido(idPedido: number): Promise<DetallePedido[]> {
    try {
      const response = await axios.get(`${DETALLE_API_URL}/pedido/${idPedido}`, this.getAuthHeader());
      return response.data;
    } catch (error) {
      console.error('Error al obtener detalles:', error);
      throw error;
    }
  }

  async eliminarDetallePedido(idDetalle: number): Promise<void> {
    try {
      await axios.delete(`${DETALLE_API_URL}/${idDetalle}`, this.getAuthHeader());
    } catch (error) {
      console.error('Error al eliminar detalle:', error);
      throw error;
    }
  }

  async verificarProductoEnDetalles(idProducto: number): Promise<boolean> {
    try {
      const response = await axios.get(
        `${DETALLE_API_URL}/producto/${idProducto}/existe`,
        this.getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error al verificar producto en detalles:', error);
      throw error;
    }
  }
}

export default new PedidoService();