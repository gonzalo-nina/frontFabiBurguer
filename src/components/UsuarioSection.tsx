// src/components/UsuarioSection.tsx
import React, { useState, useEffect } from 'react';
import { Button, Alert } from 'react-bootstrap';
import UsuarioTable from './UsuarioTable';
import UsuarioForm from './usuarioForm';
import usuarioService from '../service/usuarioService';
import { Usuario } from '../types/usuario';
import auth from '../service/auth';
import { Navigate } from 'react-router-dom';

const UsuarioSection = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = () => {
      try {
        const user = auth.getCurrentUser();
        console.log('Current user:', user);
        const adminStatus = auth.isAdmin();
        console.log('Is admin:', adminStatus);
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
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

  if (!isAdmin) {
    console.log('Usuario no es admin, redirigiendo...');
    return <Navigate to="/dashboard" />;
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

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
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
      />

      <UsuarioForm
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleSubmit}
        usuarioEdit={selectedUsuario}
      />
    </div>
  );
};

export default UsuarioSection;