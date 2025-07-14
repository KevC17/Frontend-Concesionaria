import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Typography,
  Button,
  Spin,
  Empty,
  message,
  Divider,
} from 'antd';
import { getCarById } from '../api/cars';
import { useAuth } from '../auth/AuthContext';
import ReservationModal from '../components/ReservationModal';

const { Title, Paragraph, Text } = Typography;

const CarDetailPage = () => {
  const { id } = useParams();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      try {
        const data = await getCarById(id!);
        setCar(data);
      } catch (error) {
        message.error('Error al cargar el auto');
      }
      setLoading(false);
    };

    fetchCar();
  }, [id]);

  const handleProtectedAction = (action: string) => {
    if (!token) {
      message.warning('Debes iniciar sesión para continuar');
      navigate('/login');
      return;
    }

    if (action === 'reserva') {
      setIsModalVisible(true);
    } else if (action === 'compra') {
      navigate(`/purchase/${car._id}`);
    }
  };

  if (loading) return <Spin tip="Cargando auto..." style={{ marginTop: 40 }} />;
  if (!car) return <Empty description="Auto no encontrado" style={{ marginTop: 40 }} />;

  return (
    <div style={{ padding: '40px' }}>
      <Row gutter={32}>
        <Col xs={24} md={10}>
          <img
            src={car.image || 'https://via.placeholder.com/600x400?text=Sin+imagen'}
            alt={`${car.brand} ${car.model}`}
            style={{ width: '100%', borderRadius: 8, objectFit: 'cover', maxHeight: 400 }}
          />
        </Col>

        <Col xs={24} md={14}>
          <Title level={2}>{car.brand} {car.model} ({car.year})</Title>
          <Divider />
          <Paragraph><Text strong>Precio:</Text> ${car.price?.toLocaleString()}</Paragraph>
          <Paragraph><Text strong>VIN:</Text> {car.vin}</Paragraph>
          <Paragraph><Text strong>Disponible:</Text> {car.available ? 'Sí' : 'No'}</Paragraph>
          <Divider />

          {car.available ? (
            token ? (
              <div style={{ display: 'flex', gap: 16 }}>
                <Button type="primary" onClick={() => handleProtectedAction('reserva')}>
                  Reservar
                </Button>
                <Button danger onClick={() => handleProtectedAction('compra')}>
                  Comprar
                </Button>
              </div>
            ) : (
              <Paragraph type="warning">
                <Text type="secondary">
                  Para reservar o comprar este auto necesitas iniciar sesión.
                </Text>
                <br />
                <Button type="link" onClick={() => navigate('/login')}>Iniciar sesión</Button>
              </Paragraph>
            )
          ) : (
            <Text type="danger">Este auto no está disponible actualmente.</Text>
          )}
        </Col>
      </Row>

      <ReservationModal
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        carId={car._id}
        car={car}
      />
    </div>
  );
};

export default CarDetailPage;
