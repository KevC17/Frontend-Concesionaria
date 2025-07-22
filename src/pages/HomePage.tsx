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
      {/* Sección Hero con parallax */}
      <div
        style={{
          backgroundImage: `url('/hero.jpg')`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 20px',
        }}
      >
        {/* Capa oscura sobre la imagen */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)', // Oscurece la imagen
            zIndex: 1,
          }}
        ></div>

        {/* Contenedor de texto opaco */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.85)', // Fondo blanco opaco
            padding: '40px',
            borderRadius: 12,
            zIndex: 2,
            maxWidth: 700,
          }}
        >
          <Title level={1} style={{ color: '#000', fontSize: '40px' }}>
            Bienvenido/a a Fast
          </Title>
          <Paragraph style={{ fontSize: 18, color: '#333' }}>
            Encuentra el auto ideal para ti entre nuestra amplia variedad de vehículos de lujo.
          </Paragraph>
          <div style={{ marginTop: 24 }}>
            <Link to="/cars">
              <Button type="primary" size="large">Ver Autos</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
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
