// src/components/common/BaseForm.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

interface BaseFormProps<T> {
  show: boolean;
  onHide: () => void;
  onSave: (item: T) => void;
  item?: T;
  fields: Array<{
    name: keyof T;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'email';
    validation?: {
      required?: boolean;
      pattern?: RegExp;
      min?: number;
      max?: number;
      errorMessage?: string;
    };
  }>;
  title: string;
}

const BaseForm = <T extends object>({
  show,
  onHide,
  onSave,
  item,
  fields,
  title
}: BaseFormProps<T>) => {
  const [formData, setFormData] = useState<Partial<T>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (show) {
      setFormData(item || {});
      setErrors({});
    }
  }, [show, item]);

  const validateField = (field: BaseFormProps<T>['fields'][0], value: any): string => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[String(field.name)] = error;
      }
    });

    if (Object.keys(newErrors).length === 0) {
      onSave(formData as T);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{item ? `Editar ${title}` : `Nuevo ${title}`}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {fields.map(field => (
            <Form.Group className="mb-3" key={String(field.name)}>
              <Form.Label>{field.label}</Form.Label>
              <Form.Control
                type={field.type}
                as={field.type === 'textarea' ? 'textarea' : undefined}
                rows={field.type === 'textarea' ? 3 : undefined}
                value={formData[field.name] as string | number | string[] | undefined || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  [field.name]: field.type === 'number' ? Number(e.target.value) : e.target.value
                })}
                isInvalid={!!errors[String(field.name)]}
              />
              <Form.Control.Feedback type="invalid">
                {errors[String(field.name)]}
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

export default BaseForm;