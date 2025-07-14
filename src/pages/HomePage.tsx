import { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Typography, Empty } from 'antd';
import { Link } from 'react-router-dom';
import { getPublicCars } from '../api/cars';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const data = await getPublicCars(1, 3);
        setCars(data.items || data);
      } catch (error) {
        console.error('Error cargando autos:', error);
        setCars([]);
      }
      setLoading(false);
    };

    fetchCars();
  }, []);

  return (
    <div style={{ padding: '40px 0' }}>
      <div
        style={{
          background: '#f5f5f5',
          padding: '60px 30px',
          textAlign: 'center',
          borderRadius: 8,
          marginBottom: 40,
        }}
      >
        <Title level={2}>Bienvenido a Tu Concesionaria</Title>
        <Paragraph style={{ fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
          Encuentra el auto ideal para ti entre nuestra amplia variedad de vehículos nuevos y usados.
        </Paragraph>
        <div style={{ marginTop: 24 }}>
          <Link to="/cars">
            <Button type="primary" size="large" style={{ marginRight: 16 }}>
              Ver Autos
            </Button>
          </Link>
        </div>
      </div>

      <Title level={3}>Autos destacados</Title>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {loading ? (
          <Col span={24} style={{ textAlign: 'center' }}>
            <p>Cargando autos destacados...</p>
          </Col>
        ) : cars.length === 0 ? (
          <Col span={24} style={{ textAlign: 'center' }}>
            <Empty description="Próximamente estarán disponibles" />
          </Col>
        ) : (
          cars.map((car) => (
            <Col key={car._id || car.id} xs={24} sm={12} md={8}>
              <Link to={`/cars/${car._id || car.id}`}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={`${car.brand} ${car.model}`}
                      src={car.image || 'https://via.placeholder.com/300x200?text=Sin+imagen'}
                    />
                  }
                >
                  <Card.Meta
                    title={`${car.brand} ${car.model} ${car.year}`}
                    description={`$${car.price?.toLocaleString() || 'N/D'}`}
                  />
                </Card>
              </Link>
            </Col>
          ))
        )}
      </Row>
    </div>
  );
};

export default HomePage;
