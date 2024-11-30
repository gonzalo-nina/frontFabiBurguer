// src/components/ClientList.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import ClientCard from './ClienteCard';
import ClientForm from './ClienteForm';
import ClienteService from '../service/clienteService';
import { Cliente } from '../types/cliente';

const ClientList: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | undefined>();

  const loadClientes = async () => {
    try {
      const data = await ClienteService.getAllClientes();
      setClientes(data);
    } catch (error) {
      console.error('Error loading clients:', error);
      alert('Error al cargar los clientes');
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  const handleSave = async (cliente: Cliente) => {
    try {
      if (selectedCliente?.idCliente) {
        await ClienteService.updateCliente(selectedCliente.idCliente, cliente);
      } else {
        await ClienteService.createCliente(cliente);
      }
      loadClientes();
      setShowForm(false);
      setSelectedCliente(undefined);
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Error al guardar el cliente');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este cliente?')) {
      try {
        await ClienteService.deleteCliente(id);
        loadClientes();
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Error al eliminar el cliente');
      }
    }
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
      
      <Row xs={1} md={2} lg={3} className="g-4">
        {clientes.map((cliente) => (
          <Col key={cliente.idCliente}>
            <ClientCard
              cliente={cliente}
              onEdit={(cliente) => {
                setSelectedCliente(cliente);
                setShowForm(true);
              }}
              onDelete={handleDelete}
            />
          </Col>
        ))}
      </Row>

      <ClientForm
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

export default ClientList;