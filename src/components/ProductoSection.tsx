// src/components/ProductoSection.tsx
import React from 'react';
import BaseList from './common/BaseList';
import { Producto } from '../types/producto';
import ProductoService from '../service/productoService';

const ProductoSection = () => {
  return (
    <BaseList<Producto>
      title="Productos"
      fetchItems={ProductoService.getAllProductos}
      createItem={ProductoService.createProducto}
      updateItem={ProductoService.updateProducto}
      deleteItem={ProductoService.deleteProducto}
      idField="idProducto"
      titleField="nombre"
      descriptionField="descripcion"
      fields={[
        {
          name: 'nombre',
          label: 'Nombre',
          type: 'text',
          validation: { required: true }
        },
        {
          name: 'descripcion',
          label: 'Descripción',
          type: 'textarea',
          validation: { required: true }
        },
        {
          name: 'precio',
          label: 'Precio',
          type: 'number',
          validation: { required: true, min: 0 }
        },
        {
          name: 'disponibilidad',
          label: 'Disponibilidad',
          type: 'number',
          validation: { required: true, min: 0 }
        },
        {
          name: 'idCatalogo',
          label: 'Catálogo ID',
          type: 'number',
          validation: { required: true, min: 1 }
        }
      ]}
      displayFields={[
        { key: 'precio', label: 'Precio', format: (v) => `S/. ${v}` },
        { key: 'disponibilidad', label: 'Disponibilidad' },
        { key: 'idCatalogo', label: 'Catálogo ID' }
      ]}
    />
  );
};

export default ProductoSection;