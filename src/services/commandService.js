import api from './api';

export const createTaskApi = async (station_id, sql_query) => {
  const response = await api.post('/admin/v1/create-task', {
    station_id,
    sql_query
  });
  return response.data;
};
