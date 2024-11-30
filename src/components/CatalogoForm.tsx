// src/components/CatalogoForm.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Catalogo } from '../types/catalogo';

interface CatalogoFormProps {
  show: boolean;
  onHide: () => void;
  onSave: (catalogo: Catalogo) => void;
  catalogo?: Catalogo;
}

const CatalogoForm: React.FC<CatalogoFormProps> = ({ show, onHide, onSave, catalogo }) => {
  const initialFormData: Catalogo = {
    nombreCatalogo: '',
    descripcionCatalogo: ''
  };

  const [formData, setFormData] = useState<Catalogo>(initialFormData);

  useEffect(() => {
    if (show) {
      setFormData(catalogo || initialFormData);
    }
  }, [show, catalogo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onHide();
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
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.descripcionCatalogo}
              onChange={(e) => setFormData({...formData, descripcionCatalogo: e.target.value})}
              required
            />
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