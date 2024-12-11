// src/components/producto/ProductoForm.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Producto } from '../../types/producto';
import { Catalogo } from '../../types/catalogo';
import CatalogoService from '../../service/catalogoService';

interface ProductoFormProps {
  show: boolean;
  onHide: () => void;
  onSave: (producto: Producto) => void;
  producto?: Producto;
}

const DEFAULT_URL = "https://www.idelcosa.com/img/default.jpg";

const ProductoForm = ({ show, onHide, onSave, producto }: ProductoFormProps) => {
  const [formData, setFormData] = useState<Producto>({
    idProducto: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    disponibilidad: 0,
    idCatalogo: 0,
    url: ''
  });

  const [catalogos, setCatalogos] = useState<Catalogo[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadCatalogos = async () => {
      try {
        const data = await CatalogoService.getAllCatalogos();
        setCatalogos(data);
      } catch (error) {
        console.error('Error loading catalogos:', error);
      }
    };

    if (show) {
      loadCatalogos();
      setFormData(producto || {
        idProducto: 0,
        nombre: '',
        descripcion: '',
        precio: 0,
        disponibilidad: 0,
        idCatalogo: 0,
        url: ''
      });
      setErrors({});
    }
  }, [show, producto]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre) newErrors.nombre = 'El nombre es requerido';
    if (!formData.descripcion) newErrors.descripcion = 'La descripción es requerida';
    if (formData.precio < 0) newErrors.precio = 'El precio debe ser mayor o igual a 0';
    if (formData.disponibilidad < 0) newErrors.disponibilidad = 'La disponibilidad debe ser mayor o igual a 0';
    if (!formData.idCatalogo) newErrors.idCatalogo = 'Debe seleccionar un catálogo';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      // Si url está vacía, usar la URL por defecto
      const productoWithUrl = {
        ...formData,
        url: formData.url || DEFAULT_URL
      };
      onSave(productoWithUrl);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{producto ? 'Editar Producto' : 'Nuevo Producto'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>
              Nombre <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              isInvalid={!!errors.nombre}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.nombre}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Descripción <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              isInvalid={!!errors.descripcion}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.descripcion}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Precio <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              min="0"
              step="0.01"
              value={formData.precio}
              onChange={(e) => setFormData({...formData, precio: parseFloat(e.target.value)})}
              isInvalid={!!errors.precio}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.precio}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Disponibilidad <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              min="0"
              value={formData.disponibilidad}
              onChange={(e) => setFormData({...formData, disponibilidad: parseInt(e.target.value)})}
              isInvalid={!!errors.disponibilidad}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.disponibilidad}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Catálogo <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              value={formData.idCatalogo}
              onChange={(e) => setFormData({...formData, idCatalogo: parseInt(e.target.value)})}
              isInvalid={!!errors.idCatalogo}
              required
            >
              <option value="">Seleccione un catálogo</option>
              {catalogos.map(catalogo => (
                <option key={catalogo.idCatalogo} value={catalogo.idCatalogo}>
                  {catalogo.nombreCatalogo}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.idCatalogo}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>URL de la imagen</Form.Label>
            <Form.Control
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              isInvalid={!!errors.url}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            <Form.Control.Feedback type="invalid">
              {errors.url}
            </Form.Control.Feedback>
          </Form.Group>

          <small className="text-muted">
            Los campos marcados con <span className="text-danger">*</span> son obligatorios
          </small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ProductoForm;