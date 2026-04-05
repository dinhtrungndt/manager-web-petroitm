import toast from 'react-hot-toast';
import { createTaskApi } from '../../../services/commandService';
import { CREATE_TASK_FAILURE, CREATE_TASK_REQUEST, CREATE_TASK_SUCCESS } from '../CommandTypes';

export const createTaskAction = (station_id, sql_query, onSuccessCb) => async (dispatch) => {
  dispatch({ type: CREATE_TASK_REQUEST });

  try {
    const data = await createTaskApi(station_id, sql_query);

    dispatch({
      type: CREATE_TASK_SUCCESS,
      payload: data,
    });

    toast.success(data.message || 'Giao lệnh thành công!');

    if (onSuccessCb) onSuccessCb();

  } catch (error) {
    const errorMsg = error.response?.data?.error || 'Lỗi khi gửi lệnh!';
    dispatch({
      type: CREATE_TASK_FAILURE,
      payload: errorMsg,
    });
    toast.error(errorMsg);
  }
};
