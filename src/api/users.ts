import api from './axios';

export const getUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const createUser = async (data: any) => {
  const response = await api.post('/admin/users', data);
  return response.data;
};

export const updateUser = async (id: string, data: any) => {
  const response = await api.put(`/admin/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};
