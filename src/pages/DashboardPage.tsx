
import { Card,  Container, Row, Col} from 'react-bootstrap';
import { Box, Users, ListOrdered } from 'lucide-react';

const DashboardPage = () => {
  const cards = [
    { title: 'Productos', icon: <Box className="w-8 h-8" />, path: '/productos', desc: 'Gestiona tu inventario' },
    { title: 'Clientes', icon: <Users className="w-8 h-8" />, path: '/clientes', desc: 'Administra tus clientes' },
    { title: 'Catálogos', icon: <ListOrdered className="w-8 h-8" />, path: '/catalogos', desc: 'Organiza tus productos' }
  ];

  return (
    <div className="min-h-screen bg-light">
      

      <Container className="py-4">
        <div className="mb-4">
          <h2 className="fw-bold">Panel de Control</h2>
          <p className="text-muted">Bienvenido al sistema de gestión</p>
        </div>

        <Row className="g-4">
          {cards.map((card, index) => (
            <Col key={index} md={4}>
              <Card className="h-100 hover-shadow cursor-pointer">
                <Card.Body className="text-center d-flex flex-column align-items-center">
                  <div className="text-primary mb-3">
                    {card.icon}
                  </div>
                  <Card.Title className="fw-bold">{card.title}</Card.Title>
                  <Card.Text className="text-muted">{card.desc}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default DashboardPage;