import { Box, Users, ListOrdered } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

const DashboardPage = () => {
  const cards = [
    { title: 'Productos', icon: <Box className="card-icon" />, path: '/productos', desc: 'Gestiona tu inventario' },
    { title: 'Clientes', icon: <Users className="card-icon" />, path: '/clientes', desc: 'Administra tus clientes' },
    { title: 'Catálogos', icon: <ListOrdered className="card-icon" />, path: '/catalogos', desc: 'Organiza tus productos' }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Panel de Control</h2>
        <p>Bienvenido al sistema de gestión</p>
      </div>

      <div className="dashboard-grid">
        {cards.map((card, index) => (
          <Link to={card.path} key={index} className="dashboard-card-link">
            <div className="dashboard-card">
              <div className="card-content">
                <div className="icon-wrapper">
                  {card.icon}
                </div>
                <h3 className="card-title">{card.title}</h3>
                <p className="card-description">{card.desc}</p>
              </div>
              <div className="card-arrow">→</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;