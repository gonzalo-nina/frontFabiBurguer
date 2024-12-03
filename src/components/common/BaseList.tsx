// src/components/common/BaseList.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import BaseCard from './BaseCard';
import BaseForm from './BaseForm';

interface BaseListProps<T> {
  title: string;
  fetchItems: () => Promise<T[]>;
  createItem: (item: T) => Promise<T>;
  updateItem: (id: number, item: T) => Promise<T>;
  deleteItem: (id: number) => Promise<void>;
  idField: keyof T;
  titleField: keyof T;
  descriptionField?: keyof T;
  fields: Array<{
    name: keyof T;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'email';
    validation?: {
      required?: boolean;
      pattern?: RegExp;
      min?: number;
      max?: number;
      errorMessage?: string;
    };
  }>;
  displayFields?: Array<{
    key: keyof T;
    label: string;
    format?: (value: any) => string;
  }>;
}

const BaseList = <T extends object>({
  title,
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
  idField,
  titleField,
  descriptionField,
  fields,
  displayFields = []
}: BaseListProps<T>) => {
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
      if (selectedItem) {
        await updateItem(selectedItem[idField] as number, item);
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
        {items.map((item) => (
          <Col key={String(item[idField])}>
            <BaseCard
              item={item}
              titleField={titleField}
              descriptionField={descriptionField}
              fields={displayFields}
              onEdit={(item) => {
                setSelectedItem(item);
                setShowForm(true);
              }}
              onDelete={handleDelete}
              idField={idField}
            />
          </Col>
        ))}
      </Row>

      <BaseForm
        show={showForm}
        onHide={() => {
          setShowForm(false);
          setSelectedItem(undefined);
        }}
        onSave={handleSave}
        item={selectedItem}
        fields={fields}
        title={title}
      />
    </Container>
  );
};

export default BaseList;