// src/components/ClienteSection.tsx
import React from 'react';
import BaseList from './common/BaseList';
import { Cliente } from '../types/cliente';
import ClienteService from '../service/clienteService';

const ClienteSection = () => {
  return (
    <BaseList<Cliente>
      title="Clientes"
      fetchItems={ClienteService.getAllClientes}
      createItem={ClienteService.createCliente}
      updateItem={ClienteService.updateCliente}
      deleteItem={ClienteService.deleteCliente}
      idField="idCliente"
      titleField="nombre"
      fields={[
        {
          name: 'nombre',
          label: 'Nombre',
          type: 'text',
          validation: { required: true }
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          validation: { 
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMessage: 'Email inválido'
          }
        },
        {
          name: 'telefono',
          label: 'Teléfono',
          type: 'text',
          validation: {
            required: true,
            pattern: /^\d{1,9}$/,
            errorMessage: 'El teléfono debe tener máximo 9 dígitos'
          }
        },
        {
          name: 'direccion',
          label: 'Dirección',
          type: 'text',
          validation: { required: true }
        }
      ]}
      displayFields={[
        { key: 'email', label: 'Email' },
        { key: 'telefono', label: 'Teléfono' },
        { key: 'direccion', label: 'Dirección' }
      ]}
    />
  );
};

export default ClienteSection;