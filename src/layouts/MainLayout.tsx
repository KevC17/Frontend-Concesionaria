import { Layout } from 'antd';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const { Header, Content, Footer } = Layout;

const MainLayout = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (token) {
    setIsAuthenticated(true);
    setIsAdmin(role === 'ADMIN');
  } else {
    setIsAuthenticated(false);
    setIsAdmin(false);
  }
}, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', padding: '0 24px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#fff',
          }}
        >
          {/* Navegación izquierda */}
          <div style={{ fontSize: '18px' }}>
            <Link to="/" style={{ color: '#fff', marginRight: 16 }}>Inicio</Link>
            <Link to="/cars" style={{ color: '#fff', marginRight: 16 }}>Autos</Link>
            <Link to="/contact" style={{ color: '#fff' }}>Contacto</Link>
          </div>

          {/* Navegación derecha */}
          <div>
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" style={{ color: '#fff', marginRight: 16 }}>
                    Panel de administración
                  </Link>
                )}
                <span onClick={handleLogout} style={{ color: '#fff', cursor: 'pointer' }}>
                  Cerrar sesión
                </span>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: '#fff', marginRight: 16 }}>Iniciar sesión</Link>
                <Link to="/register" style={{ color: '#fff' }}>Registrarse</Link>
              </>
            )}
          </div>
        </div>
      </Header>

      <Content style={{ padding: '24px', background: '#fff' }}>{children}</Content>

      <Footer style={{ textAlign: 'center' }}>
        © {new Date().getFullYear()} Concesionaria. Todos los derechos reservados.
      </Footer>
    </Layout>
  );
};

export default MainLayout;
