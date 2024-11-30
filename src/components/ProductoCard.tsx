// src/components/ProductCard.tsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Producto } from '../types/producto';

interface ProductCardProps {
  producto: Producto;
  onEdit: (producto: Producto) => void;
  onDelete: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ producto, onEdit, onDelete }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{producto.nombre}</Card.Title>
        <Card.Text>
          <strong>Descripción:</strong> {producto.descripcion}<br/>
          <strong>Precio:</strong> ${producto.precio.toFixed(2)}<br/>
          <strong>Disponibilidad:</strong> {producto.disponibilidad} unidades<br/>
          <strong>Catálogo ID:</strong> {producto.idCatalogo}
        </Card.Text>
        <Button variant="primary" className="me-2" onClick={() => onEdit(producto)}>
          Editar
        </Button>
        <Button variant="danger" onClick={() => onDelete(producto.idProducto!)}>
          Eliminar
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;