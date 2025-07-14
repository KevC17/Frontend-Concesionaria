import { useEffect, useState } from 'react';
import { Card, Col, Row, Typography, Empty, Spin, Input } from 'antd';
import { getPublicCars } from '../api/cars';
import { Link } from 'react-router-dom';

const { Title } = Typography;
const { Search } = Input;

const CarsPage = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCars = async (search = '') => {
    setLoading(true);
    try {
      const data = await getPublicCars(1, 100, search);
      setCars(data.items || data);
    } catch (error) {
      console.error('Error cargando autos:', error);
      setCars([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCars(searchTerm);
  }, [searchTerm]);

  return (
    <div style={{ padding: '40px' }}>
      <Title level={2}>Autos disponibles</Title>
      <Search
        placeholder="Buscar por marca o modelo"
        allowClear
        enterButton="Buscar"
        size="large"
        onSearch={(value) => setSearchTerm(value.trim())}
        style={{ marginBottom: 24, maxWidth: 400 }}
      />

      {loading ? (
        <Spin tip="Cargando autos..." size="large" />
      ) : cars.length === 0 ? (
        <Empty description="No hay autos disponibles por ahora" />
      ) : (
        <Row gutter={[16, 16]}>
          {cars.map((car) => (
            <Col key={car._id || car.id} xs={24} sm={12} md={8} lg={6}>
              <Link to={`/cars/${car._id || car.id}`}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={`${car.brand} ${car.model}`}
                      src={car.image || 'https://via.placeholder.com/300x200?text=Sin+imagen'}
                      style={{ objectFit: 'cover', height: 200 }}
                    />
                  }
                >
                  <Card.Meta
                    title={`${car.brand} ${car.model} (${car.year})`}
                    description={
                      <>
                        <p>Precio: ${car.price?.toLocaleString() || 'N/D'}</p>
                        <p>VIN: {car.vin}</p>
                        <p>Disponible: {car.available ? 'Sí' : 'No'}</p>
                      </>
                    }
                  />
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default CarsPage;
