import { Form, Input, Button, Typography, Row, Col, message } from 'antd';

const { Title, Paragraph } = Typography;

const ContactPage = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log('Mensaje enviado:', values);
    message.success('Tu mensaje ha sido enviado. Te contactaremos pronto.');
    form.resetFields();
  };

  return (
    <div style={{ padding: '40px 0' }}>
      <Title level={2}>Contáctanos</Title>
      <Paragraph style={{ maxWidth: 600 }}>
        ¿Tienes alguna pregunta sobre nuestros autos o servicios? No dudes en escribirnos.
      </Paragraph>

      <Row gutter={32} style={{ marginTop: 32 }}>
        <Col xs={24} md={12}>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Correo electrónico" rules={[{ required: true, type: 'email' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="message" label="Mensaje" rules={[{ required: true }]}>
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Enviar mensaje
              </Button>
            </Form.Item>
          </Form>
        </Col>

        <Col xs={24} md={12}>
          <div>
            <Title level={4}>Información de contacto</Title>
            <Paragraph>
              <strong>Dirección:</strong> Av. Amazonas y NN, Quito, Ecuador
            </Paragraph>
            <Paragraph>
              <strong>Teléfono:</strong> +593 2 600 0000
            </Paragraph>
            <Paragraph>
              <strong>Correo:</strong> contacto@epmsa.com
            </Paragraph>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ContactPage;
