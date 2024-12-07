// src/components/catalogo/CatalogoCard.tsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Catalogo } from '../../types/catalogo';

interface CatalogoCardProps {
  catalogo: Catalogo;
  onEdit: (catalogo: Catalogo) => void;
  onDelete: (id: number) => void;
  isAdmin: boolean;
}

const CatalogoCard = ({ catalogo, onEdit, onDelete, isAdmin }: CatalogoCardProps) => {
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
        {isAdmin && (
          <div className="d-flex gap-2 action-buttons">
            <Button 
              variant="warning"
              size="sm"
              className="action-btn action-btn-edit"
              onClick={() => onEdit(catalogo)}
            >
              Editar
            </Button>
            <Button 
              variant="danger"
              size="sm"
              className="action-btn action-btn-delete"
              onClick={() => onDelete(catalogo.idCatalogo!)}
            >
              Eliminar
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default CatalogoCard;