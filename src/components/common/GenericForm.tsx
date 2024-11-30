// src/components/common/GenericForm.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { FormField } from '../../types/common';

interface GenericFormProps<T> {
  show: boolean;
  onHide: () => void;
  onSave: (item: T) => void;
  item?: T;
  fields: FormField[];
  title: string;
}

const GenericForm = <T extends object>({
  show,
  onHide,
  onSave,
  item,
  fields,
  title
}: GenericFormProps<T>) => {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (show) {
      setFormData(item || {});
      setErrors({});
    }
  }, [show, item]);

  const validateField = (field: FormField, value: any): string => {
    if (field.validation) {
      if (field.validation.required && !value) {
        return 'Este campo es requerido';
      }
      if (field.validation.pattern && !field.validation.pattern.test(value)) {
        return field.validation.errorMessage || 'Formato inválido';
      }
      if (field.validation.min !== undefined && Number(value) < field.validation.min) {
        return `El valor mínimo es ${field.validation.min}`;
      }
      if (field.validation.max !== undefined && Number(value) > field.validation.max) {
        return `El valor máximo es ${field.validation.max}`;
      }
    }
    return '';
  };

  const handleChange = (field: FormField, value: any) => {
    setFormData({ ...formData, [field.name]: value });
    const error = validateField(field, value);
    setErrors({ ...errors, [field.name]: error });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{item ? `Editar ${title}` : `Nuevo ${title}`}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {fields.map(field => (
            <Form.Group className="mb-3" key={field.name}>
              <Form.Label>{field.label}</Form.Label>
              {field.type === 'textarea' ? (
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field, e.target.value)}
                  isInvalid={!!errors[field.name]}
                  required={field.validation?.required}
                />
              ) : (
                <Form.Control
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field, e.target.value)}
                  isInvalid={!!errors[field.name]}
                  required={field.validation?.required}
                  min={field.validation?.min}
                  max={field.validation?.max}
                />
              )}
              <Form.Control.Feedback type="invalid">
                {errors[field.name]}
              </Form.Control.Feedback>
            </Form.Group>
          ))}
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

export default GenericForm;