import api from './api';

export const createTaskApi = async (station_ids, sql_queries) => {
  const response = await api.post('/admin/v1/create-task', {
    station_ids,
    sql_queries
  });
  return response.data;
};
