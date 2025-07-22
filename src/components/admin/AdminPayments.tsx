import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
} from 'antd';
import { getPayments, createPayment, updatePaymentStatus, deletePayment } from '../../api/payments';

const { Option } = Select;

const statusOptions = [
  { label: 'Pendiente', value: 'pending' },
  { label: 'Completado', value: 'completed' },
  { label: 'Fallido', value: 'failed' },
];

const AdminPayments = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await getPayments();
      setPayments(data);
    } catch {
      message.error('Error al cargar pagos');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePayment(id);
      message.success('Pago eliminado');
      fetchPayments();
    } catch {
      message.error('Error al eliminar pago');
    }
  };

  const handleEdit = (payment: any) => {
    setCurrentPayment(payment);
    form.setFieldsValue(payment);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentPayment(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleFinish = async (values: any) => {
    try {
      if (currentPayment) {
        await updatePaymentStatus(currentPayment.id, { status: values.status });
        message.success('Pago actualizado');
      } else {
        await createPayment(values);
        message.success('Pago creado');
      }
      fetchPayments();
      setIsModalOpen(false);
    } catch {
      message.error('Error al guardar pago');
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Registrar pago
      </Button>
      <Table
        dataSource={payments}
        rowKey="id"
        loading={loading}
        columns={[
          { title: 'Reserva ID', dataIndex: 'reservationId' },
          { title: 'Monto', dataIndex: 'amount' },
          { title: 'Método', dataIndex: 'method', render: (val) => val || '-' },
          {
            title: 'Estado',
            dataIndex: 'status',
            render: (val) => {
              const option = statusOptions.find(o => o.value === val);
              return option ? option.label : val;
            },
          },
          { title: 'Fecha creación', dataIndex: 'createdAt' },
          {
            title: 'Acciones',
            render: (_, record) => (
              <>
                <Button onClick={() => handleEdit(record)} type="link">
                  Editar
                </Button>
                <Popconfirm
                  title="¿Seguro que deseas eliminar este pago?"
                  onConfirm={() => handleDelete(record.id)}
                >
                  <Button type="link" danger>
                    Eliminar
                  </Button>
                </Popconfirm>
              </>
            ),
          },
        ]}
      />

      <Modal
        title={currentPayment ? 'Editar pago' : 'Registrar pago'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          {!currentPayment && (
            <>
              <Form.Item
                name="reservationId"
                label="ID de la Reserva"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="amount"
                label="Monto"
                rules={[{ required: true, type: 'number', min: 0 }]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="method" label="Método (opcional)">
                <Input />
              </Form.Item>
            </>
          )}
          {currentPayment && (
            <Form.Item
              name="status"
              label="Estado"
              rules={[{ required: true }]}
            >
              <Select>
                {statusOptions.map(({ label, value }) => (
                  <Option key={value} value={value}>
                    {label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPayments;
