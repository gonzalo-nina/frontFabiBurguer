// src/components/UsuarioSection.tsx
import  { useState, useEffect } from 'react';
import { Button, Alert, Modal } from 'react-bootstrap';
import UsuarioTable from './UsuarioTable';
import UsuarioForm from './UsuarioForm';
import usuarioService from '../../service/usuarioService';
import { Usuario, UserRoles } from '../../types/usuario';
import auth from '../../service/auth';
import { toast } from 'react-toastify';

const UsuarioSection = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState<number | null>(null);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [userToToggle, setUserToToggle] = useState<{id: number, status: boolean, email: string} | null>(null);

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

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error]);

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
    setUsuarioToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!usuarioToDelete) return;
    try {
      await usuarioService.deleteUsuario(usuarioToDelete);
      loadUsuarios();
      toast.success('Usuario eliminado exitosamente 🗑️');
    } catch (err) {
      toast.error('Error al eliminar usuario ❌');
    } finally {
      setShowDeleteModal(false);
      setUsuarioToDelete(null);
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean, userEmail: string) => {
    if (userEmail === currentUserEmail) {
      toast.error('No puedes deshabilitar tu propia cuenta ⚠️');
      return;
    }
    setUserToToggle({id, status: currentStatus, email: userEmail});
    setShowToggleModal(true);
  };

  const handleConfirmToggle = async () => {
    if (!userToToggle) return;
    try {
      if (userToToggle.status) {
        await usuarioService.deshabilitarUsuario(userToToggle.id);
      } else {
        await usuarioService.habilitarUsuario(userToToggle.id);
      }
      await loadUsuarios();
      toast.success(`Usuario ${userToToggle.status ? 'deshabilitado' : 'habilitado'} exitosamente 🔄`);
    } catch (err) {
      toast.error(`Error al ${userToToggle.status ? 'deshabilitar' : 'habilitar'} usuario ❌`);
    } finally {
      setShowToggleModal(false);
      setUserToToggle(null);
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

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea eliminar este usuario? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showToggleModal} onHide={() => setShowToggleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Cambio de Estado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro de {userToToggle?.status ? 'deshabilitar' : 'habilitar'} este usuario?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowToggleModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmToggle}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UsuarioSection;