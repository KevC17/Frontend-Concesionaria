import { useEffect } from 'react';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { login } from '../api/auth';

const { Title } = Typography;

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setToken, token } = useAuth();

  useEffect(() => {
    if (token) {
      const role = localStorage.getItem('role');
      navigate(role === 'ADMIN' ? '/admin' : '/');
    }
  }, [token]);

  const onFinish = async (values: any) => {
    try {
      const data = await login(values);
      const payload = parseJwt(data.access_token);
      const userId = payload?.sub || null;
      const userName = payload?.username || null;
      setToken(data.access_token, userId, userName);
      localStorage.setItem('role', data.role);
      message.success('Login exitoso');
      navigate(data.role === 'ADMIN' ? '/admin' : '/');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error al iniciar sesión');
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
          width: 350,
          padding: 24,
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          backgroundColor: '#fff',
        }}
      >
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          Iniciar sesión
        </Title>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Correo"
            name="email"
            rules={[{ required: true, type: 'email', message: 'Correo inválido' }]}
          >
            <Input placeholder="ejemplo@correo.com" />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: 'Ingresa tu contraseña' }]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Ingresar
            </Button>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="link" block onClick={() => navigate('/')}>
              Volver al inicio
            </Button>
            <Button type="link" block onClick={() => navigate('/register')}>
              ¿No tienes una cuenta? Regístrate
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
