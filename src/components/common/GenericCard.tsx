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
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{(item as any).nombre || (item as any).nombreCatalogo}</Card.Title>
        <Card.Text>
          {displayFields.map(field => (
            <div key={String(field.key)}>
              <strong>{field.label}:</strong>{' '}
              {field.key === 'fechaRegistro' 
                ? new Date((item[field.key] as any)).toLocaleDateString()
                : String(item[field.key])}
              <br/>
            </div>
          ))}
        </Card.Text>
        <Button variant="primary" className="me-2" onClick={() => onEdit(item)}>
          Editar
        </Button>
        <Button variant="danger" onClick={() => onDelete(item.id!)}>
          Eliminar
        </Button>
      </Card.Body>
    </Card>
  );
};

export default GenericCard;