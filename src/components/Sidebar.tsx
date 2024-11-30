// src/components/Sidebar.tsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import '../styles/Sidebar.css';

interface SidebarProps {
  activeSection: string;
  onSelectSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSelectSection }) => {
  return (
    <div className="sidebar">
      <Nav className="flex-column">
        <Nav.Link 
          className={`sidebar-link ${activeSection === 'productos' ? 'active' : ''}`}
          onClick={() => onSelectSection('productos')}
        >
          Productos
        </Nav.Link>
        <Nav.Link 
          className={`sidebar-link ${activeSection === 'clientes' ? 'active' : ''}`}
          onClick={() => onSelectSection('clientes')}
        >
          Clientes
        </Nav.Link>
        <Nav.Link 
          className={`sidebar-link ${activeSection === 'catalogos' ? 'active' : ''}`}
          onClick={() => onSelectSection('catalogos')}
        >
          Catálogos
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;