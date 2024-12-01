import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import clienteService from '../service/clienteService';
import productoService from '../service/productoService';
import { Cliente } from '../types/cliente';
import { Producto } from '../types/producto';
import { Pedido, DetallePedido } from '../types/Pedido';

interface ProductoSeleccionado extends Producto {
  cantidad: number;
}

interface PedidoFormProps {
  onSubmit: (pedido: Pedido) => void;
  onCancel: () => void;
}

const PedidoForm: React.FC<PedidoFormProps> = ({ onSubmit, onCancel }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<number>(0);
  const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoSeleccionado[]>([]);
  const [showProductosModal, setShowProductosModal] = useState(false);
  const [total, setTotal] = useState(0);

  // Cargar clientes y productos al iniciar
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [clientesData, productosData] = await Promise.all([
          clienteService.getAllClientes(),
          productoService.getAllProductos()
        ]);
        console.log('Clientes cargados:', clientesData); // Para depuración
        console.log('Productos cargados:', productosData); // Para depuración
        setClientes(clientesData);
        setProductos(productosData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    cargarDatos();
  }, []);

  // Calcular total cuando cambian los productos seleccionados
  useEffect(() => {
    const nuevoTotal = productosSeleccionados.reduce((sum, producto) => 
      sum + (producto.precio * producto.cantidad), 0);
    setTotal(nuevoTotal);
  }, [productosSeleccionados]);

  const handleAgregarProducto = (producto: Producto) => {
    const productoExistente = productosSeleccionados.find(p => p.id === producto.id);
    
    // Verificar la disponibilidad antes de agregar o incrementar
    if (productoExistente) {
      // Verificar que no exceda la disponibilidad
      if (productoExistente.cantidad < producto.disponibilidad) {
        setProductosSeleccionados(productosSeleccionados.map(p =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        ));
      }
    } else {
      // Solo agregar si hay disponibilidad
      if (producto.disponibilidad > 0) {
        setProductosSeleccionados([...productosSeleccionados, { ...producto, cantidad: 1 }]);
      }
    }
  };

  const handleAjustarCantidad = (productoId: number, incremento: number) => {
    setProductosSeleccionados(productosSeleccionados.map(p => {
      if (p.id === productoId) {
        const nuevaCantidad = p.cantidad + incremento;
        // Verificar límites
        if (nuevaCantidad > 0 && nuevaCantidad <= p.disponibilidad) {
          return { ...p, cantidad: nuevaCantidad };
        }
        return incremento < 0 ? p : null; // Mantener producto si es decremento
      }
      return p;
    }).filter(Boolean) as ProductoSeleccionado[]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteSeleccionado || productosSeleccionados.length === 0) {
      console.error('Faltan datos requeridos');
      return;
    }
    
    const pedido: Pedido = {
      clienteId: clienteSeleccionado,
      fecha: new Date().toISOString(),
      total,
      estado: false,
      detallePedido: productosSeleccionados
        .filter(p => p.id !== undefined)
        .map(p => ({
          productoId: p.id as number,
          cantidad: p.cantidad,
          precioUnitario: p.precio,
          subtotal: p.precio * p.cantidad
        }))
    };
    console.log('Enviando pedido:', pedido); // Para depuración
    onSubmit(pedido);
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Cliente</Form.Label>
          <Form.Select
            value={clienteSeleccionado}
            onChange={(e) => {
              const value = Number(e.target.value);
              console.log('Cliente seleccionado:', value); // Para depuración
              setClienteSeleccionado(value);
            }}
            required
          >
            <option value="">Seleccione un Cliente</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button
          variant="success"
          className="mb-3 w-100"
          onClick={() => setShowProductosModal(true)}
        >
          + Agregar Productos
        </Button>

        {productosSeleccionados.length > 0 && (
          <div className="mb-3">
            <h5>Productos Seleccionados</h5>
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosSeleccionados.map(producto => (
                  <tr key={producto.id}>
                    <td>{producto.nombre}</td>
                    <td>S/. {producto.precio.toFixed(2)}</td>
                    <td>{producto.cantidad}</td>
                    <td>S/. {(producto.precio * producto.cantidad).toFixed(2)}</td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        className="me-1"
                        onClick={() => producto.id !== undefined && handleAjustarCantidad(producto.id, 1)}
                      >
                        +
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => producto.id !== undefined && handleAjustarCantidad(producto.id, -1)}
                      >
                        -
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <h4>Total: S/. {total.toFixed(2)}</h4>
          </div>
        )}

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            variant="success" 
            type="submit"
            disabled={!clienteSeleccionado || productosSeleccionados.length === 0}
          >
            Agregar Pedido
          </Button>
        </div>
      </Form>

      {/* Modal de Selección de Productos */}
      <Modal show={showProductosModal} onHide={() => setShowProductosModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar Productos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Disponibilidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(producto => (
                <tr key={producto.id}>
                  <td>{producto.nombre}</td>
                  <td>{producto.descripcion}</td>
                  <td>S/. {producto.precio}</td>
                  <td>{producto.disponibilidad}</td>
                  <td>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleAgregarProducto(producto)}
                      disabled={producto.disponibilidad <= 0}
                    >
                      +
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowProductosModal(false)}>
            Continuar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PedidoForm;