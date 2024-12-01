
export interface Pedido {
    idPedido?: number;
    fecha: string;
    total: number;
    estado: boolean;
    clienteId: number;
    detallePedido: DetallePedido[];
  }
  
 export interface DetallePedido {
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }