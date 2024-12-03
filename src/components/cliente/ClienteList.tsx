// src/components/cliente/ClienteList.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import ClienteCard from './ClienteCard';
import ClienteForm from './ClienteForm';
import { Cliente } from '../../types/cliente';
import ClienteService from '../../service/clienteService';
import pedidoService from '../../service/pedidoService';

const ClienteList = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | undefined>();

  const loadClientes = async () => {
    try {
      const data = await ClienteService.getAllClientes();
      setClientes(data);
    } catch (error) {
      console.error('Error loading clientes:', error);
      alert('Error al cargar clientes');
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
      console.error('Error saving cliente:', error);
      alert('Error al guardar cliente');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      // Obtener todos los pedidos
      const pedidos = await pedidoService.listarPedidos();
      
      // Verificar si algún pedido está asociado al cliente
      const tienePedidos = pedidos.some(pedido => pedido.idCliente === id);
  
      if (tienePedidos) {
        alert('No se puede eliminar el cliente porque tiene pedidos asociados');
        return;
      }
  
      if (window.confirm('¿Está seguro de eliminar este cliente?')) {
        await ClienteService.deleteCliente(id);
        loadClientes();
      }
    } catch (error) {
      console.error('Error deleting cliente:', error);
      alert('Error al eliminar cliente');
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setShowForm(true);
  };

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