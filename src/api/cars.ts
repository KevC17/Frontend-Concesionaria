import api from './axios';

export const getPublicCars = async (page = 1, limit = 10, search = '') => {
  const response = await api.get('/cars', {
    params: { page, limit, search },
  });
  return response.data;
};

export const getAdminCars = async (page = 1, limit = 10) => {
  const response = await api.get('/admin/cars', {
    params: { page, limit },
  });
  return response.data;
};

export const getCarById = async (id: string) => {
  const response = await api.get(`/cars/${id}`);
  return response.data;
};

export const createCar = async (data: any) => {
  const response = await api.post('/admin/cars', data);
  return response.data;
};

export const updateCar = async (id: string, data: any) => {
  const response = await api.put(`/admin/cars/${id}`, data);
  return response.data;
};

export const deleteCar = async (id: string) => {
  const response = await api.delete(`/admin/cars/${id}`);
  return response.data;
};
