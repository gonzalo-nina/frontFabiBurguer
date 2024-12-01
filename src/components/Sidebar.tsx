// src/components/Sidebar.tsx

import { NavLink } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { FaHome, FaBox, FaUsers, FaList } from 'react-icons/fa';
import '../styles/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>FabiApp</h3>
      </div>
      <Nav className="flex-column">
        <NavLink to="/dashboard" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FaHome className="sidebar-icon" /> Dashboard
        </NavLink>
        <NavLink to="/productos" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FaBox className="sidebar-icon" /> Productos
        </NavLink>
        <NavLink to="/clientes" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FaUsers className="sidebar-icon" /> Clientes
        </NavLink>
        <NavLink to="/catalogos" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FaList className="sidebar-icon" /> Catálogos
        </NavLink>
        <NavLink to="/pedidos" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FaList className="sidebar-icon" /> Pedidos
        </NavLink>
        <NavLink to="/usuario" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FaList className="sidebar-icon" /> Usuarios
        </NavLink>
      </Nav>
    </div>
  );
};

export default Sidebar;