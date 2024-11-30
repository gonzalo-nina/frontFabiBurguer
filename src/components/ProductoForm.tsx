// src/components/ProductForm.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Producto } from '../types/producto';

interface ProductFormProps {
  show: boolean;
  onHide: () => void;
  onSave: (producto: Producto) => void;
  producto?: Producto;
}

const ProductForm: React.FC<ProductFormProps> = ({ show, onHide, onSave, producto }) => {
  const initialFormData: Producto = {
    idCatalogo: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    disponibilidad: 0
  };

  const [formData, setFormData] = useState<Producto>(initialFormData);
  const [errors, setErrors] = useState({
    precio: '',
    disponibilidad: '',
    idCatalogo: ''
  });

  useEffect(() => {
    if (show) {
      setFormData(producto || initialFormData);
      setErrors({ precio: '', disponibilidad: '', idCatalogo: '' });
    }
  }, [show, producto]);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Producto) => {
    const value = e.target.value;
    const num = Number(value);

    if (value === '') {
      setFormData({ ...formData, [field]: 0 });
      return;
    }

    if (field === 'precio') {
      if (!isNaN(num) && num >= 0) {
        setFormData({ ...formData, [field]: Number(Number(value).toFixed(2)) });
        setErrors({ ...errors, [field]: '' });
      } else {
        setErrors({ ...errors, [field]: 'El precio debe ser un número positivo' });
      }
    } else if (field === 'disponibilidad' || field === 'idCatalogo') {
      if (!isNaN(num) && Number.isInteger(num) && num >= 0) {
        setFormData({ ...formData, [field]: num });
        setErrors({ ...errors, [field]: '' });
      } else {
        setErrors({ ...errors, [field]: `El campo debe ser un número entero positivo` });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.values(errors).some(error => error !== '')) {
      return;
    }

    if (formData.precio <= 0) {
      setErrors({ ...errors, precio: 'El precio debe ser mayor a 0' });
      return;
    }

    onSave(formData);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{producto ? 'Editar Producto' : 'Nuevo Producto'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>ID Catálogo</Form.Label>
            <Form.Control
              type="number"
              min="0"
              value={formData.idCatalogo}
              onChange={(e) => handleNumberChange(e, 'idCatalogo')}
              isInvalid={!!errors.idCatalogo}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.idCatalogo}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio ($)</Form.Label>
            <Form.Control
              type="number"
              min="0"
              step="0.01"
              value={formData.precio}
              onChange={(e) => handleNumberChange(e, 'precio')}
              isInvalid={!!errors.precio}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.precio}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Disponibilidad</Form.Label>
            <Form.Control
              type="number"
              min="0"
              value={formData.disponibilidad}
              onChange={(e) => handleNumberChange(e, 'disponibilidad')}
              isInvalid={!!errors.disponibilidad}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.disponibilidad}
            </Form.Control.Feedback>
          </Form.Group>
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

export default ProductForm;