// src/components/ProductList.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import ProductCard from './ProductoCard';
import ProductForm from './ProductoForm';
import ProductoService from '../service/productoService';
import { Producto } from '../types/producto';

const ProductList: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | undefined>();

  const loadProductos = async () => {
    try {
      const data = await ProductoService.getAllProductos();
      setProductos(data);
    } catch (error) {
      console.error('Error loading products:', error);
      alert('Error al cargar los productos');
    }
  };

  useEffect(() => {
    loadProductos();
  }, []);

  const handleSave = async (producto: Producto) => {
    try {
      if (selectedProducto?.idProducto) {
        await ProductoService.updateProducto(selectedProducto.idProducto, producto);
      } else {
        await ProductoService.createProducto(producto);
      }
      loadProductos();
      setShowForm(false);
      setSelectedProducto(undefined);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este producto?')) {
      try {
        await ProductoService.deleteProducto(id);
        loadProductos();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Productos</h2>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary"
            onClick={() => {
              setSelectedProducto(undefined);
              setShowForm(true);
            }}
          >
            Nuevo Producto
          </Button>
        </Col>
      </Row>
      
      <Row xs={1} md={2} lg={3} className="g-4">
        {productos.map((producto) => (
          <Col key={producto.idProducto}>
            <ProductCard
              producto={producto}
              onEdit={(producto) => {
                setSelectedProducto(producto);
                setShowForm(true);
              }}
              onDelete={handleDelete}
            />
          </Col>
        ))}
      </Row>

      <ProductForm
        show={showForm}
        onHide={() => {
          setShowForm(false);
          setSelectedProducto(undefined);
        }}
        onSave={handleSave}
        producto={selectedProducto}
      />
    </Container>
  );
};

export default ProductList;