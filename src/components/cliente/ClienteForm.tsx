// src/components/cliente/ClienteForm.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Cliente } from '../../types/cliente';

interface ClienteFormProps {
  show: boolean;
  onHide: () => void;
  onSave: (cliente: Cliente) => void;
  cliente?: Cliente;
}
const DEFAULT_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgWHYGTSvwcmgpuvHXsG3v6olrG51pr-mXSQ&s";
const ClienteForm = ({ show, onHide, onSave, cliente }: ClienteFormProps) => {
  const [formData, setFormData] = useState<Cliente>({
    idCliente: 0,
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    url: DEFAULT_URL
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cliente) {
      setFormData(cliente);
    } else {
      setFormData({
        idCliente: 0,
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        url: DEFAULT_URL
      });
    }
    setErrors({});
  }, [cliente, show]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre) newErrors.nombre = 'El nombre es requerido';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (formData.telefono && !/^\d{1,9}$/.test(formData.telefono)) {
      newErrors.telefono = 'Teléfono inválido (máx 9 dígitos)';
    }
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
    <Modal show={show} onHide={onHide} backdropClassName="custom-backdrop"
    style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
      <Modal.Header closeButton>
        <Modal.Title>{cliente ? 'Editar Cliente' : 'Nuevo Cliente'}</Modal.Title>
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
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              value={formData.telefono}
              onChange={(e) => setFormData({...formData, telefono: e.target.value})}
              isInvalid={!!errors.telefono}
            />
            <Form.Control.Feedback type="invalid">
              {errors.telefono}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              value={formData.direccion}
              onChange={(e) => setFormData({...formData, direccion: e.target.value})}
              isInvalid={!!errors.direccion}
            />
            <Form.Control.Feedback type="invalid">
              {errors.direccion}
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

export default ClienteForm;