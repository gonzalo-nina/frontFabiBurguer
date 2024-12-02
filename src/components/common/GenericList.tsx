// src/components/common/GenericList.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import GenericCard from './GenericCard';
import GenericForm from './GenericForm';
import { FormField } from '../../types/common';

interface GenericListProps<T> {
  title: string;
  fetchItems: () => Promise<T[]>;
  createItem: (item: T) => Promise<T>;
  updateItem: (id: number, item: T) => Promise<T>;
  deleteItem: (id: number) => Promise<void>;
  displayFields: { key: keyof T; label: string }[];
  formFields: FormField[];
}

const GenericList = <T extends { id?: number }>({
  title,
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
  displayFields,
  formFields
}: GenericListProps<T>) => {
  const [items, setItems] = useState<T[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | undefined>();

  const loadItems = async () => {
    try {
      const data = await fetchItems();
      setItems(data);
    } catch (error) {
      console.error(`Error loading ${title}:`, error);
      alert(`Error al cargar ${title}`);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleSave = async (item: T) => {
    try {
      if (selectedItem?.id) {
        await updateItem(selectedItem.id, item);
      } else {
        await createItem(item);
      }
      loadItems();
      setShowForm(false);
      setSelectedItem(undefined);
    } catch (error) {
      console.error(`Error saving ${title}:`, error);
      alert(`Error al guardar ${title}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(`¿Está seguro de eliminar este ${title}?`)) {
      try {
        await deleteItem(id);
        loadItems();
      } catch (error) {
        console.error(`Error deleting ${title}:`, error);
        alert(`Error al eliminar ${title}`);
      }
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>{title}</h2>
        </Col>
        <Col xs="auto">
          <Button
            variant="primary"
            onClick={() => {
              setSelectedItem(undefined);
              setShowForm(true);
            }}
          >
            Nuevo {title}
          </Button>
        </Col>
      </Row>

      <Row xs={1} md={2} lg={3} className="g-4">
        {items.map((item, index) => (
          <Col key={item.id || `item-${index}`}>
            <GenericCard
              item={item}
              displayFields={displayFields}
              onEdit={(item) => {
                setSelectedItem(item);
                setShowForm(true);
              }}
              onDelete={handleDelete}
            />
          </Col>
        ))}
      </Row>

      <GenericForm
        show={showForm}
        onHide={() => {
          setShowForm(false);
          setSelectedItem(undefined);
        }}
        onSave={handleSave}
        item={selectedItem}
        fields={formFields}
        title={title}
      />
    </Container>
  );
};

export default GenericList;