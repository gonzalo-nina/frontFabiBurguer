// src/components/cliente/ClienteCard.tsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Cliente } from '../../types/cliente';

interface ClienteCardProps {
  cliente: Cliente;
  onEdit: (cliente: Cliente) => void;
  onDelete: (id: number) => void;
}

const ClienteCard = ({ cliente, onEdit, onDelete }: ClienteCardProps) => {
  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title>{cliente.nombre}</Card.Title>
        <div className="mb-3">
          <p><strong>Email:</strong> {cliente.email}</p>
          <p><strong>Teléfono:</strong> {cliente.telefono}</p>
          <p><strong>Dirección:</strong> {cliente.direccion}</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={() => onEdit(cliente)}>
            Editar
          </Button>
          <Button variant="outline-danger" onClick={() => onDelete(cliente.idCliente)}>
            Eliminar
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ClienteCard;