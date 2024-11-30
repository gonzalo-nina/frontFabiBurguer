// src/components/ClientForm.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Cliente } from '../types/cliente';

interface ClientFormProps {
    show: boolean;
    onHide: () => void;
    onSave: (cliente: Cliente) => void;
    cliente?: Cliente;
}

const ClientForm: React.FC<ClientFormProps> = ({ show, onHide, onSave, cliente }) => {
    const initialFormData = {
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        fechaRegistro: new Date()
    };

    const [formData, setFormData] = useState<Cliente>(initialFormData);
    const [errors, setErrors] = useState({
        telefono: ''
    });

    useEffect(() => {
        if (show) {
            // Reset form when opening
            setFormData(cliente || initialFormData);
            setErrors({ telefono: '' });
        }
    }, [show, cliente]);

    const validatePhone = (phone: string): boolean => {
        const phoneRegex = /^\d{1,9}$/;
        return phoneRegex.test(phone);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        if (value.length <= 9) {
            setFormData({ ...formData, telefono: value });
            setErrors({
                ...errors,
                telefono: validatePhone(value) ? '' : 'El teléfono debe tener máximo 9 dígitos'
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validatePhone(formData.telefono)) {
            setErrors({
                ...errors,
                telefono: 'El teléfono debe tener máximo 9 dígitos'
            });
            return;
        }

        onSave(formData);
        onHide();
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
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.telefono}
                            onChange={handlePhoneChange}
                            isInvalid={!!errors.telefono}
                            required
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
                            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
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

export default ClientForm;