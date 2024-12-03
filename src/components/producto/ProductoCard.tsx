// src/components/producto/ProductoCard.tsx
import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Producto } from '../../types/producto';
import { Catalogo } from '../../types/catalogo';
import CatalogoService from '../../service/catalogoService';

interface ProductoCardProps {
  producto: Producto;
  onEdit: (producto: Producto) => void;
  onDelete: (id: number) => void;
}

const ProductoCard = ({ producto, onEdit, onDelete }: ProductoCardProps) => {
  const [catalogoNombre, setCatalogoNombre] = useState<string>('Cargando...');

  useEffect(() => {
    const loadCatalogo = async () => {
      try {
        const catalogo = await CatalogoService.getCatalogoById(producto.idCatalogo);
        setCatalogoNombre(catalogo.nombreCatalogo);
      } catch (error) {
        console.error('Error loading catalogo:', error);
        setCatalogoNombre('No encontrado');
      }
    };
    loadCatalogo();
  }, [producto.idCatalogo]);

  return (
    <Card className="h-100">
      <Card.Img 
        variant="top" 
        src={producto.url || 'https://via.placeholder.com/300x200'} 
        alt={producto.nombre}
        style={{ height: '200px', objectFit: 'cover' }}
        onError={(e) => {
          e.currentTarget.src = 'https://via.placeholder.com/300x200';
        }}
      />
      <Card.Body>
        <Card.Title>{producto.nombre}</Card.Title>
        <div className="mb-3">
          <p><strong>Descripción:</strong> {producto.descripcion}</p>
          <p><strong>Precio:</strong> S/. {producto.precio}</p>
          <p><strong>Disponibilidad:</strong> {producto.disponibilidad}</p>
          <p><strong>Catálogo:</strong> {catalogoNombre}</p>
        </div>
        <div className="d-flex gap-2 action-buttons">
          <Button 
            variant="warning"
            size="sm"
            className="action-btn action-btn-edit"
            onClick={() => onEdit(producto)}
          >
            Editar
          </Button>
          <Button 
            variant="danger"
            size="sm"
            className="action-btn action-btn-delete"
            onClick={() => onDelete(producto.idProducto)}
          >
            Eliminar
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductoCard;