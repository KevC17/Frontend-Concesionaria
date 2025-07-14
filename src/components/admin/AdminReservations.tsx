import { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message, Modal, Form, Input, DatePicker, Switch } from 'antd';
import moment from 'moment';
import {
  getReservations,
  createReservation,
  updateReservation,
  deleteReservation,
} from '../../api/reservations';

const { RangePicker } = DatePicker;

const AdminReservations = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReservation, setCurrentReservation] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const data = await getReservations();
      setReservations(data);
    } catch {
      message.error('Error al cargar reservas');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReservation(id);
      message.success('Reserva eliminada');
      fetchReservations();
    } catch {
      message.error('Error al eliminar reserva');
    }
  };

  const handleEdit = (reservation: any) => {
    setCurrentReservation(reservation);
    form.setFieldsValue({
      customerName: reservation.customerName,
      carId: reservation.carId,
      dateRange: [moment(reservation.startDate), moment(reservation.endDate)],
      isActive: reservation.isActive,
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentReservation(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleFinish = async (values: any) => {
    try {
      const payload = {
        customerName: values.customerName,
        carId: values.carId,
        startDate: values.dateRange[0].toISOString(),
        endDate: values.dateRange[1].toISOString(),
        isActive: values.isActive ?? true,
      };

      if (currentReservation) {
        await updateReservation(currentReservation.id, payload);
        message.success('Reserva actualizada');
      } else {
        await createReservation(payload);
        message.success('Reserva creada');
      }
      fetchReservations();
      setIsModalOpen(false);
    } catch {
      message.error('Error al guardar reserva');
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const columns = [
    { title: 'Cliente', dataIndex: 'customerName', key: 'customerName' },
    { title: 'ID Auto', dataIndex: 'carId', key: 'carId' },
    {
      title: 'Fecha inicio',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Fecha fin',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Activo',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (val: boolean) => (val ? 'Sí' : 'No'),
    },
    {
      title: 'Acciones',
      render: (_: any, record: any) => (
        <>
          <Button onClick={() => handleEdit(record)} type="link">
            Editar
          </Button>
          <Popconfirm
            title="¿Seguro que deseas eliminar esta reserva?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>
              Eliminar
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Registrar reserva
      </Button>

      <Table dataSource={reservations} rowKey="id" loading={loading} columns={columns} />

      <Modal
        title={currentReservation ? 'Editar reserva' : 'Registrar reserva'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="customerName" label="Cliente" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="carId" label="ID Auto" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="dateRange"
            label="Fecha de reserva"
            rules={[{ type: 'array' as const, required: true, message: 'Selecciona fechas' }]}
          >
            <RangePicker showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>
          <Form.Item name="isActive" label="Activo" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminReservations;
