// src/components/ProductoSection.tsx
import React from 'react';
import GenericList from './common/GenericList';
import ProductoService from '../service/productoService';
import { Producto } from '../types/producto';

const productoFields = [
  { key: 'nombre' as keyof Producto, label: 'Nombre' },
  { key: 'descripcion' as keyof Producto, label: 'Descripción' },
  { key: 'precio' as keyof Producto, label: 'Precio' },
  { key: 'disponibilidad' as keyof Producto, label: 'Disponibilidad' },
  { key: 'idCatalogo' as keyof Producto, label: 'Catálogo ID' }
];

const productoFormFields = [
  {
    name: 'nombre',
    label: 'Nombre',
    type: 'text' as const,
    validation: { required: true }
  },
  {
    name: 'descripcion',
    label: 'Descripción',
    type: 'textarea' as const,
    validation: { required: true }
  },
  {
    name: 'precio',
    label: 'Precio',
    type: 'number' as const,
    validation: { required: true, min: 0 }
  },
  {
    name: 'disponibilidad',
    label: 'Disponibilidad',
    type: 'number' as const,
    validation: { required: true, min: 0 }
  },
  {
    name: 'idCatalogo',
    label: 'Catálogo ID',
    type: 'number' as const,
    validation: { required: true, min: 1 }
  }
];

const ProductoSection = () => (
  <GenericList<Producto>
    title="Productos"
    fetchItems={ProductoService.getAllProductos}
    createItem={ProductoService.createProducto}
    updateItem={ProductoService.updateProducto}
    deleteItem={ProductoService.deleteProducto}
    displayFields={productoFields}
    formFields={productoFormFields}
  />
);

export default ProductoSection;