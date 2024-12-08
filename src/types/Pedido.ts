export interface Pedido {
    idPedido?: number;
    idCliente: number;
    fechaPedido: string;
    estadoPedido: boolean;
    subtotal: number;
    detallesPedido?: DetallePedido[];
    notasAdicionales?: string;
}

export interface DetallePedido {
    idDetallePedido?: number;
  pedido: {
      idPedido: number;
  };
  producto: {
      idProducto: number;
  };
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  notasAdicionales?: string;
}

export interface PedidoDTO {
    idPedido?: number;
    idCliente: number;
    fechaPedido?: string;
    estadoPedido: boolean;
    subtotal: number;
}