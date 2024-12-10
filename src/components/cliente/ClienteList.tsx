// src/components/cliente/ClienteList.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert, Form, InputGroup, Modal } from 'react-bootstrap';
import { Search, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import ClienteCard from './ClienteCard';
import ClienteForm from './ClienteForm';
import { Cliente } from '../../types/cliente';
import ClienteService from '../../service/clienteService';
import pedidoService from '../../service/pedidoService';
import AuthService from '../../service/auth';
import '../../styles/barraBusqueda.css'

const ClienteList = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const isAdmin = AuthService.isAdmin();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<number | null>(null);

  const loadClientes = async () => {
    try {
      const data = await ClienteService.getAllClientes();
      setClientes(data);
    } catch (error) {
      setError('Error al cargar clientes');
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error]);

  const handleSave = async (cliente: Cliente) => {
    try {
      if (selectedCliente) {
        await ClienteService.updateCliente(selectedCliente.idCliente, cliente);
      } else {
        await ClienteService.createCliente(cliente);
      }
      loadClientes();
      setShowForm(false);
      setSelectedCliente(undefined);
    } catch (error) {
      alert('Error al guardar cliente');
    }
  };

  const handleDelete = async (id: number) => {
    if (!isAdmin) {
      toast.error('No tienes permisos para eliminar clientes');
      return;
    }
    setClienteToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!clienteToDelete) return;

    try {
      const pedidos = await pedidoService.listarPedidos();
      const tienePedidos = pedidos.some(pedido => pedido.idCliente === clienteToDelete);
  
      if (tienePedidos) {
        toast.error('No se puede eliminar el cliente porque tiene pedidos asociados');
        return;
      }

      await ClienteService.deleteCliente(clienteToDelete);
      await loadClientes();
      toast.success('Cliente eliminado exitosamente');

    } catch (error) {
      toast.error('Error al eliminar cliente');
    } finally {
      setShowDeleteModal(false);
      setClienteToDelete(null);
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setShowForm(true);
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Clientes</h2>
        </Col>
        <Col xs="auto">
          <Button
            variant="primary"
            onClick={() => {
              setSelectedCliente(undefined);
              setShowForm(true);
            }}
          >
            Nuevo Cliente
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <Search size={20} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar cliente por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      <Container fluid>
        <div className="card-grid">
          {filteredClientes.map((cliente) => (
            <div key={cliente.idCliente} className="modern-card">
              <ClienteCard
                cliente={cliente}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          ))}
          {filteredClientes.length === 0 && (
            <Col xs={12} className="text-center mt-4">
              <p className="text-muted">
                No se encontraron clientes que coincidan con la búsqueda
              </p>
            </Col>
          )}
        </div>
      </Container>

      <ClienteForm
        show={showForm}
        onHide={() => {
          setShowForm(false);
          setSelectedCliente(undefined);
        }}
        onSave={handleSave}
        cliente={selectedCliente}
      />

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea eliminar este cliente? Esta acción no se puede deshacer.
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
    </Container>
  );
};

export default ClienteList;