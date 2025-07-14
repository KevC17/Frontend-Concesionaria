import api from './axios';

export const getPayments = async () => {
  const response = await api.get('/admin/payments');
  return response.data;
};

export const createPayment = async (data: any) => {
  const response = await api.post('/admin/payments', data);
  return response.data;
};

export const updatePaymentStatus = async (id: string, data: any) => {
  const response = await api.put(`/admin/payments/${id}/status`, data);
  return response.data;
};

export const deletePayment = async (id: string) => {
  const response = await api.delete(`/admin/payments/${id}`);
  return response.data;
};
