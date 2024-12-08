// src/components/Layout.tsx
import { Outlet } from 'react-router-dom';
import { Navbar, Container, Button } from 'react-bootstrap';
import { LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import "../styles/layout.css";

interface LayoutProps {
  username: string;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout = ({ username, onLogout }: LayoutProps) => {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-content">
        <Navbar className="header-container backdrop-blur" expand="lg" fixed="top">
          <Container fluid>
            <div className="welcome-text">
              <h1>
                Bienvenido, <span className="text-primary fw-bold">{username}</span>
              </h1>
              <div className="subtitle">Panel de Control</div>
            </div>
            <Button 
              variant="light" 
              className="d-flex align-items-center gap-2 shadow-sm"
              onClick={onLogout}
            >
              <LogOut size={18} />
              <span>Cerrar Sesión</span>
            </Button>
          </Container>
        </Navbar>
        <div className="content-wrapper fade-in">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;