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
} from 'antd';
import { getSales, createSale, updateSale, deleteSale } from '../../api/sales';

const AdminSales = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchSales = async () => {
    setLoading(true);
    try {
      const data = await getSales();
      setSales(data);
    } catch {
      message.error('Error al cargar ventas');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSale(id);
      message.success('Venta eliminada');
      fetchSales();
    } catch {
      message.error('Error al eliminar');
    }
  };

  const handleEdit = (sale: any) => {
    setCurrentSale(sale);
    form.setFieldsValue({
      ...sale,
      price: Number(sale.price),
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentSale(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleFinish = async (values: any) => {
    try {
      if (currentSale) {
        await updateSale(currentSale.id, values);
        message.success('Venta actualizada');
      } else {
        await createSale(values);
        message.success('Venta creada');
      }
      fetchSales();
      setIsModalOpen(false);
    } catch {
      message.error('Error al guardar venta');
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Registrar venta
      </Button>
      <Table
        dataSource={sales}
        rowKey="id"
        loading={loading}
        columns={[
          { title: 'ID Usuario', dataIndex: 'userId' },
          { title: 'ID Auto', dataIndex: 'carId' },
          {
            title: 'Precio',
            dataIndex: 'price',
            render: (val) => `$${val}`,
          },
          {
            title: 'Acciones',
            render: (_, record) => (
              <>
                <Button onClick={() => handleEdit(record)} type="link">
                  Editar
                </Button>
                <Popconfirm
                  title="¿Seguro que deseas eliminar esta venta?"
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
        title={currentSale ? 'Editar venta' : 'Registrar venta'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="userId"
            label="ID Usuario"
            rules={[{ required: true, message: 'Por favor ingresa el ID del usuario' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="carId"
            label="ID Auto"
            rules={[{ required: true, message: 'Por favor ingresa el ID del auto' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Precio"
            rules={[{ required: true, message: 'Por favor ingresa el precio' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminSales;
