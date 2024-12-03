// src/components/catalogo/CatalogoList.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import CatalogoCard from './catalogoCard';
import CatalogoForm from './catalogoForm';
import { Catalogo } from '../../types/catalogo';
import CatalogoService from '../../service/catalogoService';

const CatalogoList = () => {
  const [catalogos, setCatalogos] = useState<Catalogo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCatalogo, setSelectedCatalogo] = useState<Catalogo | undefined>();

  const loadCatalogos = async () => {
    try {
      const data = await CatalogoService.getAllCatalogos();
      setCatalogos(data);
    } catch (error) {
      console.error('Error loading catalogos:', error);
      alert('Error al cargar catálogos');
    }
  };

  useEffect(() => {
    loadCatalogos();
  }, []);

  const handleSave = async (catalogo: Catalogo) => {
    try {
      if (selectedCatalogo) {
        await CatalogoService.updateCatalogo(selectedCatalogo.idCatalogo!, catalogo);
      } else {
        await CatalogoService.createCatalogo(catalogo);
      }
      loadCatalogos();
      setShowForm(false);
      setSelectedCatalogo(undefined);
    } catch (error) {
      console.error('Error saving catalogo:', error);
      alert('Error al guardar catálogo');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este catálogo?')) {
      try {
        await CatalogoService.deleteCatalogo(id);
        loadCatalogos();
      } catch (error) {
        console.error('Error deleting catalogo:', error);
        alert('Error al eliminar catálogo');
      }
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Catálogos</h2>
        </Col>
        <Col xs="auto">
          <Button
            variant="primary"
            onClick={() => {
              setSelectedCatalogo(undefined);
              setShowForm(true);
            }}
          >
            Nuevo Catálogo
          </Button>
        </Col>
      </Row>

      <Row xs={1} md={2} lg={3} className="g-4">
        {catalogos.map((catalogo) => (
          <Col key={catalogo.idCatalogo}>
            <CatalogoCard
              catalogo={catalogo}
              onEdit={(catalogo) => {
                setSelectedCatalogo(catalogo);
                setShowForm(true);
              }}
              onDelete={handleDelete}
            />
          </Col>
        ))}
      </Row>

      <CatalogoForm
        show={showForm}
        onHide={() => {
          setShowForm(false);
          setSelectedCatalogo(undefined);
        }}
        onSave={handleSave}
        catalogo={selectedCatalogo}
      />
    </Container>
  );
};

export default CatalogoList;