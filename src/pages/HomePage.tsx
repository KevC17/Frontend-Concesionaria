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
    <div>
      {/* Hero seccion con imagen de fondo */}
      <div
        style={{
          backgroundImage: `url('/hero.jpg')`, // Pon tu imagen en public/hero.jpg
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          textAlign: 'center',
          color: '#fff',
          padding: '0 20px',
        }}
      >
        <Title level={1} style={{ color: '#fff', fontSize: '48px' }}>Bienvenido a Tu Concesionaria</Title>
        <Paragraph style={{ fontSize: 20, maxWidth: 700 }}>
          Encuentra el auto ideal para ti entre nuestra amplia variedad de vehículos nuevos y usados.
        </Paragraph>
        <div style={{ marginTop: 24 }}>
          <Link to="/cars">
            <Button type="primary" size="large">Ver Autos</Button>
          </Link>
        </div>
      </div>

      {/* Contenido al scrollear */}
      <div style={{ padding: '60px 24px' }}>
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
    </div>
  );
};

export default HomePage;
