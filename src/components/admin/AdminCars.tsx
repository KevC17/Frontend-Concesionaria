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
  Switch,
} from 'antd';
import {
  getAdminCars,
  createCar,
  updateCar,
  deleteCar,
} from '../../api/cars';

const AdminCars = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCar, setCurrentCar] = useState<any>(null);
  const [form] = Form.useForm();

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const fetchCars = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const data = await getAdminCars(pageNumber, pageSize);
      setCars(data.items);
      setTotal(data.meta?.totalItems || 0);
    } catch (error) {
      message.error('Error al cargar autos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCar(id);
      message.success('Auto eliminado');
      fetchCars(page);
    } catch {
      message.error('Error al eliminar');
    }
  };

  const handleEdit = (car: any) => {
    setCurrentCar(car);
    form.setFieldsValue(car);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentCar(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleFinish = async (values: any) => {
    try {
      if (currentCar) {
        await updateCar(currentCar._id, values);
        message.success('Auto actualizado');
      } else {
        await createCar(values);
        message.success('Auto creado');
      }
      setIsModalOpen(false);
      fetchCars(page);
    } catch {
      message.error('Error al guardar auto');
    }
  };

  useEffect(() => {
    fetchCars(page);
  }, [page]);

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Registrar auto
      </Button>

      <Table
        dataSource={cars}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: false,
          onChange: (newPage) => {
            setPage(newPage);
          },
        }}
        columns={[
          { title: 'Marca', dataIndex: 'brand' },
          { title: 'Modelo', dataIndex: 'model' },
          { title: 'Año', dataIndex: 'year' },
          { title: 'VIN', dataIndex: 'vin' },
          {
            title: 'Disponible',
            dataIndex: 'available',
            render: (val) => (val ? 'Sí' : 'No'),
          },
          {
            title: 'Acciones',
            render: (_, record) => (
              <>
                <Button onClick={() => handleEdit(record)} type="link">
                  Editar
                </Button>
                <Popconfirm
                  title="¿Seguro que deseas eliminar este auto?"
                  onConfirm={() => handleDelete(record._id)}
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
        title={currentCar ? 'Editar auto' : 'Registrar auto'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="brand" label="Marca" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="model" label="Modelo" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="year" label="Año" rules={[{ required: true }]}>
            <InputNumber min={1900} max={2100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="vin" label="VIN" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="available"
            label="Disponible"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="price"
            label="Precio"
            rules={[
              { required: true, message: 'Ingrese el precio' },
              { type: 'number', min: 0, message: 'Precio debe ser positivo' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} min={0} step={0.01} />
          </Form.Item>
          <Form.Item
            name="image"
            label="URL Imagen"
            rules={[{ type: 'url', message: 'Ingrese una URL válida' }]}
          >
            <Input placeholder="https://ejemplo.com/imagen.jpg" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCars;
