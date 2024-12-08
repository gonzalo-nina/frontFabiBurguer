// src/components/cliente/ClienteList.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import ClienteCard from './ClienteCard';
import ClienteForm from './ClienteForm';
import { Cliente } from '../../types/cliente';
import ClienteService from '../../service/clienteService';
import pedidoService from '../../service/pedidoService';
import AuthService from '../../service/auth';


const ClienteList = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | undefined>();
  const [error, setError] = useState<string | null>(null);
  const isAdmin = AuthService.isAdmin();

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
    // Only allow admin to delete
    if (!isAdmin) {
      setError('No tienes permisos para eliminar clientes');
      return;
    }

    try {
      const pedidos = await pedidoService.listarPedidos();
      const tienePedidos = pedidos.some(pedido => pedido.idCliente === id);
  
      if (tienePedidos) {
        setError('No se puede eliminar el cliente porque tiene pedidos asociados');
        return;
      }
  
      if (window.confirm('¿Está seguro de eliminar este cliente?')) {
        await ClienteService.deleteCliente(id);
        loadClientes();
      }
    } catch (error) {
      setError('Error al eliminar cliente');
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setShowForm(true);
  };

  return (
    <Container className="py-4">
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
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

      <Container fluid>
        <div className="card-grid">
          {clientes.map((cliente) => (
            <div key={cliente.idCliente} className="modern-card">
              <ClienteCard
                cliente={cliente}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          ))}
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
    </Container>
  );
};

export default ClienteList;