// src/components/common/BaseCard.tsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';

interface BaseCardProps<T> {
  item: T;
  titleField: keyof T;
  descriptionField?: keyof T;
  fields?: Array<{
    key: keyof T;
    label: string;
    format?: (value: any) => string;
  }>;
  onEdit: (item: T) => void;
  onDelete: (id: number) => void;
  idField: keyof T;
}

const BaseCard = <T extends object>({ 
  item, 
  titleField,
  descriptionField,
  fields = [],
  onEdit, 
  onDelete,
  idField
}: BaseCardProps<T>) => {
  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title>{String(item[titleField])}</Card.Title>
        {descriptionField && (
          <div className="mb-3">
            <p><strong>Descripción:</strong> {String(item[descriptionField])}</p>
          </div>
        )}
        {fields.length > 0 && (
          <div className="mb-3">
            {fields.map(field => (
              <p key={String(field.key)}>
                <strong>{field.label}:</strong>{' '}
                {field.format ? field.format(item[field.key]) : String(item[field.key])}
              </p>
            ))}
          </div>
        )}
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={() => onEdit(item)}>
            Editar
          </Button>
          <Button variant="outline-danger" onClick={() => onDelete(item[idField] as number)}>
            Eliminar
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BaseCard;