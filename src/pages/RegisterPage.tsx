import { useEffect } from 'react';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

const { Title } = Typography;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      const role = localStorage.getItem('role');
      navigate(role === 'ADMIN' ? '/admin' : '/');
    }
  }, [token]);

  const onFinish = async (values: any) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, values);
      message.success('Usuario registrado correctamente');
      navigate('/login');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error al registrar usuario');
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Card
        style={{
          width: 400,
          padding: 24,
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Title level={3} style={{ textAlign: 'center' }}>
          Registro
        </Title>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Nombre de usuario"
            name="username"
            rules={[{ required: true, message: 'Ingrese su nombre de usuario' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Correo electrónico"
            name="email"
            rules={[
              { required: true, message: 'Ingrese su correo' },
              { type: 'email', message: 'Correo inválido' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: 'Ingrese su contraseña' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Registrarse
            </Button>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="link" block onClick={() => navigate('/')}>
              Volver al inicio
            </Button>
            <Button type="link" block onClick={() => navigate('/login')}>
              ¿Ya tienes una cuenta? Inicia sesión
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
