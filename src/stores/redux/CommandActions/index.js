import toast from 'react-hot-toast';
import { createTaskApi } from '../../../services/commandService';
import { CREATE_TASK_FAILURE, CREATE_TASK_REQUEST, CREATE_TASK_SUCCESS } from '../CommandTypes';

export const createTaskAction = (station_ids, sql_queries, zalo_group, onSuccessCb) => async (dispatch) => {
  dispatch({ type: CREATE_TASK_REQUEST });

  try {
    const data = await createTaskApi(station_ids, sql_queries, zalo_group);

    dispatch({
      type: CREATE_TASK_SUCCESS,
      payload: data,
    });

    toast.success(`Đã giao ${sql_queries.length} lệnh đến ${station_ids.length} trạm!`);

    if (onSuccessCb) onSuccessCb(data.commandIds);

  } catch (error) {
    const errorMsg = error.response?.data?.error || 'Lỗi khi gửi lệnh!';
    dispatch({
      type: CREATE_TASK_FAILURE,
      payload: errorMsg,
    });
    toast.error(errorMsg);
  }
};
