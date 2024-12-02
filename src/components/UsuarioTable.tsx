// src/components/UsuarioTable.tsx
import React from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { Usuario } from '../types/usuario';

interface UsuarioTableProps {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onToggleActive: (id: number, currentStatus: boolean, email: string) => void;
  currentUserEmail: string | null;
}

const UsuarioTable: React.FC<UsuarioTableProps> = ({ 
  usuarios, 
  onEdit, 
  onToggleActive,
  currentUserEmail 
}) => {
  return (
    <Table className="modern-table" hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Usuario</th>
          <th>Email</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((usuario) => {
          const isActive = usuario.activo === true;
          const isCurrentUser = usuario.email === currentUserEmail;
          
          return (
            <tr key={usuario.id} className={!isActive ? 'table-secondary' : ''}>
              <td>{usuario.id}</td>
              <td>{usuario.usuario}</td>
              <td>{usuario.email}</td>
              <td>
                <Form.Check
                  type="switch"
                  id={`usuario-activo-${usuario.id}`}
                  checked={isActive}
                  onChange={() => {
                    usuario.id && onToggleActive(usuario.id, isActive, usuario.email);
                  }}
                  label={isActive ? 'Activo' : 'Inactivo'}
                  disabled={isCurrentUser}
                />
              </td>
              <td>
                <Button 
                  variant="primary"
                  size="sm"
                  className="action-btn action-btn-edit"
                  onClick={() => onEdit(usuario)}
                  disabled={!isActive}
                >
                  Editar
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default UsuarioTable;