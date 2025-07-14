import api from './axios';

export interface LoginPayload {
  email: string;
  password: string;
}

export const login = async (data: LoginPayload) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

