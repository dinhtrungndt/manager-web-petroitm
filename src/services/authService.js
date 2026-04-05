import api from './api';

export const loginApi = async (username, password) => {
  const response = await api.post('/admin/v1/login', { username, password });
  return response.data;
};
