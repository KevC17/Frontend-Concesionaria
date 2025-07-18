import { Typography, Row, Col, Card, Space } from 'antd';
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  FacebookFilled,
  TwitterSquareFilled,
  InstagramFilled,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const ContactPage = () => {
  return (
    <div style={{ padding: '60px 24px', maxWidth: 900, margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>Contáctanos</Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card bordered>
            <Title level={4}>Información de contacto</Title>
            <Space direction="vertical" size="middle">
              <Paragraph>
                <EnvironmentOutlined /> Av. Principal 123, Quito, Ecuador
              </Paragraph>
              <Paragraph>
                <PhoneOutlined /> +593 2 345 6789
              </Paragraph>
              <Paragraph>
                <MailOutlined /> contacto@concesionaria.com
              </Paragraph>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card bordered>
            <Title level={4}>Síguenos en redes sociales</Title>
            <Space size="large">
              <a href="https://facebook.com/concesionaria" target="_blank" rel="noopener noreferrer">
                <FacebookFilled style={{ fontSize: 32, color: '#1877f2' }} />
              </a>
              <a href="https://twitter.com/concesionaria" target="_blank" rel="noopener noreferrer">
                <TwitterSquareFilled style={{ fontSize: 32, color: '#1da1f2' }} />
              </a>
              <a href="https://instagram.com/concesionaria" target="_blank" rel="noopener noreferrer">
                <InstagramFilled style={{ fontSize: 32, color: '#c13584' }} />
              </a>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ContactPage;
