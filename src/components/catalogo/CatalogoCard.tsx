// src/components/catalogo/CatalogoCard.tsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Catalogo } from '../../types/catalogo';

interface CatalogoCardProps {
  catalogo: Catalogo;
  onEdit: (catalogo: Catalogo) => void;
  onDelete: (id: number) => void;
}

const CatalogoCard = ({ catalogo, onEdit, onDelete }: CatalogoCardProps) => {
  return (
    <Card className="h-100">
      <Card.Img 
        variant="top" 
        src={catalogo.url || 'https://via.placeholder.com/300x200'} 
        alt={catalogo.nombreCatalogo}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body>
        <Card.Title>{catalogo.nombreCatalogo}</Card.Title>
        <div className="mb-3">
          <p><strong>Descripción:</strong> {catalogo.descripcionCatalogo}</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={() => onEdit(catalogo)}>
            Editar
          </Button>
          <Button variant="outline-danger" onClick={() => onDelete(catalogo.idCatalogo!)}>
            Eliminar
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CatalogoCard;