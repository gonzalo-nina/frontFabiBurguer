// src/components/ClienteSection.tsx

import GenericList from './common/GenericList';
import ClienteService from '../service/clienteService';
import { Cliente } from '../types/cliente';

const clienteFields = [
    { key: 'idCliente' as keyof Cliente, label: 'ID' },
    { key: 'nombre' as keyof Cliente, label: 'Nombre' },
    { key: 'email' as keyof Cliente, label: 'Email' },
    { key: 'telefono' as keyof Cliente, label: 'Teléfono' },
    { key: 'direccion' as keyof Cliente, label: 'Dirección' }
];

const clienteFormFields = [
    {
        name: 'idCliente',
        label: 'ID',
        type: 'number' as const,
        readOnly: true,
        hidden: true // Hide from form since it's auto-generated
    },
    {
        name: 'nombre',
        label: 'Nombre',
        type: 'text' as const,
        validation: { 
            required: true,
            minLength: 3,
            maxLength: 100
        }
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
        validation: { 
            required: true,
            minLength: 5,
            maxLength: 200
        }
    }
];

const ClienteSection = () => {
    return (
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
};

export default ClienteSection;