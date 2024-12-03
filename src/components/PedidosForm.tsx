import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import clienteService from '../service/clienteService';
import productoService from '../service/productoService';
import { Cliente } from '../types/cliente';
import { Producto } from '../types/producto';
import { Pedido, DetallePedido, PedidoDTO } from '../types/Pedido';
import { X } from 'lucide-react';
import '../styles/ProductCards.css';
import pedidoService from '../service/pedidoService';
import auth from '../service/auth'; // Import auth service


interface ProductoSeleccionado extends Producto {
  cantidad: number;
}

interface PedidosFormProps {
  onSubmit: (pedido: Pedido) => void;
  onCancel: () => void;
  selectedPedido?: Pedido | null;
  
}

const PedidosForm: React.FC<PedidosFormProps> = ({ onSubmit, onCancel, selectedPedido }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clienteId, setClienteId] = useState<string>('');
  const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoSeleccionado[]>([]);
  const [showProductosModal, setShowProductosModal] = useState(false);
  const [total, setTotal] = useState(0);
  const [disponibilidadActual, setDisponibilidadActual] = useState<Record<number, number>>({});

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

  useEffect(() => {
    const cargarPedidoExistente = async () => {
      // Limpiar productos seleccionados al inicio
      setProductosSeleccionados([]);
      
      if (selectedPedido?.idPedido) {
        try {
          const detalles = await pedidoService.obtenerDetallesPedido(selectedPedido.idPedido);
          
          // Map detalles using productos array for complete product info
          const productosDelPedido = detalles.map(detalle => {
            const productoCompleto = productos.find(p => p.idProducto === detalle.producto.idProducto);
            if (!productoCompleto) {
              console.warn('⚠️ Producto no encontrado:', detalle.producto.idProducto);
              return null;
            }
            
            return {
              ...productoCompleto,
              cantidad: detalle.cantidad,
              precio: detalle.precioUnitario
            };
          }).filter(Boolean) as ProductoSeleccionado[];

          console.log('📝 Productos cargados para edición:', productosDelPedido);
          setProductosSeleccionados(productosDelPedido);
          setClienteId(selectedPedido.idCliente.toString());
        } catch (error) {
          console.error('Error al cargar detalles:', error);
        }
      }
    };

    cargarPedidoExistente();
  }, [selectedPedido, productos]); // Add productos to dependencies

  useEffect(() => {
    const disponibilidadInicial = productos.reduce((acc, producto) => {
      acc[producto.idProducto] = producto.disponibilidad;
      return acc;
    }, {} as Record<number, number>);
    setDisponibilidadActual(disponibilidadInicial);
  }, [productos]);

  const handleAgregarProducto = (producto: Producto) => {
    const productoExistente = productosSeleccionados.find(p => p.idProducto === producto.idProducto);
    const disponibilidadBase = producto.disponibilidad;
    const otrosProductosSeleccionados = productosSeleccionados.filter(p => p.idProducto !== producto.idProducto);
    const cantidadOtrosProductos = otrosProductosSeleccionados.reduce((sum, p) => sum + p.cantidad, 0);
    const disponibilidadMaxima = disponibilidadBase - cantidadOtrosProductos;

    if (productoExistente) {
      const nuevaCantidad = productoExistente.cantidad + 1;
      if (nuevaCantidad <= disponibilidadMaxima) {
        updateCantidad(producto.idProducto, nuevaCantidad);
      }
    } else {
      if (disponibilidadMaxima > 0) {
        setProductosSeleccionados([...productosSeleccionados, { ...producto, cantidad: 1 }]);
        setDisponibilidadActual(prev => ({
          ...prev,
          [producto.idProducto]: disponibilidadMaxima - 1
        }));
      }
    }
  };

  const handleAjustarCantidad = (productoId: number, incremento: number) => {
    const productoActual = productosSeleccionados.find(p => p.idProducto === productoId);
    if (!productoActual) return;

    const nuevaCantidad = productoActual.cantidad + incremento;
    const disponibilidadBase = productos.find(p => p.idProducto === productoId)?.disponibilidad || 0;
    const otrosProductosSeleccionados = productosSeleccionados.filter(p => p.idProducto !== productoId);
    const cantidadOtrosProductos = otrosProductosSeleccionados.reduce((sum, p) => sum + p.cantidad, 0);
    const disponibilidadMaxima = disponibilidadBase - cantidadOtrosProductos;

    if (nuevaCantidad > 0 && nuevaCantidad <= disponibilidadMaxima) {
      updateCantidad(productoId, nuevaCantidad);
    }
  };

  useEffect(() => {
    const calcularDisponibilidadInicial = () => {
      const disponibilidadInicial = productos.reduce((acc, producto) => {
        const cantidadSeleccionada = productosSeleccionados
          .filter(p => p.idProducto === producto.idProducto)
          .reduce((sum, p) => sum + p.cantidad, 0);
        acc[producto.idProducto] = producto.disponibilidad - cantidadSeleccionada;
        return acc;
      }, {} as Record<number, number>);
      setDisponibilidadActual(disponibilidadInicial);
    };

    calcularDisponibilidadInicial();
  }, [productos, productosSeleccionados]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedPedido?.idPedido) {
        console.log('🔄 Iniciando actualización de pedido:', selectedPedido.idPedido);

        // 1. Obtener detalles actuales para limpiarlos
        const detallesActuales = await pedidoService.obtenerDetallesPedido(selectedPedido.idPedido);
        
        // 2. Eliminar detalles existentes
        console.log('🗑️ Eliminando detalles antiguos...');
        for (const detalle of detallesActuales) {
          if (detalle.idDetallePedido) { // Use correct property name
            await pedidoService.eliminarDetallePedido(detalle.idDetallePedido);
          } else {
            console.warn('⚠️ Detalle encontrado sin ID:', detalle);
          }
        }

        // 3. Calcular nuevo subtotal
        const subtotal = productosSeleccionados.reduce((sum, producto) => 
          sum + (producto.precio * producto.cantidad), 0
        );

        // 4. Crear nuevos detalles
        console.log('📝 Creando nuevos detalles...');
        for (const producto of productosSeleccionados) {
          const detalle: DetallePedido = {
            pedido: {
              idPedido: selectedPedido.idPedido
            },
            producto: {
              idProducto: producto.idProducto
            },
            cantidad: producto.cantidad,
            precioUnitario: producto.precio,
            subtotal: producto.precio * producto.cantidad
          };

          await pedidoService.crearDetallePedido(detalle);
        }

        // 5. Actualizar subtotal del pedido
        const pedidoActualizado: PedidoDTO = {
          idPedido: selectedPedido.idPedido,
          idCliente: selectedPedido.idCliente,
          estadoPedido: selectedPedido.estadoPedido,
          subtotal: subtotal,
          fechaPedido: selectedPedido.fechaPedido
        };

        await pedidoService.actualizarSubtotalPedido(selectedPedido.idPedido, pedidoActualizado);
        console.log('✅ Pedido actualizado exitosamente');
        onSubmit({ ...pedidoActualizado, fechaPedido: pedidoActualizado.fechaPedido || '' });
      } else {
        console.log('🛒 Iniciando proceso de creación de pedido');
      
        // 1. Create pedido base
        const pedidoDTO: PedidoDTO = {
          idCliente: parseInt(clienteId),
          estadoPedido: false,
          subtotal: 0 // Initially 0
        };
    
        console.log('📦 Datos del pedido a crear:', pedidoDTO);
        const pedidoCreado = await pedidoService.crearPedido(pedidoDTO);
        console.log('✅ Pedido base creado:', pedidoCreado);
    
        // 2. Create detalles
        console.log('📝 Creando detalles para', productosSeleccionados.length, 'productos');
        
        if (pedidoCreado.idPedido) {
          for (const producto of productosSeleccionados) {
            const detalle = {
              pedido: {
                idPedido: pedidoCreado.idPedido
              },
              producto: {
                idProducto: producto.idProducto
              },
              cantidad: producto.cantidad,
              precioUnitario: producto.precio,
              subtotal: producto.precio * producto.cantidad
            };
    
            console.log('📦 Enviando detalle:', detalle);
            await pedidoService.crearDetallePedido(detalle);
          }
    
          // 3. Update pedido with final subtotal
          const subtotalFinal = productosSeleccionados.reduce((sum, producto) => 
            sum + (producto.precio * producto.cantidad), 0
          );
    
          const pedidoActualizado: PedidoDTO = {
            ...pedidoDTO,
            subtotal: subtotalFinal,
            fechaPedido: new Date().toISOString()
          };
    
          console.log('💰 Actualizando subtotal del pedido:', {
            id: pedidoCreado.idPedido,
            subtotal: subtotalFinal
          });
    
          await pedidoService.actualizarSubtotalPedido(pedidoCreado.idPedido, pedidoActualizado);
          console.log('✅ Subtotal actualizado exitosamente');
        }
    
        console.log('✅ Proceso completado exitosamente');
        onSubmit({ ...pedidoCreado, fechaPedido: pedidoCreado.fechaPedido || '' });
      }
  
    } catch (error) {
      console.error('❌ Error en el proceso:', error);
    }
  };

  const updateCantidad = (productoId: number, nuevaCantidad: number): void => {
    setProductosSeleccionados(prev => {
      const productoActual = prev.find(p => p.idProducto === productoId);
      if (!productoActual) return prev;

      const disponibilidadBase = productos.find(p => p.idProducto === productoId)?.disponibilidad || 0;
      const otrosProductosSeleccionados = prev.filter(p => p.idProducto !== productoId);
      const cantidadOtrosProductos = otrosProductosSeleccionados.reduce((sum, p) => sum + p.cantidad, 0);
      const disponibilidadMaxima = disponibilidadBase - cantidadOtrosProductos;

      if (nuevaCantidad > 0 && nuevaCantidad <= disponibilidadMaxima) {
        // Actualizar disponibilidad
        setDisponibilidadActual(prevDisp => ({
          ...prevDisp,
          [productoId]: disponibilidadBase - (cantidadOtrosProductos + nuevaCantidad)
        }));

        return prev.map(p =>
          p.idProducto === productoId 
            ? { ...p, cantidad: nuevaCantidad }
            : p
        );
      }
      return prev;
    });
  };

  const handleRemoveProduct = (id: number) => {
    const productoEliminado = productosSeleccionados.find(p => p.idProducto === id);
    if (productoEliminado) {
      // Restaurar disponibilidad
      const disponibilidadBase = productos.find(p => p.idProducto === id)?.disponibilidad || 0;
      const otrosProductos = productosSeleccionados.filter(p => p.idProducto !== id);
      const cantidadOtrosProductos = otrosProductos.reduce((sum, p) => sum + p.cantidad, 0);
      
      setDisponibilidadActual(prev => ({
        ...prev,
        [id]: disponibilidadBase - cantidadOtrosProductos
      }));
      
      // Eliminar producto de seleccionados
      setProductosSeleccionados(prev => prev.filter(p => p.idProducto !== id));
    }
  };

  return (
    <div className="pedidos-form-container">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="pedidos-form-select mb-4">
          <Form.Label>Cliente</Form.Label>
          {selectedPedido ? (
            // Read-only display when editing
            <div className="form-control-plaintext">
              {clientes.find(c => c.idCliente === selectedPedido.idCliente)?.nombre || 'Cliente no encontrado'}
            </div>
          ) : (
            // Editable select when creating
            <Form.Select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              required
            >
              <option value="">Seleccione un Cliente</option>
              {clientes.map(cliente => (
                <option 
                  key={cliente.idCliente} 
                  value={cliente.idCliente}
                >
                  {`${cliente.idCliente} - ${cliente.nombre}`}
                </option>
              ))}
            </Form.Select>
          )}
        </Form.Group>

        {clienteId && (
          <div className="cliente-alert mb-4">
            <div className="alert-heading">Cliente Seleccionado</div>
            {clientes.find(c => c.idCliente === Number(clienteId))?.nombre}
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
                <div key={producto.idProducto} className="producto-card">
                  <button 
                    className="remove-button"
                    onClick={() => handleRemoveProduct(producto.idProducto!)}
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
                        onClick={() => updateCantidad(producto.idProducto!, Math.max(1, producto.cantidad - 1))}
                      >
                        -
                      </Button>
                      <span>{producto.cantidad}</span>
                      <Button
                        size="sm"
                        variant="outline-secondary" 
                        onClick={() => updateCantidad(producto.idProducto!, Math.min(producto.disponibilidad, producto.cantidad + 1))}
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
            {selectedPedido ? 'Actualizar Pedido' : 'Agregar Pedido'}
          </Button>
        </div>
      </Form>

      <Modal show={showProductosModal} onHide={() => setShowProductosModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedPedido ? 'Modificar Productos' : 'Seleccionar Productos'}
          </Modal.Title>
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
                <tr key={producto.idProducto}>
                  <td>{producto.nombre}</td>
                  <td>{producto.descripcion}</td>
                  <td>S/. {producto.precio}</td>
                  <td>{disponibilidadActual[producto.idProducto] || 0}</td>
                  <td>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleAgregarProducto(producto)}
                      disabled={disponibilidadActual[producto.idProducto] <= 0}
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