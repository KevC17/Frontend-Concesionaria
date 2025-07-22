import api from './axios';

export const getSales = async () => {
  const response = await api.get('/sales');
  return response.data.data;
};

export const createSale = async (data: any) => {
  const response = await api.post('/sales', data);
  return response.data;
};

export const updateSale = async (id: string, data: any) => {
  const response = await api.put(`/sales/${id}`, data);
  return response.data;
};

export const deleteSale = async (id: string) => {
  const response = await api.delete(`/sales/${id}`);
  return response.data;
};
