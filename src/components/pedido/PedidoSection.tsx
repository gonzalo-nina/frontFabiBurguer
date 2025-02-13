import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import pedidoService from '../../service/pedidoService';
import { Pedido, DetallePedido } from '../../types/Pedido';
import PedidosForm from './PedidosForm';
import clienteService from '../../service/clienteService';
import { Cliente } from '../../types/cliente';
import productoService from '../../service/productoService';
import { Producto } from '../../types/producto';
import { toast } from 'react-toastify';

const PedidosSection = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedPedidoView, setSelectedPedidoView] = useState<Pedido | null>(null);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pedidoToComplete, setPedidoToComplete] = useState<{id: number, estado: boolean} | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [pedidoToDelete, setPedidoToDelete] = useState<number | null>(null);

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      const data = await pedidoService.listarPedidos();
      const transformedData = data.map(pedido => ({
        ...pedido,
        fechaPedido: pedido.fechaPedido || ''
      }));
      setPedidos(transformedData);
    } catch (error) {
      setError('Error al cargar los pedidos');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const clientesData = await clienteService.getAllClientes();
        setClientes(clientesData);
      } catch (error) {
        console.error('Error al cargar clientes:', error);
      }
    };
    cargarClientes();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error]);

  const handleDelete = (id: number) => {
    setPedidoToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!pedidoToDelete) return;
    
    try {
      // 1. Obtener detalles del pedido
      const detalles = await pedidoService.obtenerDetallesPedido(pedidoToDelete);
      
      // 2. Eliminar cada detalle para que se restauren las cantidades
      for (const detalle of detalles) {
        if (detalle.idDetallePedido) {
          await pedidoService.eliminarDetallePedido(detalle.idDetallePedido);
        }
      }

      // 3. Eliminar el pedido
      await pedidoService.eliminarPedido(pedidoToDelete);
      await cargarPedidos();
      toast.success('Pedido eliminado exitosamente 🗑️');
    } catch (error) {
      toast.error('Error al eliminar el pedido ❌');
      console.error('Error:', error);
    } finally {
      setShowDeleteModal(false);
      setPedidoToDelete(null);
    }
  };

  const handlePedido = async (pedido: Pedido) => {
    try {
      setLoading(true);
      // Si es un pedido existente (edición)
      if (selectedPedido?.idPedido) {
        await pedidoService.actualizarPedido(selectedPedido.idPedido, pedido);
        toast.success('Pedido actualizado exitosamente 🎉');
      }
      // NO necesitamos crear el pedido aquí porque ya fue creado en PedidosForm
      setShowModal(false);
      await cargarPedidos();
    } catch (error) {
      toast.error('Error al guardar el pedido ❌');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEstado = async (id: number, estado: boolean) => {
    setPedidoToComplete({id, estado});
    setShowConfirmModal(true);
  };

  const handleConfirmComplete = async () => {
    if (!pedidoToComplete) return;
    
    try {
      await pedidoService.actualizarEstadoPedido(pedidoToComplete.id, pedidoToComplete.estado);
      await cargarPedidos();
      toast.success('Estado del pedido actualizado exitosamente 🎉');
    } catch (error) {
      toast.error('Error al actualizar el estado del pedido ❌');
      console.error('Error:', error);
    } finally {
      setShowConfirmModal(false);
      setPedidoToComplete(null);
    }
  };

  const PedidoVisualizacion: React.FC<{ pedido: Pedido | null }> = ({ pedido }) => {
    const [detalles, setDetalles] = useState<DetallePedido[]>([]);
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [productos, setProductos] = useState<Producto[]>([]);
  
    useEffect(() => {
      const cargarDatos = async () => {
        if (pedido?.idPedido) {
          try {
            const [detallesData, clienteData, productosData] = await Promise.all([
              pedidoService.obtenerDetallesPedido(pedido.idPedido),
              clienteService.getClienteById(pedido.idCliente),
              productoService.getAllProductos()
            ]);
  
            setDetalles(detallesData);
            setCliente(clienteData);
            setProductos(productosData);
          } catch (error) {
            console.error('Error al cargar datos:', error);
          }
        }
      };
      cargarDatos();
    }, [pedido]);
  
    const getProductoNombre = (idProducto: number) => {
      const producto = productos.find(p => p.idProducto === idProducto);
      return producto?.nombre || 'Producto no encontrado';
    };
  
    return (
      <div>
        <h5 className="mb-4">Cliente: {cliente?.nombre || 'Cargando...'}</h5>
        <h6>Productos:</h6>
        <div className="productos-grid">
          {detalles.map(detalle => (
            <div key={detalle.idDetallePedido} className="producto-card">
              <div className="producto-header">
                <h3 className="producto-title">
                  {getProductoNombre(detalle.producto.idProducto)}
                </h3>
              </div>
              <div className="producto-cantidad">
                <span>Cantidad: {detalle.cantidad}</span>
              </div>
              <div className="producto-subtotal">
                <span>Subtotal:</span>
                <span>S/. {detalle.subtotal.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
        {pedido?.notasAdicionales && (
        <div className="notas-section mt-4">
          <h6>Notas Adicionales:</h6>
          <div className="notas-content p-3 bg-light rounded">
            {pedido.notasAdicionales}
          </div>
        </div>
      )}
      </div>
    );
  };
  
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Pedidos</h2>
        <Button 
          variant="primary" 
          onClick={() => {
            setSelectedPedido(null);
            setShowModal(true);
          }}
        >
          Nuevo Pedido
        </Button>
      </div>

      {loading ? (
        <div className="text-center">Cargando...</div>
      ) : (
        <Table className="modern-table" hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.idPedido}>
                <td>{pedido.idPedido}</td>
                <td>{new Date(pedido.fechaPedido).toLocaleDateString()}</td>
                <td>
                  {clientes.find(cliente => cliente.idCliente === pedido.idCliente)?.nombre || 'Cliente no encontrado'}
                </td>
                <td>S/. {pedido.subtotal.toFixed(2)}</td>
                <td>
                  <Form.Check
                    type="switch"
                    id={`estado-${pedido.idPedido}`}
                    checked={pedido.estadoPedido}
                    onChange={(e) => pedido.idPedido && 
                      handleEstado(pedido.idPedido, e.target.checked)}
                  />
                </td>
                <td className="action-buttons">
                  <Button
                    variant="warning"
                    size="sm"
                    className="action-btn action-btn-edit me-2"
                    onClick={() => {
                      setSelectedPedido(pedido);
                      setShowModal(true);
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="info"
                    size="sm"
                    className="action-btn action-btn-view me-2"
                    onClick={() => {
                      setSelectedPedidoView(pedido);
                      setShowViewModal(true);
                    }}
                  >
                    Visualizar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="action-btn action-btn-delete"
                    onClick={() => pedido.idPedido && handleDelete(pedido.idPedido)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

<Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
  <Modal.Header closeButton>
    <Modal.Title>
      {selectedPedido ? 'Editar Pedido' : 'Nuevo Pedido'}
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <PedidosForm 
      onSubmit={handlePedido}
      onCancel={() => setShowModal(false)}
      selectedPedido={selectedPedido}
    />
  </Modal.Body>
</Modal>

<Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Detalle del Pedido</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <PedidoVisualizacion pedido={selectedPedidoView} />
  </Modal.Body>
</Modal>

<Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Confirmar Cambio de Estado</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    ¿Está seguro de {pedidoToComplete?.estado ? 'completar' : 'desmarcar como completado'} este pedido?
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
      Cancelar
    </Button>
    <Button variant="primary" onClick={handleConfirmComplete}>
      Confirmar
    </Button>
  </Modal.Footer>
</Modal>

<Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Confirmar Eliminación</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    ¿Está seguro de eliminar este pedido? Esta acción no se puede deshacer.
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
      Cancelar
    </Button>
    <Button variant="danger" onClick={handleConfirmDelete}>
      Eliminar
    </Button>
  </Modal.Footer>
</Modal>
    </div>
  );
};


export default PedidosSection;