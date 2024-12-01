// src/components/Layout.tsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

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
        <div className="header-container d-flex justify-content-between align-items-center">
          <h1>Bienvenido, {username}</h1>
          <button onClick={onLogout} className="btn btn-primary">
            Logout
          </button>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;