// src/components/catalogo/CatalogoList.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert, Form, InputGroup, Modal } from 'react-bootstrap';
import CatalogoCard from './CatalogoCard';
import CatalogoForm from './CatalogoForm';
import { Catalogo } from '../../types/catalogo';
import CatalogoService from '../../service/catalogoService';
import ProductoService from '../../service/productoService';
import AuthService from '../../service/auth';
import { Search } from 'lucide-react'; // Para el ícono de búsqueda
import { toast } from 'react-toastify';
import '../../styles/barraBusqueda.css'

const CatalogoList = () => {
  const [catalogos, setCatalogos] = useState<Catalogo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCatalogo, setSelectedCatalogo] = useState<Catalogo | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isAdmin = AuthService.isAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [catalogoToDelete, setCatalogoToDelete] = useState<number | null>(null);

  const loadCatalogos = async () => {
    try {
      setLoading(true);
      const data = await CatalogoService.getAllCatalogos();
      setCatalogos(data);
    } catch (error) {
      setError('Error al cargar catálogos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalogos();
  }, []);

  const handleSave = async (catalogo: Catalogo) => {
    try {
      setLoading(true);
      setError(null);

      // Validación adicional para edición
      if (selectedCatalogo) {
        // Verificar si el nombre ya existe en otro catálogo
        const catalogoExistente = catalogos.find(
          c => c.nombreCatalogo === catalogo.nombreCatalogo && 
              c.idCatalogo !== selectedCatalogo.idCatalogo
        );

        if (catalogoExistente) {
          setError('Ya existe un catálogo con este nombre');
          return;
        }

        await CatalogoService.updateCatalogo(selectedCatalogo.idCatalogo!, catalogo);
      } else {
        // Verificar si el nombre ya existe para nuevo catálogo
        const catalogoExistente = catalogos.find(
          c => c.nombreCatalogo === catalogo.nombreCatalogo
        );

        if (catalogoExistente) {
          setError('Ya existe un catálogo con este nombre');
          return;
        }

        await CatalogoService.createCatalogo(catalogo);
      }

      await loadCatalogos();
      setShowForm(false);
      setSelectedCatalogo(undefined);
    } catch (error) {
      setError('Error al guardar catálogo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setCatalogoToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!catalogoToDelete) return;

    try {
      setLoading(true);
      setError(null);

      const productos = await ProductoService.getAllProductos();
      const productosRelacionados = productos.filter(p => p.idCatalogo === catalogoToDelete);

      if (productosRelacionados.length > 0) {
        toast.error(`No se puede eliminar el catálogo porque está siendo usado por ${productosRelacionados.length} producto(s) 🚫`);
        return;
      }

      await CatalogoService.deleteCatalogo(catalogoToDelete);
      await loadCatalogos();
      
      toast.success('¡Catálogo eliminado exitosamente! 🗑️', {
        position: "top-right",
        autoClose: 3000
      });

    } catch (error) {
      toast.error('Error al eliminar catálogo ❌');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setCatalogoToDelete(null);
    }
  };

  const handleEdit = (catalogo: Catalogo) => {
    setSelectedCatalogo(catalogo);
    setShowForm(true);
    setError(null);
  };

  // Filtrar catálogos basado en el término de búsqueda
  const filteredCatalogos = catalogos.filter(catalogo =>
    catalogo.nombreCatalogo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error]);

  return (
    <Container className="py-4">

      <Row className="mb-4">
        <Col>
          <h2>Catálogos</h2>
        </Col>
        <Col xs="auto">
          {isAdmin && (
            <Button
              variant="primary"
              onClick={() => {
                setSelectedCatalogo(undefined);
                setShowForm(true);
                setError(null);
              }}
              disabled={loading}
            >
              Nuevo Catálogo
            </Button>
          )}
        </Col>
      </Row>

      {/* Agregar barra de búsqueda */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <Search size={20} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar catálogo por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">Cargando...</div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredCatalogos.map((catalogo) => (
            <Col key={catalogo.idCatalogo}>
              <CatalogoCard
                catalogo={catalogo}
                onEdit={isAdmin ? handleEdit : () => {}}
                onDelete={isAdmin ? handleDelete : () => {}}
                isAdmin={isAdmin}
              />
            </Col>
          ))}
          {filteredCatalogos.length === 0 && !loading && (
            <Col xs={12} className="text-center mt-4">
              <p className="text-muted">
                No se encontraron catálogos que coincidan con la búsqueda
              </p>
            </Col>
          )}
        </Row>
      )}

      {isAdmin && (
        <CatalogoForm
          show={showForm}
          onHide={() => {
            setShowForm(false);
            setSelectedCatalogo(undefined);
            setError(null);
          }}
          onSave={handleSave}
          catalogo={selectedCatalogo}
        />
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea eliminar este catálogo? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CatalogoList;