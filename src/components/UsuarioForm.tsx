// src/components/UsuarioForm.tsx
import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { Usuario } from '../types/usuario';

interface UsuarioFormProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (usuario: Usuario) => void;
  usuarioEdit?: Usuario | null;
  currentUserEmail: string | null;  // Añadir esta prop
}

const UsuarioForm: React.FC<UsuarioFormProps> = ({ 
  show, 
  onHide, 
  onSubmit, 
  usuarioEdit,
  currentUserEmail 
}) => {
  const [usuario, setUsuario] = useState<Usuario>({
    usuario: '',
    email: '',
    clave: '',
    activo: true
  });

  useEffect(() => {
    if (usuarioEdit) {
      setUsuario(usuarioEdit);
    }
  }, [usuarioEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(usuario);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {usuarioEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Usuario</Form.Label>
            <Form.Control
              type="text"
              value={usuario.usuario}
              onChange={(e) => setUsuario({...usuario, usuario: e.target.value})}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={usuario.email}
              onChange={(e) => setUsuario({...usuario, email: e.target.value})}
              required
            />
          </Form.Group>
          {(!usuarioEdit || (usuarioEdit && usuarioEdit.email === currentUserEmail)) && (
            <Form.Group className="mb-3">
              <Form.Label>{usuarioEdit ? 'Nueva Contraseña' : 'Contraseña'}</Form.Label>
              <Form.Control
                type="password"
                value={usuario.clave}
                onChange={(e) => setUsuario({...usuario, clave: e.target.value})}
                required={!usuarioEdit}
                placeholder={usuarioEdit ? 'Dejar vacío para mantener la actual' : ''}
              />
            </Form.Group>
          )}
          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UsuarioForm;