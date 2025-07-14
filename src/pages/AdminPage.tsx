import { useState } from 'react';
import { Menu, Layout, Button } from 'antd';
import {
  UserOutlined,
  CarOutlined,
  CalendarOutlined,
  DollarOutlined,
  CreditCardOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AdminUsers from '../components/admin/AdminUsers';
import AdminCars from '../components/admin/AdminCars';
import AdminReservations from '../components/admin/AdminReservations';
import AdminSales from '../components/admin/AdminSales';
import AdminPayments from '../components/admin/AdminPayments';
import AdminInvoices from '../components/admin/AdminInvoices';

const { Header, Sider, Content } = Layout;

const AdminPage = () => {
  const [selectedKey, setSelectedKey] = useState('users');
  const navigate = useNavigate();

  const menuItems = [
    { key: 'users', icon: <UserOutlined />, label: 'Usuarios' },
    { key: 'cars', icon: <CarOutlined />, label: 'Autos' },
    { key: 'reservations', icon: <CalendarOutlined />, label: 'Reservas' },
    { key: 'sales', icon: <DollarOutlined />, label: 'Ventas' },
    { key: 'payments', icon: <CreditCardOutlined />, label: 'Pagos' },
    { key: 'invoices', icon: <FileTextOutlined />, label: 'Facturas' },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case 'users': return <AdminUsers />;
      case 'cars': return <AdminCars />;
      case 'reservations': return <AdminReservations />;
      case 'sales': return <AdminSales />;
      case 'payments': return <AdminPayments />;
      case 'invoices': return <AdminInvoices />;
      default: return null;
    }
  };

  const getTitle = () => {
    switch (selectedKey) {
      case 'users': return 'Gestión de Usuarios';
      case 'cars': return 'Gestión de Autos';
      case 'reservations': return 'Gestión de Reservas';
      case 'sales': return 'Gestión de Ventas';
      case 'payments': return 'Gestión de Pagos';
      case 'invoices': return 'Gestión de Facturas';
      default: return '';
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200}>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => setSelectedKey(key)}
          style={{ height: '100%', borderRight: 0 }}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h2 style={{ margin: 0 }}>{getTitle()}</h2>
            <Button type="link" onClick={() => navigate('/')}>
              Volver al inicio
            </Button>
          </div>
        </Header>
        <Content style={{ margin: '24px', background: '#fff', padding: 24 }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPage;
