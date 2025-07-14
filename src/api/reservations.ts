import api from './axios';

export const getReservations = async () => {
  const response = await api.get('/admin/reservations');
  return response.data;
};

export const createReservation = async (data: any) => {
  const response = await api.post('/admin/reservations', data);
  return response.data;
};

export const updateReservation = async (id: string, data: any) => {
  const response = await api.put(`/admin/reservations/${id}`, data);
  return response.data;
};

export const deleteReservation = async (id: string) => {
  const response = await api.delete(`/admin/reservations/${id}`);
  return response.data;
};
