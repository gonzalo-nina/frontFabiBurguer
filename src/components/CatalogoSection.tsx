// src/components/CatalogoSection.tsx
import React from 'react';
import GenericList from './common/GenericList';
import CatalogoService from '../service/catalogoService';
import { Catalogo } from '../types/catalogo';

const catalogoFields = [
    { key: 'nombreCatalogo' as keyof Catalogo, label: 'Nombre' },
    { key: 'descripcionCatalogo' as keyof Catalogo, label: 'Descripción' }
];

const catalogoFormFields = [
    {
        name: 'nombreCatalogo',
        label: 'Nombre',
        type: 'text' as const,
        validation: { required: true }
    },
    {
        name: 'descripcionCatalogo',
        label: 'Descripción',
        type: 'textarea' as const,
        validation: { required: true }
    }
];

const CatalogoSection = () => (
    <GenericList<Catalogo>
        title="Catálogos"
        fetchItems={CatalogoService.getAllCatalogos}
        createItem={CatalogoService.createCatalogo}
        updateItem={CatalogoService.updateCatalogo}
        deleteItem={CatalogoService.deleteCatalogo}
        displayFields={catalogoFields}
        formFields={catalogoFormFields}
    />
);

export default CatalogoSection;