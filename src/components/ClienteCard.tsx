// src/components/ClientCard.tsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Cliente } from '../types/cliente';

interface ClientCardProps {
  cliente: Cliente;
  onEdit: (cliente: Cliente) => void;
  onDelete: (id: number) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ cliente, onEdit, onDelete }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{cliente.nombre}</Card.Title>
        <Card.Text>
          <strong>Email:</strong> {cliente.email}<br/>
          <strong>Teléfono:</strong> {cliente.telefono}<br/>
          <strong>Dirección:</strong> {cliente.direccion}<br/>
          <strong>Fecha de registro:</strong> {new Date(cliente.fechaRegistro).toLocaleDateString()}
        </Card.Text>
        <Button variant="primary" className="me-2" onClick={() => onEdit(cliente)}>
          Editar
        </Button>
        <Button variant="danger" onClick={() => onDelete(cliente.idCliente!)}>
          Eliminar
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ClientCard;