// src/components/CatalogoSection.tsx
import React from 'react';
import BaseList from './common/BaseList';
import { Catalogo } from '../types/catalogo';
import CatalogoService from '../service/catalogoService';

const CatalogoSection = () => {
  return (
    <BaseList<Catalogo>
      title="Catálogos"
      fetchItems={CatalogoService.getAllCatalogos}
      createItem={CatalogoService.createCatalogo}
      updateItem={CatalogoService.updateCatalogo}
      deleteItem={CatalogoService.deleteCatalogo}
      idField="idCatalogo"
      titleField="nombreCatalogo"
      descriptionField="descripcionCatalogo"
      fields={[
        {
          name: 'nombreCatalogo',
          label: 'Nombre',
          type: 'text',
          validation: { required: true }
        },
        {
          name: 'descripcionCatalogo',
          label: 'Descripción',
          type: 'textarea',
          validation: { required: true }
        }
      ]}
    />
  );
};

export default CatalogoSection;