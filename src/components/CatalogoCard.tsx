// src/components/CatalogoCard.tsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Catalogo } from '../types/catalogo';

interface CatalogoCardProps {
  catalogo: Catalogo;
  onEdit: (catalogo: Catalogo) => void;
  onDelete: (id: number) => void;
}

const CatalogoCard: React.FC<CatalogoCardProps> = ({ catalogo, onEdit, onDelete }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{catalogo.nombreCatalogo}</Card.Title>
        <Card.Text>
          <strong>Descripción:</strong> {catalogo.descripcionCatalogo}<br/>
          <strong>ID:</strong> {catalogo.idCatalogo}
        </Card.Text>
        <Button variant="primary" className="me-2" onClick={() => onEdit(catalogo)}>
          Editar
        </Button>
        <Button variant="danger" onClick={() => onDelete(catalogo.idCatalogo!)}>
          Eliminar
        </Button>
      </Card.Body>
    </Card>
  );
};

export default CatalogoCard;