import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import clienteService from '../service/clienteService';
import productoService from '../service/productoService';
import { Cliente } from '../types/cliente';
import { Producto } from '../types/producto';
import { Pedido, DetallePedido } from '../types/Pedido';
import { X } from 'lucide-react';
import '../styles/ProductCards.css';

interface ProductoSeleccionado extends Producto {
  cantidad: number;
}

interface PedidosFormProps {
  onSubmit: (pedido: Pedido) => void;
  onCancel: () => void;
}

const PedidosForm: React.FC<PedidosFormProps> = ({ onSubmit, onCancel }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clienteId, setClienteId] = useState<string>('');
  const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoSeleccionado[]>([]);
  const [showProductosModal, setShowProductosModal] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [clientesData, productosData] = await Promise.all([
          clienteService.getAllClientes(),
          productoService.getAllProductos()
        ]);
        setClientes(clientesData);
        setProductos(productosData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    const nuevoTotal = productosSeleccionados.reduce((sum, producto) => 
      sum + (producto.precio * producto.cantidad), 0);
    setTotal(nuevoTotal);
  }, [productosSeleccionados]);

  const handleAgregarProducto = (producto: Producto) => {
    const productoExistente = productosSeleccionados.find(p => p.id === producto.id);
    
    if (productoExistente) {
      if (productoExistente.cantidad < producto.disponibilidad) {
        setProductosSeleccionados(productosSeleccionados.map(p =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        ));
      }
    } else {
      if (producto.disponibilidad > 0) {
        setProductosSeleccionados([...productosSeleccionados, { ...producto, cantidad: 1 }]);
      }
    }
  };

  const handleAjustarCantidad = (productoId: number, incremento: number) => {
    setProductosSeleccionados(productosSeleccionados.map(p => {
      if (p.id === productoId) {
        const nuevaCantidad = p.cantidad + incremento;
        if (nuevaCantidad > 0 && nuevaCantidad <= p.disponibilidad) {
          return { ...p, cantidad: nuevaCantidad };
        }
        return incremento < 0 ? p : null;
      }
      return p;
    }).filter(Boolean) as ProductoSeleccionado[]);
  };

  const handleRemoveProduct = (id: number) => {
    setProductosSeleccionados(prev => 
      prev.filter(p => p.id !== id)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clienteId.trim()) {
      console.error('Error: Debe seleccionar un cliente');
      return;
    }

    const clienteIdNumber = parseInt(clienteId);
    if (isNaN(clienteIdNumber)) {
      console.error(`Error: ID de cliente inválido: ${clienteId}`);
      return;
    }

    if (productosSeleccionados.length === 0) {
      console.error('Error: No hay productos seleccionados');
      return;
    }

    const pedido: Pedido = {
      clienteId: clienteIdNumber,
      fecha: new Date().toISOString(),
      total,
      estado: false,
      detallePedido: productosSeleccionados
        .filter((p): p is ProductoSeleccionado & { id: number } => p.id !== undefined)
        .map(p => ({
          productoId: p.id,
          cantidad: p.cantidad,
          precioUnitario: p.precio,
          subtotal: p.precio * p.cantidad
        }))
    };

    onSubmit(pedido);
  };

  const updateCantidad = (productoId: number, nuevaCantidad: number): void => {
    setProductosSeleccionados(prev => prev.map(producto => {
      if (producto.id === productoId) {
        if (nuevaCantidad > 0 && nuevaCantidad <= producto.disponibilidad) {
          return { ...producto, cantidad: nuevaCantidad };
        }
        return producto;
      }
      return producto;
    }));
  };

  return (
    <div className="pedidos-form-container">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="pedidos-form-select mb-4">
          <Form.Label>Cliente</Form.Label>
          <Form.Select
            value={clienteId}
            onChange={(e) => {
              const selectedId = e.target.value;
              console.log('Selected ID:', selectedId, 'Type:', typeof selectedId);
              setClienteId(selectedId);
            }}
            required
          >
            <option value="">Seleccione un Cliente</option>
            {clientes.map(cliente => {
              console.log('Cliente ID:', cliente.id, 'Type:', typeof cliente.id);
              return (
                <option 
                  key={cliente.id} 
                  value={cliente.id} // Removemos toString() aquí
                >
                  {`${cliente.id} - ${cliente.nombre}`} {/* Agregamos el ID visible */}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>

        {clienteId && (
          <div className="cliente-alert mb-4">
            <div className="alert-heading">Cliente Seleccionado</div>
            {clientes.find(c => c.id === Number(clienteId))?.nombre} {/* Convertimos clienteId a número */}
          </div>
        )}

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
            <div className="productos-grid">
              {productosSeleccionados.map((producto) => (
                <div key={producto.id} className="producto-card">
                  <button 
                    className="remove-button"
                    onClick={() => handleRemoveProduct(producto.id!)}
                    aria-label="Remove product"
                  >
                    <X className="x-icon" size={16} strokeWidth={2} />
                  </button>
                  
                  <div className="producto-header">
                    <h3 className="producto-title">{producto.nombre}</h3>
                    
                  </div>

                  <div className="producto-cantidad">
                    <span>Cantidad:</span>
                    <div className="cantidad-control">
                      <Button 
                        size="sm" 
                        variant="outline-secondary"
                        onClick={() => updateCantidad(producto.id!, Math.max(1, producto.cantidad - 1))}
                      >
                        -
                      </Button>
                      <span>{producto.cantidad}</span>
                      <Button
                        size="sm"
                        variant="outline-secondary" 
                        onClick={() => updateCantidad(producto.id!, Math.min(producto.disponibilidad, producto.cantidad + 1))}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="producto-subtotal">
                    <span>Subtotal:</span>
                    <span>S/. {(producto.precio * producto.cantidad).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="total-card">
              <div className="total-content">
                <span className="total-label">Total:</span>
                <span className="total-amount">S/. {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="d-flex justify-content-end gap-2 mt-4">
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            variant="success" 
            type="submit"
            disabled={!clienteId || productosSeleccionados.length === 0}
          >
            Agregar Pedido
          </Button>
        </div>
      </Form>

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

export default PedidosForm;