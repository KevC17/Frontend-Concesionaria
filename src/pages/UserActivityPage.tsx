import { useEffect, useState } from 'react';
import { Tabs, Table, Card, Spin, Alert } from 'antd';
import { getReservations } from '../api/reservations';
import { getInvoices } from '../api/invoices';

const { TabPane } = Tabs;

const UserActivity = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  const [errorReservations, setErrorReservations] = useState(false);
  const [errorInvoices, setErrorInvoices] = useState(false);

  const userName = localStorage.getItem('userName');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    setLoadingReservations(true);
    getReservations()
      .then(data => {
        const filtered = data.filter((r: any) => r.customerName === userName);
        setReservations(filtered);
      })
      .catch(() => setErrorReservations(true))
      .finally(() => setLoadingReservations(false));

    setLoadingInvoices(true);
    getInvoices()
      .then(data => {
        const filtered = data.filter((inv: any) => inv.userId === userId);
        setInvoices(filtered);
      })
      .catch(() => setErrorInvoices(true))
      .finally(() => setLoadingInvoices(false));
  }, [userName, userId]);

  const reservationColumns = [
    { title: 'Car ID', dataIndex: 'carId', key: 'carId' },
    { title: 'Start Date', dataIndex: 'startDate', key: 'startDate', render: (text: string) => new Date(text).toLocaleDateString() },
    { title: 'End Date', dataIndex: 'endDate', key: 'endDate', render: (text: string) => new Date(text).toLocaleDateString() },
    { title: 'Active', dataIndex: 'isActive', key: 'isActive', render: (active: boolean) => (active ? 'Sí' : 'No') },
  ];

  const invoiceColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Monto', dataIndex: 'amount', key: 'amount' },
    { title: 'Estado', dataIndex: 'status', key: 'status' },
    { title: 'Fecha de emisión', dataIndex: 'issuedAt', key: 'issuedAt', render: (text: string) => new Date(text).toLocaleDateString() },
  ];

  return (
    <Card title="Mis movimientos" style={{ maxWidth: 900, margin: 'auto' }}>
      <p>Aquí puedes ver todas tus reservas y facturas.</p>
      <Tabs defaultActiveKey="reservations">
        <TabPane tab="Reservas" key="reservations">
          {loadingReservations ? (
            <Spin />
          ) : errorReservations ? (
            <Alert type="error" message="Error al cargar las reservas" />
          ) : (
            <Table
              dataSource={reservations}
              columns={reservationColumns}
              rowKey="id"
              pagination={false}
              locale={{ emptyText: 'No hay reservas' }}
            />
          )}
        </TabPane>
        <TabPane tab="Facturas" key="invoices">
          {loadingInvoices ? (
            <Spin />
          ) : errorInvoices ? (
            <Alert type="error" message="Error al cargar las facturas" />
          ) : (
            <Table
              dataSource={invoices}
              columns={invoiceColumns}
              rowKey="id"
              pagination={false}
              locale={{ emptyText: 'No hay facturas' }}
            />
          )}
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default UserActivity;
