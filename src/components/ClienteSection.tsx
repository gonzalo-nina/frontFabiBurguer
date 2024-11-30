// src/components/ClienteSection.tsx
import React from 'react';
import GenericList from './common/GenericList';
import ClienteService from '../service/clienteService';
import { Cliente } from '../types/cliente';

const clienteFields = [
    { key: 'nombre' as keyof Cliente, label: 'Nombre' },
    { key: 'email' as keyof Cliente, label: 'Email' },
    { key: 'telefono' as keyof Cliente, label: 'Teléfono' },
    { key: 'direccion' as keyof Cliente, label: 'Dirección' },
    { key: 'fechaRegistro' as keyof Cliente, label: 'Fecha de Registro' }
];

const clienteFormFields = [
    {
        name: 'nombre',
        label: 'Nombre',
        type: 'text' as const,
        validation: { required: true }
    },
    {
        name: 'email',
        label: 'Email',
        type: 'email' as const,
        validation: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMessage: 'Email inválido'
        }
    },
    {
        name: 'telefono',
        label: 'Teléfono',
        type: 'text' as const,
        validation: {
            required: true,
            pattern: /^\d{1,9}$/,
            errorMessage: 'El teléfono debe tener máximo 9 dígitos'
        }
    },
    {
        name: 'direccion',
        label: 'Dirección',
        type: 'text' as const,
        validation: { required: true }
    }
];

const ClienteSection = () => (
    <GenericList<Cliente>
        title="Clientes"
        fetchItems={ClienteService.getAllClientes}
        createItem={ClienteService.createCliente}
        updateItem={ClienteService.updateCliente}
        deleteItem={ClienteService.deleteCliente}
        displayFields={clienteFields}
        formFields={clienteFormFields}
    />
);

export default ClienteSection;