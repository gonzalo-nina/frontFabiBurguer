// src/components/catalogo/CatalogoForm.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Catalogo } from '../../types/catalogo';

interface CatalogoFormProps {
  show: boolean;
  onHide: () => void;
  onSave: (catalogo: Catalogo) => void;
  catalogo?: Catalogo;
}

const CatalogoForm = ({ show, onHide, onSave, catalogo }: CatalogoFormProps) => {
  const [formData, setFormData] = useState<Catalogo>({
    nombreCatalogo: '',
    descripcionCatalogo: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (show) {
      setFormData(catalogo || {
        nombreCatalogo: '',
        descripcionCatalogo: ''
      });
      setErrors({});
    }
  }, [catalogo, show]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombreCatalogo) newErrors.nombreCatalogo = 'El nombre es requerido';
    if (!formData.descripcionCatalogo) newErrors.descripcionCatalogo = 'La descripción es requerida';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      onSave(formData);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{catalogo ? 'Editar Catálogo' : 'Nuevo Catálogo'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={formData.nombreCatalogo}
              onChange={(e) => setFormData({...formData, nombreCatalogo: e.target.value})}
              isInvalid={!!errors.nombreCatalogo}
            />
            <Form.Control.Feedback type="invalid">
              {errors.nombreCatalogo}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.descripcionCatalogo}
              onChange={(e) => setFormData({...formData, descripcionCatalogo: e.target.value})}
              isInvalid={!!errors.descripcionCatalogo}
            />
            <Form.Control.Feedback type="invalid">
              {errors.descripcionCatalogo}
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

export default CatalogoForm;