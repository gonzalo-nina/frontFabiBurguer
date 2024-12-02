// src/components/common/GenericCard.tsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';

interface GenericCardProps<T> {
  item: T;
  displayFields: { key: keyof T; label: string }[];
  onEdit: (item: T) => void;
  onDelete: (id: number) => void;
}

const GenericCard = <T extends { id?: number }>({ 
  item, 
  displayFields, 
  onEdit, 
  onDelete 
}: GenericCardProps<T>) => {
  return (
    <Card className="modern-card">
      <Card.Body className="d-flex flex-column">
        <Card.Title className="modern-card-title mb-3">
          {(item as any).nombre || (item as any).nombreCatalogo}
        </Card.Title>
        
        <div className="flex-grow-1 mb-4">
          {displayFields.map(field => (
            <div key={String(field.key)} className="field-item">
              <span className="field-label">{field.label}:</span>
              <span className="field-value">
                {field.key === 'fechaRegistro' 
                  ? new Date((item[field.key] as any)).toLocaleDateString()
                  : String(item[field.key])}
              </span>
            </div>
          ))}
        </div>
        
        <div className="button-group">
          <Button 
            variant="outline-primary" 
            className="action-button" 
            onClick={() => onEdit(item)}
          >
            Editar
          </Button>
          <Button 
            variant="outline-danger" 
            className="action-button" 
            onClick={() => onDelete(item.id!)}
          >
            Eliminar
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default GenericCard;