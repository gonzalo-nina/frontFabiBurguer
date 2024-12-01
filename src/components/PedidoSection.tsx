import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import pedidoService from '../service/pedidoService';
import { Pedido } from '../types/Pedido';
import PedidosForm from './PedidosForm'; 
const PedidosSection = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      const data = await pedidoService.listarPedidos();
      setPedidos(data);
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

 

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este pedido?')) {
      try {
        await pedidoService.eliminarPedido(id);
        cargarPedidos();
      } catch (error) {
        setError('Error al eliminar el pedido');
        console.error('Error:', error);
      }
    }
  };

  const handlePedido = async (pedido: Pedido) => {
    try {
      setLoading(true);
      if (selectedPedido?.idPedido) {
        await pedidoService.actualizarPedido(selectedPedido.idPedido, pedido);
      } else {
        await pedidoService.crearPedido(pedido);
      }
      setShowModal(false);
      cargarPedidos();
    } catch (error) {
      setError('Error al guardar el pedido');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEstado = async (id: number, estado: boolean) => {
    try {
      await pedidoService.actualizarEstadoPedido(id, estado);
      cargarPedidos();
    } catch (error) {
      setError('Error al actualizar el estado del pedido');
      console.error('Error:', error);
    }
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

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      {loading ? (
        <div className="text-center">Cargando...</div>
      ) : (
        <Table striped bordered hover responsive>
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
                <td>{new Date(pedido.fecha).toLocaleDateString()}</td>
                <td>{pedido.clienteId}</td>
                <td>${pedido.total.toFixed(2)}</td>
                <td>
                  <Form.Check
                    type="switch"
                    id={`estado-${pedido.idPedido}`}
                    checked={pedido.estado}
                    onChange={(e) => pedido.idPedido && 
                      handleEstado(pedido.idPedido, e.target.checked)}
                  />
                </td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => {
                      setSelectedPedido(pedido);
                      setShowModal(true);
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
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
    />
  </Modal.Body>
</Modal>
    </div>
  );
};


export default PedidosSection;