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
      <Card.Body>
        <Card.Title>{producto.nombre}</Card.Title>
        <div className="mb-3">
          <p><strong>Descripción:</strong> {producto.descripcion}</p>
          <p><strong>Precio:</strong> S/. {producto.precio}</p>
          <p><strong>Disponibilidad:</strong> {producto.disponibilidad}</p>
          <p><strong>Catálogo:</strong> {catalogoNombre}</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={() => onEdit(producto)}>
            Editar
          </Button>
          <Button variant="outline-danger" onClick={() => onDelete(producto.idProducto)}>
            Eliminar
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductoCard;