// src/components/UsuarioTable.tsx
import React from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { Usuario } from '../types/usuario';

interface UsuarioTableProps {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onToggleActive: (id: number, currentStatus: boolean) => void;
}

const UsuarioTable: React.FC<UsuarioTableProps> = ({ 
  usuarios, 
  onEdit, 
  onToggleActive 
}) => {
  return (
    <Table striped bordered hover>
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
          console.log('Usuario data:', {
            id: usuario.id,
            nombre: usuario.usuario,
            activo: usuario.activo,
            activoType: typeof usuario.activo
          });

          // Convertir explícitamente a booleano
          const isActive = usuario.activo === true;
          
          console.log('Estado procesado:', {
            id: usuario.id,
            isActive,
            isActiveType: typeof isActive
          });

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
                    console.log('Toggle clicked:', {
                      id: usuario.id,
                      currentStatus: isActive
                    });
                    usuario.id && onToggleActive(usuario.id, isActive);
                  }}
                  label={isActive ? 'Activo' : 'Inactivo'}
                />
              </td>
              <td>
                <Button 
                  variant="info" 
                  size="sm" 
                  className="me-2"
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