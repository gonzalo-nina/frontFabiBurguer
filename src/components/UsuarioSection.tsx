// src/components/UsuarioSection.tsx
import React, { useState, useEffect } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import UsuarioTable from './UsuarioTable';
import UsuarioForm from './usuarioForm';
import usuarioService from '../service/usuarioService';
import { Usuario, UserRoles } from '../types/usuario';
import auth from '../service/auth';

const UsuarioSection = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkUserAccess = () => {
      try {
        const user = auth.getCurrentUser();
        setCurrentUserEmail(user?.email || null);
        const adminStatus = auth.isAdmin();
        setIsAdmin(adminStatus);
        setUserRole(user?.rol || null);
      } catch (error) {
        console.error('Error checking user status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserAccess();
  }, []);

  useEffect(() => {
    if (isAdmin && !loading) {
      loadUsuarios();
    }
  }, [isAdmin, loading]);

  const loadUsuarios = async () => {
    try {
      const data = await usuarioService.getUsuarios();
      setUsuarios(data);
    } catch (err) {
      setError('Error al cargar usuarios');
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (userRole === UserRoles.USER) {
    return (
      <div className="container mt-4">
        <Alert variant="warning">
          No tienes permisos para acceder a esta sección. Esta vista está reservada para administradores.
        </Alert>
      </div>
    );
  }

  const handleSubmit = async (usuario: Usuario) => {
    try {
      if (selectedUsuario?.id) {
        await usuarioService.updateUsuario(selectedUsuario.id, usuario);
      } else {
        await usuarioService.createUsuario(usuario);
      }
      loadUsuarios();
      setShowModal(false);
    } catch (err) {
      setError('Error al guardar usuario');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      try {
        await usuarioService.deleteUsuario(id);
        loadUsuarios();
      } catch (err) {
        setError('Error al eliminar usuario');
      }
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean, userEmail: string) => {
    if (userEmail === currentUserEmail) {
      setError('No puedes deshabilitar tu propia cuenta');
      return;
    }

    if (window.confirm(`¿Está seguro de ${currentStatus ? 'deshabilitar' : 'habilitar'} este usuario?`)) {
      try {
        if (currentStatus) {
          await usuarioService.deshabilitarUsuario(id);
        } else {
          await usuarioService.habilitarUsuario(id);
        }
        await loadUsuarios();
      } catch (err) {
        setError(`Error al ${currentStatus ? 'deshabilitar' : 'habilitar'} usuario`);
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Usuarios</h2>
        <Button 
          variant="primary" 
          onClick={() => {
            setSelectedUsuario(null);
            setShowModal(true);
          }}
        >
          Nuevo Usuario
        </Button>
      </div>

      {error && 
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      }

      <UsuarioTable 
        usuarios={usuarios} 
        onEdit={(usuario) => {
          setSelectedUsuario(usuario);
          setShowModal(true);
        }}
        onToggleActive={handleToggleActive}
        currentUserEmail={currentUserEmail}
      />

      <UsuarioForm
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleSubmit}
        usuarioEdit={selectedUsuario}
        currentUserEmail={currentUserEmail}
      />
    </div>
  );
};

export default UsuarioSection;