// src/components/UsuarioForm.tsx
import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Alert } from 'react-bootstrap';
import { Usuario } from '../types/usuario';
import authService from '../service/auth'; // Add this import

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
    activo: true,
    rol: 'ROLE_USER' // Default role
  });

  // Add new state for current password
  const [currentPassword, setCurrentPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  // Add error state
  const [apiError, setApiError] = useState<string | null>(null);

  // Reset states when form closes
  useEffect(() => {
    if (!show) {
      setCurrentPassword('');
      setPasswordError('');
    }
  }, [show]);

  const roleOptions = [
    { value: 'ROLE_USER', label: 'Usuario' },
    { value: 'ROLE_ADMIN', label: 'Administrador' }
  ];

  useEffect(() => {
    if (usuarioEdit) {
      setUsuario({
        ...usuarioEdit,
        clave: '' // Forzar el campo de contraseña a estar vacío al editar
      });
    } else {
      // Reset form for new user
      setUsuario({
        usuario: '',
        email: '',
        clave: '',
        activo: true,
        rol: 'ROLE_USER'
      });
    }
  }, [usuarioEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    
    // Validate current password using login if editing current user and changing password
    if (usuarioEdit && usuarioEdit.email === currentUserEmail && usuario.clave) {
      try {
        const loginResult = await authService.login(usuarioEdit.email, currentPassword);
        if (!loginResult) {
          setPasswordError('La contraseña actual no es correcta');
          return;
        }
      } catch (error: any) {
        setPasswordError('La contraseña actual no es correcta');
        return;
      }
    }

    // Prepare user data for submission - send raw password
    const usuarioToSubmit = {
      ...usuario,
      ...(usuario.clave && { clave: usuario.clave }) // Send raw password if changed
    };

    try {
      await onSubmit(usuarioToSubmit);
      onHide();
    } catch (error: any) {
      setApiError(error.response?.data?.message || 'Error al guardar el usuario');
    }
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
          {apiError && (
            <Alert variant="danger" className="mb-3">
              {apiError}
            </Alert>
          )}
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
              readOnly={!!usuarioEdit}
              disabled={!!usuarioEdit}
            />
          </Form.Group>
          {/* Add current password field when editing current user */}
          {usuarioEdit && usuarioEdit.email === currentUserEmail && (
            <Form.Group className="mb-3">
              <Form.Label>Contraseña Actual</Form.Label>
              <Form.Control
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                isInvalid={!!passwordError}
              />
              <Form.Control.Feedback type="invalid">
                {passwordError}
              </Form.Control.Feedback>
            </Form.Group>
          )}
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
          {/* Solo mostrar selector de rol para nuevos usuarios */}
          {!usuarioEdit && (
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                value={usuario.rol}
                onChange={(e) => setUsuario({...usuario, rol: e.target.value})}
                required
              >
                {roleOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
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