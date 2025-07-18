import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Switch,
  Select,
} from 'antd';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../../api/users';

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [form] = Form.useForm();

  // 👇 Estados de paginación
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  // ✅ Obtener usuarios con paginación
  const fetchUsers = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const data = await getUsers(pageNumber, pageSize);
      setUsers(data.items || []);
      setTotal(data.meta?.totalItems || 0);
    } catch {
      message.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      message.success('Usuario eliminado');
      fetchUsers(page);
    } catch {
      message.error('Error al eliminar');
    }
  };

  const handleEdit = (user: any) => {
    setCurrentUser(user);
    form.setFieldsValue(user);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleFinish = async (values: any) => {
    try {
      if (currentUser) {
        await updateUser(currentUser._id, values);
        message.success('Usuario actualizado');
      } else {
        await createUser(values);
        message.success('Usuario creado');
      }
      setIsModalOpen(false);
      fetchUsers(page);
    } catch {
      message.error('Error al guardar usuario');
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Crear usuario
      </Button>
      <Table
        dataSource={users}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: false,
          onChange: (newPage) => setPage(newPage),
        }}
        columns={[
          { title: 'Usuario', dataIndex: 'username' },
          { title: 'Correo', dataIndex: 'email' },
          {
            title: 'Perfil',
            dataIndex: 'profile',
            render: (value: string) => value || 'Sin perfil',
          },
          {
            title: 'Activo',
            dataIndex: 'isActive',
            render: (value: boolean) => (value ? 'Sí' : 'No'),
          },
          {
            title: 'Rol',
            dataIndex: 'role',
            render: (role: string) =>
              role === 'ADMIN' ? 'Administrador' : 'Usuario',
          },
          {
            title: 'Acciones',
            render: (_, record) => (
              <>
                <Button onClick={() => handleEdit(record)} type="link">
                  Editar
                </Button>
                <Popconfirm
                  title="¿Seguro que deseas eliminar este usuario?"
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
        title={currentUser ? 'Editar usuario' : 'Crear usuario'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="username"
            label="Usuario"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Correo" rules={[{ type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="profile" label="Perfil">
            <Input />
          </Form.Item>
          <Form.Item
            name="isActive"
            label="Activo"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="role"
            label="Rol"
            rules={[{ required: true, message: 'Selecciona un rol' }]}
          >
            <Select placeholder="Selecciona un rol">
              <Select.Option value="USER">Usuario</Select.Option>
              <Select.Option value="ADMIN">Administrador</Select.Option>
            </Select>
          </Form.Item>
          {!currentUser && (
            <Form.Item
              name="password"
              label="Contraseña"
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUsers;
