import { Layout } from 'antd';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const { Header, Content, Footer } = Layout;

const MainLayout = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const storedUserName = localStorage.getItem('userName');
    if (token) {
      setIsAuthenticated(true);
      setIsAdmin(role === 'ADMIN');
      setUserName(storedUserName);
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUserName(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserName(null);
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={{ marginRight: 24 }}>
              <img src="/logo.png" alt="Logo" style={{ height: 40 }} />
            </Link>
            <Link to="/cars" style={{ color: '#fff', marginRight: 16 }}>
              Autos
            </Link>
            <Link to="/contact" style={{ color: '#fff' }}>
              Contacto
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <>
                    <Link to="/user-activity" style={{ color: '#fff', marginRight: 16 }}>
                      Mis movimientos
                    </Link>
                    <Link to="/profile" style={{ color: '#fff' }}>
                      Mi perfil
                    </Link>
                  </>
                )}
                {isAdmin && (
                  <Link to="/admin" style={{ color: '#fff' }}>
                    Panel administrador
                  </Link>
                )}
                <span onClick={handleLogout} style={{ color: '#fff', cursor: 'pointer' }}>
                  Cerrar sesión
                </span>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: '#fff' }}>
                  Iniciar sesión
                </Link>
                <Link to="/register" style={{ color: '#fff' }}>
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </Header>

      <Content style={{ padding: '24px', background: '#fff' }}>{children}</Content>

      <Footer style={{ textAlign: 'center' }}>
        © {new Date().getFullYear()} Concesionaria de autos Fast. Todos los derechos reservados.
      </Footer>
    </Layout>
  );
};

export default MainLayout;
