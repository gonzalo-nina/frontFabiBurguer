import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import clienteService from '../../service/clienteService';
import productoService from '../../service/productoService';
import { Cliente } from '../../types/cliente';
import { Producto } from '../../types/producto';
import { Pedido, DetallePedido, PedidoDTO } from '../../types/Pedido';
import { X, PenSquare } from 'lucide-react';
import '../../styles/ProductCards.css';
import '../../styles/PedidosForm.css';
import pedidoService from '../../service/pedidoService';
import auth from '../../service/auth'; // Import auth service
import ClienteForm from '../cliente/ClienteForm'; // 1. Import ClienteForm

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
  const [stockDisponible, setStockDisponible] = useState<Record<number, number>>({});
  const [showClienteForm, setShowClienteForm] = useState(false); // 2. Agregar estado
  const [showNotas, setShowNotas] = useState(false);
const [notas, setNotas] = useState('');

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

          setProductosSeleccionados(productosDelPedido);
          setClienteId(selectedPedido.idCliente.toString());
          setNotas(selectedPedido.notasAdicionales || ''); // Load notas
        } catch (error) {
          console.error('Error al cargar detalles:', error);
        }
      }
    };

    cargarPedidoExistente();
  }, [selectedPedido, productos]); // Add productos to dependencies

  useEffect(() => {
    const disponibilidadInicial = productos.reduce((acc, producto) => {
      const cantidadSeleccionada = productosSeleccionados
        .filter(p => p.idProducto === producto.idProducto)
        .reduce((sum, p) => sum + p.cantidad, 0);
      acc[producto.idProducto] = producto.disponibilidad - cantidadSeleccionada;
      return acc;
    }, {} as Record<number, number>);
    setDisponibilidadActual(disponibilidadInicial);
  }, [productos, productosSeleccionados]);

  useEffect(() => {
    const stockInicial = productos.reduce((acc, producto) => {
      acc[producto.idProducto] = producto.disponibilidad;
      return acc;
    }, {} as Record<number, number>);
    setStockDisponible(stockInicial);
  }, [productos]);

  const handleAgregarProducto = (producto: Producto) => {
    const stockRestante = stockDisponible[producto.idProducto];
    
    if (stockRestante <= 0) return;
  
    const productoExistente = productosSeleccionados.find(
      p => p.idProducto === producto.idProducto
    );
  
    if (productoExistente) {
      const nuevaCantidad = productoExistente.cantidad + 1;
      setProductosSeleccionados(prev => 
        prev.map(p => p.idProducto === producto.idProducto 
          ? { ...p, cantidad: nuevaCantidad }
          : p
        )
      );
    } else {
      setProductosSeleccionados(prev => [...prev, { ...producto, cantidad: 1 }]);
    }
    
    // Actualizar stock disponible
    setStockDisponible(prev => ({
      ...prev,
      [producto.idProducto]: stockRestante - 1
    }));
  };

  const handleAjustarCantidad = (productoId: number, incremento: number) => {
    const productoActual = productosSeleccionados.find(p => p.idProducto === productoId);
    if (!productoActual) return;
  
    const nuevaCantidad = productoActual.cantidad + incremento;
    const producto = productos.find(p => p.idProducto === productoId);
    if (!producto) return;
  
    // Calculamos la disponibilidad considerando la cantidad actual
    const disponibilidadTotal = producto.disponibilidad;
    const otrosProductosSeleccionados = productosSeleccionados
      .filter(p => p.idProducto !== productoId)
      .reduce((sum, p) => sum + p.cantidad, 0);
    
    const disponibilidadMaxima = disponibilidadTotal + productoActual.cantidad - otrosProductosSeleccionados;
  
    if (nuevaCantidad > 0 && nuevaCantidad <= disponibilidadMaxima) {
      updateCantidad(productoId, nuevaCantidad);
      
      // Actualizamos el subtotal
      const nuevoTotal = productosSeleccionados.reduce((sum, p) => {
        const cantidad = p.idProducto === productoId ? nuevaCantidad : p.cantidad;
        return sum + (p.precio * cantidad);
      }, 0);
      setTotal(nuevoTotal);
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

        // 1. Obtener detalles actuales para limpiarlos
        const detallesActuales = await pedidoService.obtenerDetallesPedido(selectedPedido.idPedido);
        
        // 2. Eliminar detalles existentes
        for (const detalle of detallesActuales) {
          if (detalle.idDetallePedido) {
            await pedidoService.eliminarDetallePedido(detalle.idDetallePedido);
          } else {
          }
        }

        // 3. Calcular nuevo subtotal
        const subtotal = productosSeleccionados.reduce((sum, producto) => 
          sum + (producto.precio * producto.cantidad), 0
        );

        // 4. Crear nuevos detalles
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

        // 5. Actualizar subtotal y notas del pedido
        const pedidoActualizado: PedidoDTO = {
          idPedido: selectedPedido.idPedido,
          idCliente: selectedPedido.idCliente,
          estadoPedido: selectedPedido.estadoPedido,
          subtotal: subtotal,
          fechaPedido: selectedPedido.fechaPedido,
          notasAdicionales: notas || undefined, // Add this line
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
          subtotal: 0, // Initially 0
          notasAdicionales: notas || undefined
        };
    
        const pedidoCreado = await pedidoService.crearPedido(pedidoDTO);
    
        // 2. Create detalles
        
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
    const producto = productos.find(p => p.idProducto === productoId);
    if (!producto) return;

    const productoActual = productosSeleccionados.find(p => p.idProducto === productoId);
    if (!productoActual) return;

    // Calculamos la disponibilidad real considerando el pedido actual
    const disponibilidadTotal = producto.disponibilidad;
    const cantidadActual = productoActual.cantidad;
    const otrosProductosSeleccionados = productosSeleccionados
      .filter(p => p.idProducto !== productoId)
      .reduce((sum, p) => sum + p.cantidad, 0);
    
    const disponibilidadMaxima = disponibilidadTotal + cantidadActual - otrosProductosSeleccionados;

    // Validamos que la nueva cantidad sea válida
    if (nuevaCantidad > 0 && nuevaCantidad <= disponibilidadMaxima) {
      setProductosSeleccionados(prev =>
        prev.map(p => p.idProducto === productoId 
          ? { ...p, cantidad: nuevaCantidad }
          : p
        )
      );

      // Actualizamos el stock disponible
      const diferencia = nuevaCantidad - cantidadActual;
      setStockDisponible(prev => ({
        ...prev,
        [productoId]: prev[productoId] - diferencia
      }));
    }
  };

  const handleRemoveProduct = (id: number) => {
    const productoRemovido = productosSeleccionados.find(p => p.idProducto === id);
    if (!productoRemovido) return;

    setStockDisponible(prev => ({
      ...prev,
      [id]: prev[id] + productoRemovido.cantidad
    }));
    
    setProductosSeleccionados(prev => prev.filter(p => p.idProducto !== id));
  };

  const handleSaveCliente = async (cliente: Cliente) => { // 3. Agregar función para manejar nuevo cliente
    try {
      const nuevoCliente = await clienteService.createCliente(cliente);
      setClientes(prev => [...prev, nuevoCliente]);
      setClienteId(nuevoCliente.idCliente.toString());
      setShowClienteForm(false);
    } catch (error) {
      console.error('Error al crear cliente:', error);
    }
  };

  return (
    <div className="pedidos-form-container">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="pedidos-form-select mb-4">
          <Form.Label>Cliente</Form.Label>
          <div className="d-flex gap-2">
            {selectedPedido ? (
              <div className="form-control-plaintext">
                {clientes.find(c => c.idCliente === selectedPedido.idCliente)?.nombre || 'Cliente no encontrado'}
              </div>
            ) : (
              <>
                <Form.Select
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  required
                >
                  <option value="">Seleccione un Cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.idCliente} value={cliente.idCliente}>
                      {`${cliente.idCliente} - ${cliente.nombre}`}
                    </option>
                  ))}
                </Form.Select>
                <Button 
                  variant="success"
                  onClick={() => setShowClienteForm(true)}
                >
                  +
                </Button>
              </>
            )}
          </div>
        </Form.Group>

        {clienteId && (
          <div className="cliente-alert mb-4">
            <div className="alert-heading">Cliente Seleccionado</div>
            {clientes.find(c => c.idCliente === Number(clienteId))?.nombre}
          </div>
        )}

        <div className="productos-section mb-4">
          <h5>Productos Disponibles</h5>
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
                  <td>{stockDisponible[producto.idProducto] || producto.disponibilidad}</td>
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
        </div>

        {productosSeleccionados.length > 0 && (
          <div className="mb-4">
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
                        onClick={() => handleAjustarCantidad(producto.idProducto!, -1)}
                        disabled={producto.cantidad <= 1}
                      >
                        -
                      </Button>
                      <span>{producto.cantidad}</span>
                      <Button
                        size="sm"
                        variant="outline-secondary" 
                        onClick={() => handleAjustarCantidad(producto.idProducto!, 1)}
                        disabled={stockDisponible[producto.idProducto] <= 0}
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

        <div className="notas-section mt-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowNotas(!showNotas)}
              className="d-flex align-items-center gap-2"
            >
              <PenSquare size={16} />
              {showNotas ? 'Ocultar notas' : 'Agregar notas'}
            </Button>
          </div>

          {showNotas && (
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Notas adicionales para el pedido..."
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
              />
            </Form.Group>
          )}
        </div>

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
      <ClienteForm // 5. Agregar ClienteForm
        show={showClienteForm}
        onHide={() => setShowClienteForm(false)}
        onSave={handleSaveCliente}
      />
    </div>
  );
};

export default PedidosForm;