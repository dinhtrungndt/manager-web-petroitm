import api from './api';

export const getStationsApi = async () => {
  const response = await api.get('/admin/v1/stations');
  return response.data;
};
