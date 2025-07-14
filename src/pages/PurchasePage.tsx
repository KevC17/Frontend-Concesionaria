import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Select, Button, Typography, message, Divider, Spin } from 'antd';
import { getCarById } from '../api/cars';
import { createReservation } from '../api/reservations';
import { createSale } from '../api/sales';
import { createPayment } from '../api/payments';
import { createInvoice } from '../api/invoices';
import { useAuth } from '../auth/AuthContext';

const { Title, Paragraph } = Typography;

const PurchasePage = () => {
  const { carId } = useParams();
  const { userId, userName } = useAuth();
  const [form] = Form.useForm();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const data = await getCarById(carId!);
        setCar(data);
      } catch {
        message.error('Error al obtener información del auto');
      } finally {
        setLoading(false);
      }
    };

    if (carId) fetchCar();
  }, [carId]);

  const onFinish = async (values: any) => {
    try {
        if (!userId || !car?._id) return;

        setLoading(true);

        const reservation = await createReservation({
        carId: car._id,
        customerName: userName,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        });

        await createSale({
        userId,
        carId: car._id,
        price: car.price,
        });

        await createPayment({
        reservationId: reservation.id,
        amount: car.price,
        method: values.method,
        });

        await createInvoice({
        userId,
        reservationId: reservation.id,
        amount: car.price,
        status: 'unpaid',
        });

        message.success('Compra realizada exitosamente');
        navigate('/');
    } catch (error) {
        message.error('Error al procesar la compra');
    } finally {
        setLoading(false);
    }
    };

  if (loading) return <Spin style={{ marginTop: 100 }} tip="Procesando..." />;

  if (!car) return null;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 32 }}>
      <Title level={2}>Confirmar Compra</Title>

      <Paragraph><strong>Marca:</strong> {car.brand}</Paragraph>
      <Paragraph><strong>Modelo:</strong> {car.model}</Paragraph>
      <Paragraph><strong>Año:</strong> {car.year}</Paragraph>
      <Paragraph><strong>Precio:</strong> ${car.price?.toLocaleString()}</Paragraph>

      <Divider />

      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Método de pago"
          name="method"
          rules={[{ required: true, message: 'Seleccione un método de pago' }]}
        >
          <Select placeholder="Seleccione">
            <Select.Option value="efectivo">Efectivo</Select.Option>
            <Select.Option value="tarjeta">Tarjeta</Select.Option>
            <Select.Option value="transferencia">Transferencia</Select.Option>
            <Select.Option value="cheque">Cheque</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Confirmar Compra
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PurchasePage;
