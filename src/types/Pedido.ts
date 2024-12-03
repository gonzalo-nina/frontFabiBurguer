export interface Pedido {
    idPedido?: number;
    idCliente: number;
    fechaPedido: string;
    estadoPedido: boolean;
    subtotal: number;
    detallesPedido?: DetallePedido[];
}

export interface DetallePedido {
  pedido: {
      idPedido: number;
  };
  producto: {
      idProducto: number;
  };
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface PedidoDTO {
    idPedido?: number;
    idCliente: number;
    fechaPedido?: string;
    estadoPedido: boolean;
    subtotal: number;
}