export interface Pedido {
    idPedido?: number;
    idCliente: number;
    fechaPedido: string;
    estadoPedido: boolean;
    subtotal: number;
    detallesPedido?: DetallePedido[];
}

export interface DetallePedido {
    idDetallePedido?: number;
    idPedido?: number;
    producto: {
        idProducto: number;
        nombre: string;
        precio: number;
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