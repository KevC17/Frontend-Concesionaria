import api from './axios';

export const getInvoices = async () => {
  const response = await api.get('/admin/invoices');
  return response.data;
};

export const createInvoice = async (data: any) => {
  const response = await api.post('/admin/invoices', data);
  return response.data;
};

export const updateInvoice = async (id: string, data: any) => {
  const response = await api.put(`/admin/invoices/${id}`, data);
  return response.data;
};

export const deleteInvoice = async (id: string) => {
  const response = await api.delete(`/admin/invoices/${id}`);
  return response.data;
};
