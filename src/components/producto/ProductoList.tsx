// src/components/producto/ProductoList.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import ProductoCard from './ProductoCard';
import ProductoForm from './ProductoForm';
import { Producto } from '../../types/producto';
import ProductoService from '../../service/productoService';
import pedidoService from '../../service/pedidoService';
import AuthService from '../../service/auth'; // Add this

 // Add this

const ProductoList = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isAdmin = AuthService.isAdmin(); // Add this

  const loadProductos = async () => {
    try {
      setLoading(true);
      const data = await ProductoService.getAllProductos();
      setProductos(data);
    } catch (error) {
      console.error('Error loading productos:', error);
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductos();
  }, []);

  const handleSave = async (producto: Producto) => {
    try {
      setLoading(true);
      setError(null);

      // Validación adicional para edición
      if (selectedProducto) {
        // Verificar si el nombre ya existe en otro producto
        const productoExistente = productos.find(
          p => p.nombre === producto.nombre && 
              p.idProducto !== selectedProducto.idProducto
        );

        if (productoExistente) {
          setError('Ya existe un producto con este nombre');
          return;
        }

        await ProductoService.updateProducto(selectedProducto.idProducto, producto);
      } else {
        // Verificar si el nombre ya existe para nuevo producto
        const productoExistente = productos.find(
          p => p.nombre === producto.nombre
        );

        if (productoExistente) {
          setError('Ya existe un producto con este nombre');
          return;
        }

        await ProductoService.createProducto(producto);
      }

      await loadProductos();
      setShowForm(false);
      setSelectedProducto(undefined);
    } catch (error) {
      console.error('Error saving producto:', error);
      setError('Error al guardar producto');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      const tieneDetalles = await pedidoService.verificarProductoEnDetalles(id);

      if (tieneDetalles) {
        setError('No se puede eliminar el producto porque está siendo usado en pedidos');
        return;
      }

      if (window.confirm('¿Está seguro de eliminar este producto?')) {
        await ProductoService.deleteProducto(id);
        await loadProductos();
      }
    } catch (error) {
      console.error('Error deleting producto:', error);
      setError('Error al eliminar producto');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (producto: Producto) => {
    setSelectedProducto(producto);
    setShowForm(true);
    setError(null);
  };

  return (
    <Container className="py-4">
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <Row className="mb-4">
        <Col>
          <h2>Productos</h2>
        </Col>
        {isAdmin && ( // Add this conditional rendering
          <Col xs="auto">
            <Button
              variant="primary"
              onClick={() => {
                setSelectedProducto(undefined);
                setShowForm(true);
                setError(null);
              }}
              disabled={loading}
            >
              Nuevo Producto
            </Button>
          </Col>
        )}
      </Row>

      {loading ? (
        <div className="text-center">Cargando...</div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {productos.map((producto) => (
            <Col key={producto.idProducto}>
              <ProductoCard
                producto={producto}
                onEdit={isAdmin ? handleEdit : () => {}} // Add conditional
                onDelete={isAdmin ? handleDelete : () => {}} // Add conditional
              />
            </Col>
          ))}
        </Row>
      )}

      {isAdmin && ( // Add this conditional rendering
        <ProductoForm
          show={showForm}
          onHide={() => {
            setShowForm(false);
            setSelectedProducto(undefined);
            setError(null);
          }}
          onSave={handleSave}
          producto={selectedProducto}
        />
      )}
    </Container>
  );
};

export default ProductoList;