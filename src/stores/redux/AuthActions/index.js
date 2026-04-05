import toast from 'react-hot-toast';
import { loginApi } from '../../../services/authService';
import { removeToken, setToken } from '../../../utils/Token';
import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT } from '../AuthTypes';

export const loginAction = (username, password, navigate) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const data = await loginApi(username, password);

    setToken(data.token);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: data.user,
    });

    toast.success('Đăng nhập thành công!');

    if (navigate) {
      navigate('/admin', { replace: true });
    }
  } catch (error) {
    const errorMsg = error.response?.data?.error || 'Kết nối đến Server thất bại!';
    dispatch({
      type: LOGIN_FAILURE,
      payload: errorMsg,
    });
    toast.error(errorMsg);
  }
};

export const logoutAction = (navigate) => (dispatch) => {
  removeToken();
  dispatch({ type: LOGOUT });
  toast.success('Đã đăng xuất!');
  if (navigate) {
    navigate('/login', { replace: true });
  }
};
