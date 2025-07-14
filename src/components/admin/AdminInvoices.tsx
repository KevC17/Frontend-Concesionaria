import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { getInvoices, createInvoice, updateInvoice, deleteInvoice } from '../../api/invoices';
import dayjs from 'dayjs';

const { Option } = Select;

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const data = await getInvoices();
      setInvoices(data);
    } catch {
      message.error('Error al cargar facturas');
    }
    setLoading(false);
  };

  const handleEdit = (invoice: any) => {
    setCurrentInvoice(invoice);
    form.setFieldsValue(invoice);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentInvoice(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleFinish = async (values: any) => {
    try {
      if (currentInvoice) {
        await updateInvoice(currentInvoice.id, values);
        message.success('Factura actualizada');
      } else {
        await createInvoice(values);
        message.success('Factura creada');
      }
      fetchInvoices();
      setIsModalOpen(false);
    } catch {
      message.error('Error al guardar factura');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInvoice(id);
      message.success('Factura eliminada');
      fetchInvoices();
    } catch {
      message.error('Error al eliminar factura');
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Registrar factura
      </Button>
      <Table
        dataSource={invoices}
        rowKey="id"
        loading={loading}
        columns={[
          { title: 'Usuario', dataIndex: 'userId' },
          { title: 'Reserva', dataIndex: 'reservationId' },
          { title: 'Monto', dataIndex: 'amount' },
          { title: 'Estado', dataIndex: 'status' },
          {
            title: 'Emitida',
            dataIndex: 'issuedAt',
            render: (val) => dayjs(val).format('YYYY-MM-DD HH:mm'),
          },
          {
            title: 'Acciones',
            render: (_, record) => (
              <>
                <Button onClick={() => handleEdit(record)} type="link">
                  Editar
                </Button>
                <Button onClick={() => handleDelete(record.id)} danger type="link">
                  Eliminar
                </Button>
              </>
            ),
          },
        ]}
      />

      <Modal
        title={currentInvoice ? 'Editar factura' : 'Registrar factura'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="userId" label="ID Usuario" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="reservationId" label="ID Reserva" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="amount" label="Monto" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="status" label="Estado" rules={[{ required: true }]}>
            <Select>
              <Option value="unpaid">No Pagado</Option>
              <Option value="paid">Pagado</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminInvoices;
