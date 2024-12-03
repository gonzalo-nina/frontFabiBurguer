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
      <Card.Img 
        variant="top" 
        src={cliente.url}
        alt={cliente.nombre}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body>
        <Card.Title>{cliente.nombre}</Card.Title>
        <div className="mb-3">
          <p><strong>Email:</strong> {cliente.email}</p>
          <p><strong>Teléfono:</strong> {cliente.telefono}</p>
          <p><strong>Dirección:</strong> {cliente.direccion}</p>
        </div>
        <div className="d-flex gap-2 action-buttons">
          <Button 
            variant="warning"
            size="sm"
            className="action-btn action-btn-edit"
            onClick={() => onEdit(cliente)}
          >
            Editar
          </Button>
          <Button 
            variant="danger"
            size="sm"
            className="action-btn action-btn-delete"
            onClick={() => onDelete(cliente.idCliente)}
          >
            Eliminar
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ClienteCard;