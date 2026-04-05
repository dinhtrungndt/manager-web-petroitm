import api from './api';

export const loginApi = async (username, password) => {
  const response = await api.post('/login', { username, password });
  return response.data;
};
