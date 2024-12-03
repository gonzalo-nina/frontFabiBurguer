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

const ClienteForm = ({ show, onHide, onSave, cliente }: ClienteFormProps) => {
  const [formData, setFormData] = useState<Cliente>({
    idCliente: 0,
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
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
        direccion: ''
      });
    }
    setErrors({});
  }, [cliente, show]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre) newErrors.nombre = 'El nombre es requerido';
    if (!formData.email) newErrors.email = 'El email es requerido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.telefono) newErrors.telefono = 'El teléfono es requerido';
    if (!/^\d{1,9}$/.test(formData.telefono)) {
      newErrors.telefono = 'Teléfono inválido (máx 9 dígitos)';
    }
    if (!formData.direccion) newErrors.direccion = 'La dirección es requerida';
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
        <Modal.Title>{cliente ? 'Editar Cliente' : 'Nuevo Cliente'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              isInvalid={!!errors.nombre}
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