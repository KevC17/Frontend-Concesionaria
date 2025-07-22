import { useEffect, useState } from 'react';
import { Button, Card, Form, Input, message } from 'antd';
import { useAuth } from '../auth/AuthContext';
import { getUserById, updateUser } from '../api/users';

const ProfilePage = () => {
  const { userId } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [initialValues, setInitialValues] = useState({ username: '', email: '' });

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getUserById(userId)
      .then(({ username, email }) => {
        setInitialValues({ username, email });
        form.setFieldsValue({ username, email });
      })
      .catch(() => {
        message.error('Error al cargar los datos');
      })
      .finally(() => setLoading(false));
  }, [userId, form]);

  const handleSave = () => {
    if (!userId) return;
    form.validateFields().then((values) => {
      setLoading(true);
      updateUser(userId, values)
        .then(() => {
          message.success('Datos actualizados con éxito');
          setInitialValues(values);
          setEditing(false);
        })
        .catch(() => {
          message.error('Error al actualizar los datos');
        })
        .finally(() => setLoading(false));
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card title="Mi Perfil" className="w-full max-w-md">
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          disabled={!editing}
        >
          <Form.Item
            label="Nombre de usuario"
            name="username"
            rules={[{ required: true, message: 'El nombre de usuario es obligatorio' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Correo electrónico"
            name="email"
            rules={[
              { required: true, message: 'El correo electrónico es obligatorio' },
              { type: 'email', message: 'El correo no es válido' },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>

        <div className="flex justify-end gap-2 mt-4">
          {!editing ? (
            <Button type="primary" onClick={() => setEditing(true)}>
              Cambiar datos
            </Button>
          ) : (
            <>
              <Button onClick={() => {
                form.setFieldsValue(initialValues);
                setEditing(false);
              }}>
                Cancelar
              </Button>
              <Button type="primary" onClick={handleSave} loading={loading}>
                Guardar cambios
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
