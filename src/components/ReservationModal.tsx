import { Modal, Form, DatePicker, message, Typography, Divider } from 'antd';
import { createReservation } from '../api/reservations';
import { useAuth } from '../auth/AuthContext';
import { useEffect } from 'react';

const { Title, Paragraph, Text } = Typography;

interface ReservationModalProps {
  open: boolean;
  onClose: () => void;
  carId: string;
  car: {
    brand: string;
    model: string;
    year: number;
    price?: number;
  };
}

const ReservationModal = ({ open, onClose, carId, car }: ReservationModalProps) => {
  const [form] = Form.useForm();
  const { userName } = useAuth();

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open]);

  const handleOk = () => {
    form.submit();
  };

  const onFinish = async (values: any) => {
    try {
      const payload = {
        carId,
        customerName: userName,
        startDate: values.dates[0].toISOString(),
        endDate: values.dates[1].toISOString(),
      };

      await createReservation(payload);
      console.log('Reserva enviada, mostrando mensaje');
      message.success({
        content: 'Reserva creada exitosamente',
        duration: 5,
      });
      onClose();
      form.resetFields();
    } catch (error: any) {
      if (error.response?.status === 409) {
        message.info('Ya has realizado una reserva para este auto en las fechas seleccionadas');
      } else {
        message.error('Error al crear la reserva');
      }
    }
  };

  return (
    <Modal title="Reservar auto" open={open} onCancel={onClose} onOk={handleOk} okText="Reservar">
      <div style={{ marginBottom: 20 }}>
        <Title level={4}>Información del auto</Title>
        <Paragraph>
          <Text strong>Marca:</Text> {car.brand}
        </Paragraph>
        <Paragraph>
          <Text strong>Modelo:</Text> {car.model}
        </Paragraph>
        <Paragraph>
          <Text strong>Año:</Text> {car.year}
        </Paragraph>
        <Paragraph>
          <Text strong>Precio:</Text> ${car.price?.toLocaleString() || 'N/D'}
        </Paragraph>
      </div>

      <Divider />

      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Rango de fechas"
          name="dates"
          rules={[{ required: true, message: 'Seleccione el rango de fechas' }]}
        >
          <DatePicker.RangePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReservationModal;
